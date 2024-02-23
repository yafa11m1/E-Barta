'use client'
import React, { useEffect, useState } from "react";
import UserSearch from "./usersearch";
import ChatCard from "./Chatcard";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";





const Chatlist = ({ myRsa,user, setactive }) => {
  const [loading, setLoading] = useState(true);


  useEffect(() => {
      const checkAuthentication = async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setLoading(prevState=>{ return false});
        
      };
      checkAuthentication();
    }, [user]);
  
  const [ChatLst , setChatLst] = useState([]);

  useEffect(() => {
      const unSub = onSnapshot(doc(db, 'users', user&&user.uid||'a' ), (doc) => {
        doc.exists() && setChatLst(prevState=>{ return doc.data().Chats});
      });
  
      return () => {
        unSub();
      };
    }, [user]);
  return (
    
    <div id="second" className="xl:col-span-3 lg:col-span-4 md:col-span-2 sm:col-span-3 col-span-3 h-screen  border-r-2  bg-gray-50 ">
                 <div className="p-2 ">
                    <div className=" lg:flex lg:justify-between  ">
                        <strong className="text-2xl">CHATS</strong>
                  
                    </div>
        
                    
                    <div className=" ">
                        
                        <UserSearch setactive={setactive}/>
                        
                    </div>
       
                    <hr className="mt-2"/>

                    <h1 className="invisible w-0 h-0 lg:visible lg:w-fit lg:h-fit">Recent Chats</h1>
        
                 </div>
        
                    <div className="h-2/3 overflow-auto ">


                       {ChatLst && ChatLst.map(  (chatID) => {
                               
                                return (
                                    <ChatCard
                                      user={user}
                                        key={chatID}
                                        Uid={chatID.replace(user.uid,'')}
                                        chatId = {chatID}
                                        onclk = {()=>setactive(prevState=>{ return chatID.replace(user.uid,'')})}
                                        
                                    />
                                    );
                      })}
        



                    </div>
                    
                </div>

    
  );
};

export default Chatlist;