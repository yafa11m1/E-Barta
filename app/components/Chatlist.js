'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import icreate from '../img/icreate-26.png';
import threedot from '../img/threedot.png';
import profile from '../img/profile.jpg';
import UserSearch from "./usersearch";
import { UserAuth } from "../Context/AuthContext";
import Spinner from '../components/Spinner';
import { ChatList } from "../firedb";
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
    // useEffect(()=>{
    //     const updatelist = async () => {
    //          const res = await ChatList(user?user.uid:"");
    //          setChatLst(res);
    //         //  console.log(res);
            
    //       };
    //       updatelist();
    
    //   },[user])
    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'users', user&&user.uid||'a' ), (doc) => {
          doc.exists() && setChatLst(prevState=>{ return doc.data().Chats});
        });
    
        return () => {
          unSub();
        };
      }, [user]);
  return (
    
    <div id="second" class="xl:col-span-3 lg:col-span-4 md:col-span-1 sm:col-span-2 col-span-2 h-screen  border-r-2  bg-gray-50 ">
                 <div class="p-2 ">
                    <div class=" lg:flex lg:justify-between  ">
                        <strong class="text-2xl">CHATS</strong>
                        <div class="invisible w-0 h-0 lg:visible lg:w-fit lg:h-fit">
                            <a href="#">
                                <Image src={icreate} alt="" class=" hover:bg-gray-200 lg:w-6 lg:h-6  lg:rounded-md"/>
                            </a>
                        </div>
                    </div>
        
                    
                    <div class=" ">
                        
                        {/* <input type="search" placeholder="Search Messenger"  class="p-2 w-16 lg:w-full bg-gray-200  rounded-2xl"/> */}
                        <UserSearch setactive={setactive}/>
                        
                    </div>
       
                    <hr class="mt-2"/>

                    <h1 class="invisible w-0 h-0 lg:visible lg:w-fit lg:h-fit">Recent Chats</h1>
        
                 </div>
        
                    <div class="h-2/3 overflow-auto ">


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