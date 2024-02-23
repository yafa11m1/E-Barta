import React, { useEffect, useState } from 'react';
import { UserAuth } from '../Context/AuthContext';
import Messages from './messages';
import { GetRSApubKey, updateInfoRSA, updatePubkey, userInfo } from '../firedb';
import Input from '@/app/components/input';
import CryptoJS from 'crypto-js';
import { decryptWithPrivateKeyInteger, encryptWithPublicKeyInteger, generateRandomValue } from '../rsa';
import { inDB } from '../inDB';
import lock from '../img/lock.png'
import Image from 'next/image';

const Chatbox = ({ user, myRsa, uid }) => {
    // 
    const { placeholderurl } = UserAuth();




    const [info, setInfo] = useState({
        Uid: "",
        PhotoUrl: "",
        Email: "",
        Fullname: "",
        Myname:""
    })

    const id = uid;
    const [chatId, setchatId] = useState(user ? user.uid > id ? user.uid + id : id + user.uid : "loading")

    useEffect(() => {
        setchatId(user ? user.uid > id ? user.uid + id : id + user.uid : "loading")

    }, [uid])
    // user
    // 
    // Function to scroll the chat box to the bottom
    const scrollToBottom = () => {
        const chatBox = document.getElementById('messagescroll');
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    };

    useEffect(() => {
        // Call scrollToBottom when the component is mounted
        scrollToBottom();

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('load', scrollToBottom);
        };
    }, [id]); // Empty dependency array ensures that this effect runs only once after the initial render

    useEffect(() => {
        const exchangeKey = async () => {

            // const keys = JSON.parse(sessionStorage.getItem(chatId));
            const keys2 = await inDB.chatCred.where("chatId").equals(chatId).first();

            if (keys2 && keys2.iv != '') {

                // 
                const secret = keys2.iv + ":" + keys2.key;

                GetRSApubKey(chatId, id).then((Frndkey) => {
                    // Updating Encrypted Keys

                    const encSecret = encryptWithPublicKeyInteger(secret, Frndkey.RSA); // ecncrypted IV and Key with Friends RSA Pub key
                    updatePubkey(chatId, user.uid, encSecret);
                    if (Frndkey.AES != '') {
                        decryptWithPrivateKeyInteger(Frndkey.AES, user.uid).then((frndAESKey) => {
                            const [FiV, Fkey] = frndAESKey.split(":");


                            const updatedkeys = {
                                ...keys2,
                                frnd_iv: FiV,
                                frnd_key: Fkey
                            }

                            inDB.chatCred.put(updatedkeys)

                        })
                    }





                });
            }
            else {

                const IV = generateRandomValue();
                const KEY = generateRandomValue();
                inDB.chatCred.add({
                    chatId: chatId,
                    iv: IV,
                    key: KEY,
                    frnd_iv: '',
                    frnd_key: ''

                }).then(() => {
                    const secret = IV + ":" + KEY;
                    GetRSApubKey(chatId, id).then((Frndkey) => {
                        // Updating Encrypted Keys
                        const encSecret = encryptWithPublicKeyInteger(secret, Frndkey.RSA); // ecncrypted IV and Key with Friends RSA Pub key

                        updatePubkey(chatId, user.uid, encSecret);
                    })
                })
                const reloadTimeout = setTimeout(() => {
                    location.reload();
                }, 5000);

                // Cleanup function to clear the timeout when the component is unmounted
                return () => {
                    clearTimeout(reloadTimeout);
                };
            }

        }



        if (chatId != 'loading' && !chatId.includes('null')) {
            exchangeKey();
        }

     

    }, [uid])
    //   
    useEffect(() => {
        userInfo(id).then((r) => {
            setInfo({
                ...r,
                Myname:user.displayName
            });
            // 
        })
    }, [id])






    return (

        <div id="third " className="w-full animate-slide-in-from-right xl:col-span-8 lg:col-span-7 md:col-span-10 sm:col-span-9 col-span-9 px-1    " >
            <div className="h-screen  flex flex-col justify-between ">
                <div className="p-6  bg-gray-200 rounded-lg">
                    <div className="  flex  justify-between">
                        <div className="flex items-center">
                            <div >
                                <a href="#"> <img src={info && info.PhotoUrl || placeholderurl} alt="" className="rounded-full w-12 h-12  " /></a>
                            </div>
                            <div className="ml-4">
                                <strong>{info && info.Fullname || 'User Name'} </strong>

                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                        <div className="flex items-center">
                            <Image src={lock} alt="Lock" className="mr-2" />
                            <span className="text-center mb-0">End-to-end encrypted</span>
                        </div>
                    </div>

                    </div>
                    


                </div>


                <div className="overflow-auto " id='messagescroll'>
                    <Messages  user={user} id ={id} freindname={info? info.Fullname:""} myname={info? info.Myname:""}  scroll={scrollToBottom} freindphoto={info && info.PhotoUrl} ChatId={chatId} />
                </div>





                <div className="bg-gray-100 rounded-xl">
                    {/* input  */}
                    <Input keys={myRsa} user={user} ChatId={chatId} />
                </div>

            </div>
            <script>
                {
                    `const chatBox = document.getElementById('messagescroll');

                    // Function to scroll the chat box to the bottom
                    function scrollToBottom() {
                    chatBox.scrollTop = chatBox.scrollHeight;
                    }
                    
                    window.onload = scrollToBottom;`
                }
            </script>

        </div>

    );
}

export default Chatbox;
