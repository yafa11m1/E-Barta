'use client'
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Fire from '../img/fire.svg';
import attachfile from '../img/attachfile.png';
import sendbutton from '../img/send-48.png';
import close from '../img/close.png';
import attach from '../img/attachfile.png';
import {
  arrayUnion,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { storage } from '../firebase';
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { UserAuth } from "../Context/AuthContext";
import { SendTxt } from "../firedb";
import mime from 'mime-types';
import { encryptAES } from "../aes";
import { inDB } from "../inDB";
import Spinner from "./Spinner";

const Input = ({ user, ChatId }) => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { db } = UserAuth();
  const [keys, setMyRSA] = useState(null)
  const [loading, isloading] = useState(true);
  useEffect(() => {
    isloading(prevState=>{ return true});
      const checkAuthentication = async () => {
        await new Promise((resolve) => setTimeout(resolve, 2500));
  
  
      };
      checkAuthentication().then(() => {
        isloading(prevState=>{ return false});
  
      });
    }, [ChatId]);
  useEffect(()=>{
    const keySet = async()=> {
      
      const chatkey = await inDB.chatCred.where("chatId").equals(ChatId).first();
        
        setMyRSA(prevState=>{ return chatkey}) 
    }
    if(ChatId){
      keySet();
    }
    

},[loading,ChatId])

  const handleSend = async () => {
    if (img) {
      
      const date = new Date().getTime();
      const filId = uuid();
      const storageRef = ref(storage, `${filId+date}`);

      uploadBytesResumable(storageRef, img.file).then(()=>{
        getDownloadURL(storageRef).then(async (downloadURL) => {
          const encText = encryptAES("Attachment",keys.key, keys.iv)
          await updateDoc(doc(db, "chats", ChatId), {
            messages: arrayUnion({
              id: uuid(),
              name:img.name,
              SenderId: user.uid,
              date: Timestamp.now(),
              file: downloadURL,
              type: img.type,
              size: img.size
            }),
            LastMsg:{
              Id: uuid(),
              Text:encText,
              SenderId: user.uid,
              Date: Timestamp.now(),
          }
          });
        });
      });
     
      // uploadTask.on(
      //   (error) => {
      //     //TODO:Handle Error
      //   },
      //   () => {
      //     getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
      //       await updateDoc(doc(db, "chats", ChatId), {
      //         messages: arrayUnion({
      //           id: uuid(),
      //           text,
      //           senderId: user.uid,
      //           date: Timestamp.now(),
      //           file: downloadURL,
      //         }),
      //       });
      //     });
      //   }
      // );
    } else {
      
      const encText = encryptAES(text,keys.key, keys.iv)
      const res = await SendTxt(ChatId, encText, user.uid);
      // res?alert("sent"):alert("error");
    }

    // await updateDoc(doc(db, "userChats", user.uid), {
    //   [data.chatId + ".lastMessage"]: {
    //     text,
    //   },
    //   [data.chatId + ".date"]: serverTimestamp(),
    // });

    // await updateDoc(doc(db, "userChats", data.user.uid), {
    //   [data.chatId + ".lastMessage"]: {
    //     text,
    //   },
    //   [data.chatId + ".date"]: serverTimestamp(),
    // });

    setText("");
    setImg(prevState=>{ return null});
  };
  const bytesToMB = (bytes) => {
    const megabytes = bytes / (1024 * 1024);
    return megabytes.toFixed(2); // Rounds to two decimal places
  };
  const bytesToKB = (bytes) => {
    const megabytes = bytes / (1024);
    return megabytes.toFixed(2); // Rounds to two decimal places
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  const clearfile = ()=>{
    setImg(prevState=>{ return null});
  }
  return (
    // <div className="input">
    //   <input
    //     type="text"
    //     placeholder="Type something..."
    //     onChange={(e) => setText(e.target.value)}
    //     value={text}
    //   />
    //   <div className="send">
    //     <img src={attachfile} alt="" />
    //     <input
    //       type="file"

    //       id="file"
    //       onChange={(e) => setImg(e.target.files[0])}
    //     />
    //     <label htmlFor="file">
    //       <img src={sendbutton} alt="" />
    //     </label>
    //     <button onClick={handleSend}>Send</button>
    //   </div>
    // </div>
    !loading?<>
     {img?img.type.includes("image")?<div class=" flex relative  sm:mx-20 mx-20 ">
                        
                        <Image src={img.preview} alt=""  width={100} height={50} class=" mx-2 rounded w-14 h-16  "/>
                        <div class=" absolute top-0 left-0">
                           <a onClick={clearfile}>
                               <Image  src={close} alt="" class="  rounded-full w-6 cursor-pointer "/>
                           </a>
                       </div>
                        
    </div>:<div class=" flex relative  sm:mx-20 mx-20 ">
                        <div class=" flex bg-gray-200 rounded-lg p-2 ">
                            <a href="#"> <Image src={attach} alt="" class="rounded-full w-10 h-10 mr-2 "/></a>
                            <div class="">
                                <h1 class="text-lg">{img.name}</h1>
                                <p>{img.size>(1024*1024)?`${bytesToMB(img.size)}} MB`:`${bytesToKB(img.size)} KB`}</p>
                            </div>
                        </div>
                        <div class=" absolute top-0 left-0">
                        <a onClick={clearfile}>
                               <Image  src={close} alt="" class="  rounded-full w-6 cursor-pointer "/>
                           </a>
                       </div>
                        
                   </div>:<></> }
    <div class="m-4 flex items-center ">
     
      <input
        type="file"
        id="file"
        onChange={(e) => setImg(prevState=>{ return {file:e.target.files[0],name:e.target.files[0].name,type:e.target.files[0].type,size:e.target.files[0].size,preview: URL.createObjectURL(e.target.files[0])}})}
        className="hidden"
      />
      <label htmlFor="file">
        <Image
          src={attachfile}
          alt=""
          className="flex-1 rounded-full w-8 h-8 mr-2 hover:bg-gray-100 cursor-pointer"
        />
      </label>
      <input
        type="textbox"
        placeholder="Type your message"
        onChange={(e) => setText(prevState=>{ return e.target.value})}
        value={text}
        onKeyDown={handleKeyDown}
        class="flex-1 p-3 border border-gray-300 rounded-full" />
      <a onClick={handleSend} href="#"> <Image src={sendbutton} alt="" class="flex-1 rounded-full w-12 h-14 mr-2  hover:bg-gray-100" /></a>
    </div></>:<Spinner/>
  );
};

export default Input;
