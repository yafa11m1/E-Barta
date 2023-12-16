'use client'
import { UserAuth } from '@/app/Context/AuthContext';
import Input from '@/app/components/input';
import Messages from '@/app/components/messages';
import React from 'react';

const Page = ({ params }) => {
  const { user } = UserAuth();

  const id = params.chatID;
  const chatId = user ? user.uid > id ? user.uid + id : id + user.uid : "loading";
  console.log(chatId);
  return (
    <div className="chat">
      <div className="chatInfo flex justify-between items-center p-4 border-b border-gray-200">
        <span className="text-xl font-bold">{user?.displayName}</span>
        {/* <div className="chatIcons">
      <img src={Cam} alt="" className="w-8 h-8 mr-2" />
      <img src={Add} alt="" className="w-8 h-8 mr-2" />
      <img src={More} alt="" className="w-8 h-8" />
    </div> */}
      </div>
      <Messages ChatId={chatId} />
      <Input ChatId={chatId} />
    </div>
  );
}

export default Page;
