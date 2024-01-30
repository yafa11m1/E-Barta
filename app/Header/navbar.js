'use client'
import { useEffect } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { UserAuth } from '../Context/AuthContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation'
import Usersearch from '../components/usersearch';
import { arrayUnion, collection, doc, getDocs, query, upDoc } from 'firebase/firestore';
import { addFriend } from '../firedb';
import logo from '../img/logo.png';
import Image from "next/image";
import profile from '../img/profile.jpg';
import chat from '../img/chats.png';
import people from '../img/people.png';
import dark from '../img/dark-mode.png';
import chats from "../img/chat.png";

const Header = ({setuserlist}) => {
    const {auth, logout, setLoggedin, placeholderurl} = UserAuth();
    const user = auth.currentUser;
    // 
    const router = useRouter();
    

    


    const handleLogout = () => {
        logout();
        router.push( "/", undefined, { shallow: true });

        
    };
   
        
    // user && 

    return (
        <>
         
    <div id="first" className="col-span-12 rounded-2xl border-r-2 flex justify-around    h-20  flex-row w-full  bg-gray-100 lg:flex-col lg:h-full lg:w-20 lg:col-span-1">

        <div className="  grid  items-center sm:justify-items-center ">
            <a href="/">
                <Image src={logo} alt="logo" className="w-14 h-14 bg-gray-200 rounded-md"/>
            </a>
        </div>

        <hr/>

        <div className=" order-last grid  items-center sm:justify-items-center">
            <a href="/Profile"> <Image src={user&&user.photoURL?user.photoURL: placeholderurl} alt=""
                            width={100}
                            height={100}
                    className="rounded-full w-12 h-12 hover:ring-offset-2 hover:ring-2 "/></a>
        </div>

        <div className=" grid items-center   sm:justify-items-center">
            <a href="#" onClick={()=> setuserlist(prevestate=>{return false})}>
                <Image src={chats} alt="" className="w-8 h-8 hover:bg-gray-200 rounded-md"/>
            </a>
        </div>

        <div className="  grid  items-center sm:justify-items-center">
            <a href="#" onClick={()=> setuserlist(prevestate=>{return true})}>
                <Image src={people}alt="" className="w-8 h-8 hover:bg-gray-200 rounded-md"/>
            </a>
        </div>

        {user&&(<div className="  grid  items-center sm:justify-items-center">
            <a onClick={handleLogout} href="#">
                <img src="https://ucarecdn.com/a04d0909-0057-4025-92de-5e5c5f4fcdf5/logout.png"alt="" className="w-8 h-8 hover:bg-gray-200 rounded-md"/>
            </a>
        </div>)}

        

        {/* <div className="   grid  items-center sm:justify-items-center">
            <a href="#">
                <Image src={chat} width='20' alt="" className="w-8 h-8 hover:bg-gray-200 rounded-md"/>
            </a>
        </div> */}




    
        

        {/* <div className=" grid  items-center sm:justify-items-center">
            <a href="#">
                <Image src={dark} alt="" className="w-8 h-8 hover:bg-gray-200 rounded-md"/>
            </a>
        </div> */}

        

        

        <hr/> 
        
    </div>
   
        </>
    );
};



export default Header;
