import React, { useEffect, useState } from 'react';
import { UserAuth } from '../Context/AuthContext';
import Messages from './messages';
import { GetRSApubKey, updateInfoRSA, updatePubkey, userInfo } from '../firedb';
import Input from '@/app/components/input';
import CryptoJS from 'crypto-js';
import { decryptWithPrivateKeyInteger, encryptWithPublicKeyInteger, generateRandomValue } from '../rsa';
import { inDB } from '../inDB';


const Chatbox = ({user,myRsa,uid}) => {
     // 
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
         
     },[uid])
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
 
     useEffect(()=>{
         const exchangeKey = async ()=> {
           
                 // const keys = JSON.parse(sessionStorage.getItem(chatId));
                 const keys2 = await inDB.chatCred.where("chatId").equals(chatId).first();
                 
                 if(keys2&&keys2.iv!=''){
     
                     // 
                     const secret = keys2.iv+":"+keys2.key;
                     
                     GetRSApubKey(chatId,id).then((Frndkey)=>{
                     // Updating Encrypted Keys
                     
                     const encSecret = encryptWithPublicKeyInteger(secret,Frndkey.RSA); // ecncrypted IV and Key with Friends RSA Pub key
                     updatePubkey(chatId,user.uid,encSecret);
                     if(Frndkey.AES!=''){
                         decryptWithPrivateKeyInteger(Frndkey.AES,user.uid).then((frndAESKey)=>{
                             const [FiV, Fkey] = frndAESKey.split(":");
                             
     
                             const updatedkeys = {
                                 ...keys2,
                                 frnd_iv:FiV,
                                 frnd_key:Fkey
                             }
                             // sessionStorage.setItem(chatId,JSON.stringify(updatedkeys));
                             
                             inDB.chatCred.put(updatedkeys)
     
                         })
                     }
                     
                   
                     
                     
                     
                 });
                 }
                 else{
                     
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
             // 
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
 //   
   useEffect(()=>{
     userInfo(id).then((r)=>{
         setInfo(r);
         // 
     }) 
 },[id])
 
 
 
 


    return (
       
            <div id="third " class="w-full xl:col-span-8 lg:col-span-7 md:col-span-10 sm:col-span-9 col-span-9 px-1    " >
            <div class="h-screen  flex flex-col justify-between ">
                <div class="p-6  bg-gray-200 rounded-lg">
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
    <Messages user={user} freindname = {info&&info.Fullname} scroll={scrollToBottom} freindphoto ={info&&info.PhotoUrl} ChatId={chatId} />
    </div>    
    
    
    
    
    
                <div class="bg-gray-100 rounded-xl">
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
