'use client'
import Header from '@/app/Header/navbar';
import Chatbox from '@/app/components/Chatbox';
import Chatlist from '@/app/components/Chatlist';
import React, { useEffect, useState } from 'react';
import { getKeyInteger, getPrivateKeyInteger, getPublicKeyInteger } from '../rsa';
import { UserAuth } from '../Context/AuthContext';
import { updateInfoRSA } from '../firedb';
import UnauthorizedAccessPage from '../components/unauthorized';
import { inDB } from '../inDB';
import Spinner from '../components/Spinner';
import Userlist from '../components/userlist';

const Page = ({is}) => {
    const [activeChat, setactiveChat] = useState(null);
    const { user } = UserAuth();
    const [User, setUser] = useState(user)
    const [myRsa, setMyRSA] = useState(null)
    const [loading, isloading] = useState(true);
    const [ userlist, setuserlist] = useState(false);
    useEffect(() => {
        const checkAuthentication = async () => {
          await new Promise((resolve) => setTimeout(resolve, 1500));
    
    
        };
        checkAuthentication().then(() => {
          isloading(prevState=>{ return false});
    
        });
      }, []);

    useEffect(()=>{
        setUser(prevState=>{ return user})

    },[user])
    // 
    // 
    const checkRSA = async ()=>{
        const rsakey = await inDB.userCred.where("uid").equals(user.uid).first()
        // 
        setMyRSA(prevState=>{ return rsakey})
        if(!rsakey){
            const keys =  getKeyInteger(user.uid);
            user&&updateInfoRSA(user.uid);
            const rsakey2 = await inDB.userCred.where("uid").equals(user.uid).first()
            setMyRSA(prevState=>{ return rsakey2})
            
        }
        
    }
    

    useEffect(()=>{
        if(User){
            checkRSA();
            // 
        }       

    },[User])

    // 
    // useEffect(async ()=>{
    //     if(user){
    //         const rsakey = await inDB.userCred.where("uid").equals(user.uid).first()
    //         
    //         if(!rsakey.nChatbox){
    //             user&&updateInfoRSA(user.uid);
                
    //         }
    //     }

    // },[user])
    // useEffect(() => {
        // Code to run when activeChat changes
        // For example, you can update some state or perform an action here
        // In this case, let's just log the change for demonstration purposes
        // 
    // }, [activeChat]);

    //RSA key initialization for exchanging Key and IV of AES
    // if(typeof window  !== 'undefined'){
    //     const pub = sessionStorage.getItem("MyPub");
    //     const priv = sessionStorage.getItem("MyPriv");
    //     if((!pub||!priv) && user){
    //         const keys = getKeyInteger(user.uid);
            
    //         sessionStorage.setItem("MyPub",keys.pub);
    //         sessionStorage.setItem("MyPriv",keys.priv)
    //     }
    //     user&&updateInfoRSA(user.uid);
    // }
    


    return (
        
            !loading?user? !userlist?( <div class="grid grid-cols-12  h-screen ">
            <Header myRsa={myRsa} setuserlist={setuserlist} user={User}/>
            <Chatlist myRsa={myRsa} user={User}setactive={setactiveChat}/>
            <Chatbox myRsa={myRsa} user={User} uid = {activeChat}/>
            
        </div>):(<div class="grid grid-cols-12  h-screen ">
            <Header myRsa={myRsa} setuserlist={setuserlist} user={User}/>
            <Userlist myRsa={myRsa} user={User} setactive={setactiveChat}/>
            <Chatbox myRsa={myRsa} user={User} uid = {activeChat}/>
            
        </div>):(<UnauthorizedAccessPage/>):(<Spinner/>)
        
       
    );
}

export default Page;
