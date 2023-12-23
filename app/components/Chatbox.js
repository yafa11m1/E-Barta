import React, { useEffect, useState } from 'react';
import { UserAuth } from '../Context/AuthContext';
import Messages from './messages';
import { GetRSApubKey, updateInfoRSA, updatePubkey, userInfo } from '../firedb';
import Input from '@/app/components/input';
import CryptoJS from 'crypto-js';
import { decryptWithPrivateKeyInteger, encryptWithPublicKeyInteger, generateRandomValue } from '../rsa';
import { inDB } from '../inDB';


const Chatbox = ({user,myRsa,uid}) => {
    // console.log(uid);
    const {placeholderurl } = UserAuth();
    

    

    const [info,setInfo] = useState({
        Uid:"",
        PhotoUrl:"",
        Email:"",
        Fullname:""
    })
    
    const id = uid;
    const [chatId, setchatId] = useState(user ? user.uid > id ? user.uid + id : id + user.uid : "loading")
    
    useEffect(()=>{
        setchatId(user ? user.uid > id ? user.uid + id : id + user.uid : "loading")
        console.log(id,chatId);
    },[uid])
    // userconsole.log('use: ',user.uid)
    // console.log(id)
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

    useEffect(()=>{
        const exchangeKey = async ()=> {
          
                // const keys = JSON.parse(sessionStorage.getItem(chatId));
                const keys2 = await inDB.chatCred.where("chatId").equals(chatId).first();
                console.log(keys2)
                if(keys2&&keys2.iv!=''){
    
                    // console.log(keys);
                    const secret = keys2.iv+":"+keys2.key;
                    console.log(secret);
                    GetRSApubKey(chatId,id).then((Frndkey)=>{
                    // Updating Encrypted Keys
                    console.log(Frndkey)
                    const encSecret = encryptWithPublicKeyInteger(secret,Frndkey.RSA); // ecncrypted IV and Key with Friends RSA Pub key
                    updatePubkey(chatId,user.uid,encSecret);
                    if(Frndkey.AES!=''){
                        decryptWithPrivateKeyInteger(Frndkey.AES,user.uid).then((frndAESKey)=>{
                            const [FiV, Fkey] = frndAESKey.split(":");
                            console.log(frndAESKey)
    
                            const updatedkeys = {
                                ...keys2,
                                frnd_iv:FiV,
                                frnd_key:Fkey
                            }
                            // sessionStorage.setItem(chatId,JSON.stringify(updatedkeys));
                            console.log(updatedkeys)
                            inDB.chatCred.put(updatedkeys)
    
                        })
                    }
                    console.log("friend: ",Frndkey)
                  
                    
                    
                    
                });
                }
                else{
                    console.log("not found",keys2);
                    // sessionStorage.setItem(chatId,JSON.stringify({
                    //     iv:generateRandomValue(),
                    //     key:generateRandomValue(),
                    //     Id:chatId,
                    //     friend_iv:'',
                    //     friend_key:''
                    //  }))
    //   chatCred: 'chatId, iv, key, frnd_iv, frnd_key',
                        const IV = generateRandomValue();
                        const KEY = generateRandomValue();
                        inDB.chatCred.add({
                            chatId:chatId,
                            iv:IV,
                            key:KEY,
                            frnd_iv:'',
                            frnd_key:''
                        
                        }).then(()=>{
                            const secret = IV+":"+KEY;
                            GetRSApubKey(chatId,id).then((Frndkey)=>{
                                // Updating Encrypted Keys
                                const encSecret = encryptWithPublicKeyInteger(secret,Frndkey.RSA); // ecncrypted IV and Key with Friends RSA Pub key
                                
                                updatePubkey(chatId,user.uid,encSecret);
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
        
            
            
            // keys&&keys.iv==""?setSecret(keys):setSecret({
            //         iv:generateRandomValue(),
            //         key:generateRandomValue(),
            //         Id:chatId
            // })
            // console.log(secretKey);
            // sessionStorage.setItem(chatId,JSON.stringify(secretKey));
            // const secret = secretKey.iv+":"+secretKey.key; // iv and key for exchange
            // GetRSApubKey(chatId,id).then((FrndPubkey)=>{
            //     //Updating Encrypted Keys
            //     // const encSecret = encryptWithPublicKeyInteger(secret,FrndPubkey); // ecncrypted IV and Key with Friends RSA Pub key
            //     // updatePubkey(chatId,user.uid,encSecret);
            // });
            if(chatId!='loading'&&!chatId.includes('null')){
                exchangeKey();
            }
            
            // return () => {
            //     exchangeKey();
            //   };

        
    },[uid])
//   console.log(chatId);
  useEffect(()=>{
    userInfo(id).then((r)=>{
        setInfo(r);
        // console.log(info);
    }) 
},[id])




    return (
       
            <div id="third " class="w-full xl:col-span-8 lg:col-span-7 md:col-span-11 sm:col-span-10 col-span-10 px-3  h-screen  " >
            <div class="h-screen  flex flex-col justify-between ">
                <div class="pt-4  bg-gray-200">
                    <div class="  flex  justify-between">
                        <div class="flex items-center">
                        <div >
                            <a href="#"> <img src={info&&info.PhotoUrl || placeholderurl} alt="" class="rounded-full w-12 h-12  "/></a>
                        </div>
                        <div class="ml-4">
                            <strong>{info&&info.Fullname || 'User Name'} </strong>
                            
                        </div>
                        </div>
                        
        
                        </div>
                        {/* <hr class="m-x-1 mt-2"/> */}
                    
                
                </div>
    
    
    <div class="overflow-auto " id='messagescroll'>   
    <Messages user={user} scroll={scrollToBottom} freindphoto ={info&&info.PhotoUrl} ChatId={chatId} />
    </div>    
    
    
    
    
    
                <div class="">
                    {/* input  */}
                    <Input keys={myRsa} user={user} ChatId={chatId}/>
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
