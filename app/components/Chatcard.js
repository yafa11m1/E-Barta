'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GetLastMsg, exchangeKey, userInfo } from '../firedb';
import { UserAuth } from '../Context/AuthContext';
import threedot from '../img/threedot.png';
import { Timestamp, doc, onSnapshot } from 'firebase/firestore';
import { decryptAES } from '../aes';
import { db } from '../firebase';
import { inDB } from '../inDB';


const ChatCard = ({ user, Uid, chatId, onclk }) => {
  const { placeholderurl } = UserAuth();
  const [info, setInfo] = useState({
    Uid: "",
    PhotoUrl: "",
    Email: "",
    Fullname: ""
  })
  const [LastMsg, setlastmsg] = useState(
    {
      Id: '',
      Text: "New Message",
      SenderId: null,
      Date: null
    }
  )
  const [keys1,setkeys] = useState({
    iv:'',
    key:'',
    frnd_iv:'',
    frnd_key:''
  }) 
  const [loading, isloading] = useState(true);
  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      inDB.chatCred.where("chatId").equals(chatId).first().then((r)=>{

        setkeys(prevState=>{ return r});
      }) 


    };
    checkAuthentication().then(() => {
      isloading(prevState=>{ return false});

    });
  }, [Uid]);
  useEffect( () => {
    const infoandexchange = async()=>{
          userInfo(Uid).then((r) => {
            setInfo(prevState=>{ return r});
            // 
          }



          )
          await exchangeKey(chatId.replace(Uid, ""), Uid)
          //   .then(()=>{
          //     inDB.chatCred.where("chatId").equals(chatId).first().then((y)=>{
          //       // setkeys(y);
          //     })
          // })
          const keys = await inDB.chatCred.where("chatId").equals(chatId).first();
          Uid && GetLastMsg(chatId).then((r) => {
            keys && setlastmsg(prevState=>{ return  {
              Text: r.SenderId != Uid ? decryptAES(r.Text, keys.key, keys.iv) : decryptAES(r.Text, keys.frnd_key, keys.frnd_iv),
              Date: r.Date.toDate().toLocaleString() == today ? r.Date.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                : r.Date.toDate().toLocaleDateString()
            }})
            // 

          })
      }

      infoandexchange()
    // )

  }, [Uid])
  const today = Timestamp.now().toDate().toLocaleDateString();
  useEffect( () => {
    
    
    const unSub = onSnapshot(doc(db, "chats", chatId), async (r) => {
      const keys = await  inDB.chatCred.where("chatId").equals(chatId).first();
      keys && r.exists() && setlastmsg(prevState=>{ return {
        Text: r.data().LastMsg.SenderId != Uid ? decryptAES(r.data().LastMsg.Text, keys.key, keys.iv) : decryptAES(r.data().LastMsg.Text, keys.frnd_key, keys.frnd_iv),
        Date: r.data().LastMsg.Date.toDate().toLocaleString() == today ? r.data().LastMsg.Date.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : r.data().LastMsg.Date.toDate().toLocaleDateString()
      }});
      
    });

    return () => {
      unSub();

    };
  }, []);
  // 

  // 



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

    <div onClick={onclk} class="p-2 m-2    cursor-pointer  rounded-lg shadow-lg transition  hover:scale-105 hover:shadow-xl   lg:w-80  lg:flex ">

      <div class="lg:flex lg:justify-items-center w-16 lg:w-32 " >
        <a href="#"> <img src={info ? info.PhotoUrl : placeholderurl} alt="" class="rounded-full w-16 h-16 " /></a>
      </div>

      <div class=" invisible w-0 h-0 lg:visible lg:w-full lg:h-full lg:flex lg:justify-between">
        <div class="   ">
          <strong>{info ? info.Fullname : "Loading..."}</strong>
          <div className="flex w-full justify-between ">
            <span className="text-lg overflow-ellipsis overflow-hidden">
              {


                LastMsg.Text && LastMsg.Text.length > 10 ? LastMsg.Text.slice(0, 10) + "..." : LastMsg.Text


              }
            </span>
            <span className="text-lg pl-5 text-gray-400">
              {LastMsg.Date}
            </span>
          </div>
        </div>

        {/* <div class="">
                <a href="#"> <Image src={threedot} alt="" class="rounded-full w-8 h-8  bg-gray-200"/></a>
        </div> */}
      </div>
    </div>
  );
};

export default ChatCard;
