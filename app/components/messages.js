import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import Message from "./message";
import { inDB } from "../inDB";


const Messages = ({user,ChatId,freindname, freindphoto}) => {
  const [messages, setMessages] = useState([]);
  const [chatKeys, setMyRSA] = useState(null)
  useEffect(()=>{
    const keySet = async()=> {
      const chatkey = await inDB.chatCred.where("chatId").equals(ChatId).first();
        // 
        setMyRSA(chatkey) 
    }
    if(ChatId){
      keySet();
    }
    

},[user])
  // 
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", ChatId ), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [ChatId]);

  // 
  
  return (
    <div className="messages">
      {messages.map((m) => (
        <Message user={user} freindname={freindname} keys={chatKeys}freindphoto={freindphoto} ChatId={ChatId} message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
