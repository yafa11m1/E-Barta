import React, { useContext, useEffect, useRef, useState } from "react";
import { UserAuth } from "../Context/AuthContext";
import { decryptAES } from "../aes";
import { inDB } from "../inDB";
import { exchangeKey } from "../firedb";
import { useRouter } from 'next/navigation';



const Message = ({ user, freindname,  message, freindphoto,ChatId,myname }) => {
  const { placeholderurl} = UserAuth();
  const [keys, setMyRSA] = useState(null);
  const [msg, setMsg] = useState("Loading...");
  

 
  useEffect(()=>{
    const keySet = async()=> {
      const chatkey = await inDB.chatCred.where("chatId").equals(ChatId).first();
        // 
        setMyRSA(chatkey)
        if(message.SenderId != user.uid && chatkey.frnd_iv==""){
          await exchangeKey(user.uid, ChatId.replace(user.uid, ""))
        
        }
        
    }
    if(ChatId){
      keySet();
    }
   

},[user])



useEffect(()=>{
  const loadmsg = ()=>{
    if(message.SenderId == user.uid ){
      const plaintxt =  decryptAES(message.Text,keys.key, keys.iv)
      setMsg(plaintxt)
    
    }
    else{
      const plaintxt = decryptAES(message.Text,keys.frnd_key, keys.frnd_iv)
      setMsg(plaintxt)
    }
  }
  keys&&loadmsg()
 
},[keys]);
const scrollToBottom = () => {
    const chatBox = document.getElementById('messagescroll');
    if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
    }
  };

const bytesToMB = (bytes) => {
  const megabytes = bytes / (1024 * 1024);
  return megabytes.toFixed(2); // Rounds to two decimal places
};
const bytesToKB = (bytes) => {
  const megabytes = bytes / (1024);
  return megabytes.toFixed(2); // Rounds to two decimal places
};

  return (


  
    <div className={` ${message.SenderId === user.uid ? "justify-items-end animate-slide-in-from-right":"justify-items-start animate-slide-in-from-left"}   mt-3  grid  text-left text-white `}>
        {(freindname&&user) && <p className={`text-gray-400  ml-2  mb-2 text-sm ${message.SenderId === user.uid ? "pr-14":"pl-14"}`}>{(myname&& freindname) && message.SenderId === user.uid ?myname.split(" ")[0]:freindname.split(" ")[0]}</p>}
        <div onLoad={scrollToBottom()} className={`flex ${message.SenderId === user.uid ? "flex-row":"flex-row-reverse"}  `}>
        <br/>
            {
              message.file?
              message.type&&message.type.includes("image")?
                <a href={message.file}> <img src={message.file} alt="" className=" w-26 h-36 mx-2 rounded"/></a>
                :<a href={message.file} target="_blank"><div className=" flex bg-gray-200 rounded-lg p-2 cursor-pointer">
                 <img src="https://ucarecdn.com/20348574-5489-4974-970e-0b8026353cf0/Pngtreefileicon_4419863.png" alt="" className="rounded-full w-10 h-10 mr-2 "/>
                <div className="">
                    <h1 className="text-lg text-black">{message.name}</h1>
                    <p className="text-blue">{message.size>(1024*1024)?`${bytesToMB(message.size)}} MB`:`${bytesToKB(message.size)} KB`}</p>
                </div>
            </div></a>
            : <p className={`bg-blue-600  p-2 text-xl  rounded-b-xl ${message.SenderId === user.uid ? "rounded-l-xl":"rounded-r-xl"}  `}> {msg }  </p>

            }
           
            <a href="#"> <img src={message.SenderId === user.uid
              ? (user.photoURL?user.photoURL:placeholderurl)
              : freindphoto} alt="" className="rounded-full w-10 h-10 mx-2 "/></a>
            
        </div>
        <style jsx>{`
        .animate-slide-in-from-left {
          animation: slide-in 0.5s forwards;
        }


        @keyframes slide-in {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-slide-in-from-right {
          animation: slide-in-right 0.5s forwards;
        }
      
        @keyframes slide-in-right {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
      </div>
  );
};

export default Message;
