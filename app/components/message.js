import React, { useContext, useEffect, useRef, useState } from "react";
import { UserAuth } from "../Context/AuthContext";
import { decryptAES } from "../aes";
import { inDB } from "../inDB";
import { exchangeKey } from "../firedb";


const Message = ({ user,  message, freindphoto,ChatId }) => {
  const { placeholderurl} = UserAuth();
  const [keys, setMyRSA] = useState(null)
  const [msg, setMsg] = useState("Loading...")
  useEffect(()=>{
    const keySet = async()=> {
      const chatkey = await inDB.chatCred.where("chatId").equals(ChatId).first();
        // console.log(rsakey)
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
 
},[keys])
  const scrollToBottom = () => {
    const chatBox = document.getElementById('messagescroll');
    if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
    }
  };
// const newmsg  = async ()=>{
//   try{
//     await exchangeKey(user.uid, ChatId.replace(user.uid, ""))
//     const chatkey = await inDB.chatCred.where("chatId").equals(ChatId).first()
//     setMyRSA(prestate=>{return chatkey}) 
//     return decryptAES(message.Text,chatkey.frnd_key, keys.frnd_iv)
//   }
//   catch(er){
//     console.log(err)
//     alert("An error occured please refresh your browser")
//   }
  


// }

  return (

    // <div
    //   ref={ref}
    //   className={`message ${message.SenderId === user.uid && "owner"}`}
    // >
    //   <div className="messageInfo">
    //     <img
    //       src={
    //         message.SenderId === user.uid
    //           ? user.photoURL
    //           : placeholderurl
    //       }
    //       alt=""
    //       className="w-8 h-8 rounded-full object-cover"
    //     />
        
    //   </div>
    //   <div className="messageContent">
    //     <p>{message.Text}</p>
    //     {message.img && <img src={message.img} alt="" />}
    //   </div>
    // </div>
    
  
    <div class={` ${message.SenderId === user.uid ? "justify-items-end":"justify-items-start"}   mt-3  grid  text-left text-white `}>
        <div onLoad={scrollToBottom()} class={`flex ${message.SenderId === user.uid ? "flex-row":"flex-row-reverse"}  `}>
            {
              message.file?
              message.type&&message.type.includes("image")?
                <a href={message.file}> <img src={message.file} alt="" class=" w-26 h-36 mx-2 rounded"/></a>
                :<a href={message.file} target="_blank"><div class=" flex bg-gray-200 rounded-lg p-2 cursor-pointer">
                 <img src="https://ucarecdn.com/20348574-5489-4974-970e-0b8026353cf0/Pngtreefileicon_4419863.png" alt="" class="rounded-full w-10 h-10 mr-2 "/>
                <div class="">
                    <h1 class="text-lg text-black">{message.name}</h1>
                    <p>{message.size}</p>
                </div>
            </div></a>
            : <p class={`bg-blue-600  p-2 text-xl  rounded-b-xl ${message.SenderId === user.uid ? "rounded-l-xl":"rounded-r-xl"}  `}> {msg }  </p>

            }
           
            <a href="#"> <img src={message.SenderId === user.uid
              ? (user.photoURL?user.photoURL:placeholderurl)
              : freindphoto} alt="" class="rounded-full w-10 h-10 mx-2 "/></a>
        </div>
      </div>
  );
};

export default Message;
