import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import Message from "./message";
import { inDB } from "../inDB";
import { GetRSApubKey, updatePubkey } from "../firedb";
import { decryptWithPrivateKeyInteger, encryptWithPublicKeyInteger } from "../rsa";
import { UserAuth } from "../Context/AuthContext";


const Messages = ({user,ChatId,freindname, freindphoto, myname}) => {
  const [messages, setMessages] = useState([]);
  const [chatKeys, setMyRSA] = useState(null);
  const keySet = async()=> {
    const chatkey = await inDB.chatCred.where("chatId").equals(ChatId).first();
      // 
      setMyRSA(chatkey) 
  }

  useEffect(()=>{
    
    if(ChatId){
      keySet();
    }
    

},[user])
  // 
  useEffect(() => {
   
    const unSub = onSnapshot(doc(db, "chats", ChatId ), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
      // exchangeKey();

    });

    return () => {
      unSub();
    };
  }, [ChatId]);

  // 
  
  return (
    <div className="messages">
      {messages.map((m) => (
        <Message user={user}  myname={user.displayName} freindname={freindname} keys={chatKeys}freindphoto={freindphoto} ChatId={ChatId} message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
