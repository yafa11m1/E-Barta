'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import icreate from '../img/icreate-26.png';
import UserSearch from "./usersearch";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import UserCard from "./usercard";
import { getAllUsers } from "../firedb";





const Userlist = ({ myRsa,user, setactive }) => {
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const checkAuthentication = async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          setLoading(prevState=>{ return false});
          
        };
        checkAuthentication();
        console.log(user.uid)
      }, [user]);
    
    const [UserList , setUserList] = useState([]);
    // useEffect(()=>{
    //     const updatelist = async () => {
    //          const res = await ChatList(user?user.uid:"");
    //          setUserList(res);
    //         //  console.log(res);
            
    //       };
    //       updatelist();
    
    //   },[user])
    useEffect(() => {
        getAllUsers().then((e)=>{
            setUserList(e);
        }
        )
      }, [user]);
  return (
    
    <div id="second" class="xl:col-span-3 lg:col-span-4 md:col-span-1 sm:col-span-2 col-span-2 h-screen  border-r-2  bg-gray-50 ">
                 <div class="p-2 ">
                    <div class=" lg:flex lg:justify-between  ">
                        <strong class="text-2xl">People</strong>
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

                    <h1 class="invisible w-0 h-0 lg:visible lg:w-fit lg:h-fit">User List</h1>
        
                 </div>
        
                    <div class="h-2/3 overflow-auto ">


                       {UserList && UserList.map(  (u) => {
                               
                                return (
                                    <UserCard
                                       user = {u}
                                       Uid = {u.id}
                                       myUid={user.uid}
                                       
                                        onclk = {()=>setactive(prevState=>{ return u.id})}
                                        
                                    />
                                    );
                                
                                
                                

                                
                            })}
        



                    </div>
                    
                </div>

    
  );
};

export default Userlist;