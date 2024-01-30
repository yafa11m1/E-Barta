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
    // <Link href={`/chat/${Uid}`}>
    //   <div className="block max-w-xs mx-auto mb-4 p-4 bg-white rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl cursor-pointer">
    //     <div className="flex items-center space-x-4">
    //       <div className="w-16 h-16">
    //         <img
    //           src={info.PhotoUrl || placeholderurl}
    //           alt={info.Fullname}
    //           className="w-16 h-16 rounded-full object-cover"
    //         />
    //       </div>
    //       <div>
    //         <h2 className="text-xl font-semibold">{info.Fullname}</h2>
    //         <p className="text-gray-500">{info.Email}</p>
    //       </div>
    //     </div>
    //   </div>
    // </Link>
    // <div onClick={onclk} class="p-2 m-2 w-16  cursor-pointer  rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl rounded-md  lg:w-80  lg:flex">

    <div onClick={()=> {clicked(user.Uid);onclk()}} class="p-2 m-2 w-16  cursor-pointer  rounded-lg shadow-lg transition  hover:scale-105 hover:shadow-xl   lg:w-80  lg:flex">

      <div class="lg:flex lg:justify-items-center w-32 " >
        <a href="#"> <img src={user ? user.PhotoUrl : placeholderurl} alt="" class="rounded-full w-16 h-16 " /></a>
      </div>

      <div class=" invisible w-0 h-0 lg:visible lg:w-full lg:h-full lg:flex lg:justify-between">
        <div class="   ">
          <strong>{user ? user.Fullname : "Loading..."}</strong>
        </div>

        {/* <div class="">
                <a href="#"> <Image src={threedot} alt="" class="rounded-full w-8 h-8  bg-gray-200"/></a>
        </div> */}
      </div>
    </div>
  );
};

export default UserCard;
