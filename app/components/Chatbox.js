import React, { useEffect, useState } from 'react';
import { UserAuth } from '../Context/AuthContext';
import Messages from './messages';
import { GetRSApubKey, updateInfoRSA, updatePubkey, userInfo } from '../firedb';
import Input from '@/app/components/input';
import CryptoJS from 'crypto-js';
import crypto from 'crypto';
import { decryptWithPrivateKeyInteger, encryptWithPublicKeyInteger } from '../rsa';
import { useRouter } from 'next/router';


const Chatbox = ({uid}) => {
    // console.log(uid);
    const { user,placeholderurl } = UserAuth();

    const generateRandomValue = () => {
        // Generate a random 16-byte value (128 bits) and convert it to a hex string
        return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
      };

    const [info,setInfo] = useState({
        Uid:"",
        PhotoUrl:"",
        Email:"",
        Fullname:""
    })
    
    
    const id = uid;
    const chatId = user ? user.uid > id ? user.uid + id : id + user.uid : "loading";
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
        if(typeof window  !== 'undefined'&& chatId !=='loading' && id){
            const keys = JSON.parse(sessionStorage.getItem(chatId));
            // console.log(keys)
            if(keys&&keys.iv!=''){

                console.log(keys);
                const secret = keys.iv+":"+keys.key;
                console.log(secret);
                GetRSApubKey(chatId,id).then((Frndkey)=>{
                // Updating Encrypted Keys
                console.log("friend: ",Frndkey)
                const encSecret = encryptWithPublicKeyInteger(secret,Frndkey.RSA); // ecncrypted IV and Key with Friends RSA Pub key
                updatePubkey(chatId,user.uid,encSecret);
                const frndAESKey = decryptWithPrivateKeyInteger(Frndkey.AES,sessionStorage.getItem("MyPriv"),sessionStorage.getItem("MyPub"))
                const [FiV, Fkey] = frndAESKey.split(":");
                const updatedkeys = {
                    ...keys,
                    friend_iv:FiV,
                    friend_key:Fkey
                }
                sessionStorage.setItem(chatId,JSON.stringify(updatedkeys));
                
            });
            }
            else{
                console.log("not found",keys);
                sessionStorage.setItem(chatId,JSON.stringify({
                    iv:generateRandomValue(),
                    key:generateRandomValue(),
                    Id:chatId,
                    friend_iv:'',
                    friend_key:''
                 }))
                 const reloadTimeout = setTimeout(() => {
                    location.reload();
                  }, 5000);
              
                  // Cleanup function to clear the timeout when the component is unmounted
                  return () => {
                    clearTimeout(reloadTimeout);
                  };
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
            

        }
    },[id,chatId])
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
    <Messages scroll={scrollToBottom} freindphoto ={info&&info.PhotoUrl} ChatId={chatId} />
    </div>    
    
    
    
    
    
                <div class="">
                    {/* input  */}
                    <Input ChatId={chatId}/>
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
