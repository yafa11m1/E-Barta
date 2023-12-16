'use client'
import Header from '@/app/Header/navbar';
import Chatbox from '@/app/components/Chatbox';
import Chatlist from '@/app/components/Chatlist';
import React, { useEffect, useState } from 'react';
import { getKeyInteger, getPrivateKeyInteger, getPublicKeyInteger } from '../rsa';
import { UserAuth } from '../Context/AuthContext';
import { updateInfoRSA } from '../firedb';
import UnauthorizedAccessPage from '../components/unauthorized';

const Page = () => {
    const [activeChat, setactiveChat] = useState("");
    const { user } = UserAuth();
    console.log(user)
    
    useEffect(() => {
        // Code to run when activeChat changes
        // For example, you can update some state or perform an action here
        // In this case, let's just log the change for demonstration purposes
        // console.log('Active chat changed:', activeChat);
    }, [activeChat]);

    //RSA key initialization for exchanging Key and IV of AES
    if(typeof window  !== 'undefined'){
        const pub = sessionStorage.getItem("MyPub");
        const priv = sessionStorage.getItem("MyPriv");
        if(!pub||!priv){
            const keys = getKeyInteger();
            
            sessionStorage.setItem("MyPub",keys.pub);
            sessionStorage.setItem("MyPriv",keys.priv)
        }
        user&&updateInfoRSA(user.uid);
    }
    


    return (
        
            user?( <div class="grid grid-cols-12  h-screen ">
            <Header/>
            <Chatlist setactive={setactiveChat}/>
            <Chatbox uid = {activeChat}/>
            
        </div>):(<UnauthorizedAccessPage/>)
        
       
    );
}

export default Page;
