import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import Message from "./message";


const Messages = ({ChatId, freindphoto}) => {
  const [messages, setMessages] = useState([]);
  
  // console.log(ChatId);
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", ChatId ), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [ChatId]);

  // console.log(messages)

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message freindphoto={freindphoto} ChatId={ChatId} message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
