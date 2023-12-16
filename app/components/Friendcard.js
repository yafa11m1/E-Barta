'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { userInfo } from '../firedb';
import { UserAuth } from '../Context/AuthContext';

const FriendCard = ({  Uid }) => {
  const {placeholderurl} = UserAuth();
    const [info,setInfo] = useState({
        Uid:"",
        PhotoUrl:"",
        Email:"",
        Fullname:""
    })
    useEffect(() => {
        const checkAuthentication = async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          
        };
        checkAuthentication();
      }, [Uid]);
    useEffect(()=>{
        userInfo(Uid).then((r)=>{
            setInfo(r);
            console.log(info);
        }

        )
    },[Uid])
    // console.log(info);

  return (
    <Link href={`/chat/${Uid}`}>
      <div className="block max-w-xs mx-auto mb-4 p-4 bg-white rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl cursor-pointer">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16">
            <img
              src={info.PhotoUrl || placeholderurl}
              alt={info.Fullname}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{info.Fullname}</h2>
            <p className="text-gray-500">{info.Email}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FriendCard;
