'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GetLastMsg, addChat, exchangeKey, userInfo } from '../firedb';
import { UserAuth } from '../Context/AuthContext';
import threedot from '../img/threedot.png';
import { Timestamp, doc, onSnapshot } from 'firebase/firestore';
import { decryptAES } from '../aes';
import { db } from '../firebase';
import { inDB } from '../inDB';


const UserCard = ({ user, Uid,myUid, onclk }) => {
  const { placeholderurl } = UserAuth();


  const [keys1,setkeys] = useState({
    iv:'',
    key:'',
    frnd_iv:'',
    frnd_key:''
  })
  const clicked =async ()=> {
    await addChat(myUid,Uid);
    // setactive(prevState=>{ return Uid})
  }
  
//   const [loading, isloading] = useState(true);
//   useEffect(() => {
//     const checkAuthentication = async () => {
//       await new Promise((resolve) => setTimeout(resolve, 5000));
//       inDB.chatCred.where("chatId").equals(chatId).first().then((r)=>{

//         setkeys(prevState=>{ return r});
//       }) 


//     };
//     checkAuthentication().then(() => {
//       isloading(prevState=>{ return false});

//     });
//   }, [Uid]);
//   useEffect(async () => {
//     userInfo(Uid).then((r) => {
//       setInfo(prevState=>{ return r});
//       // 
//     }



//     )
//     await exchangeKey(chatId.replace(Uid, ""), Uid)
 
    


//     // )

//   }, [Uid])
 


  return (

    <div onClick={()=> {clicked(user.Uid);onclk()}} className="p-2 m-2 w-16 animate-slide-in-from-left cursor-pointer  rounded-lg shadow-lg transition  hover:scale-105 hover:shadow-xl   lg:w-80  lg:flex">

      <div className="lg:flex lg:justify-items-center w-32 " >
        <a href="#"> <img src={user ? user.PhotoUrl : placeholderurl} alt="" className="rounded-full w-16 h-16 " /></a>
      </div>

      <div className=" invisible w-0 h-0 lg:visible lg:w-full lg:h-full lg:flex lg:justify-between">
        <div className="   ">
          <strong>{user ? user.Fullname : "Loading..."}</strong>
        </div>

        {/* <div className="">
                <a href="#"> <Image src={threedot} alt="" className="rounded-full w-8 h-8  bg-gray-200"/></a>
        </div> */}
      </div>
    </div>
  );
};

export default UserCard;
