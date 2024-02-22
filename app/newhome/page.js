'use client'

import Image from 'next/image'
import { useState } from 'react'
import Login from '../login/page';
import Signup from '../signup/page';



export default function Home() {
    const [status, setStatus] = useState(true);
  return (
    <main className='  bg-gray-100 h-screen '>
        
    
    {/* <header className="bg-blue-800 text-white py-20 text-center">
        <div className="container mx-auto">
            <h1 className="text-4xl font-semibold">E-Barta - Secure Messaging</h1>
            <p className="mt-2">Your Privacy Matters. Chat securely with E-Barta.</p>
            <a href="#" className="mt-4 inline-block bg-white text-blue-800 py-2 px-4 rounded-lg transition duration-300 hover:bg-blue-200">Get Started</a>
        </div>
    </header>
   
    <section className="py-16">
        <div className="container mx-auto">
            <h2 className="text-3xl font-semibold text-center">Features</h2>
            <div className="flex flex-wrap mt-8">
                <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold">End-to-End Encryption</h3>
                        <p className="mt-2">Your messages are always safe and private with our strong encryption.</p>
                    </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold">Multi-Platform Support</h3>
                        <p className="mt-2">Access your messages from anywhere, on any device.</p>
                    </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold">User-Friendly Interface</h3>
                        <p className="mt-2">Easily navigate and chat with friends and family in a clean interface.</p>
                    </div>
                </div>
            </div>
        </div>
    </section> */}


<div className='flex justify-between pl-10 '>
    <div className='flex'>
        <img src=''  alt='Not found' className='w-34 h-34 rounded-full'/>
        <p className='text-4xl pl-8'>E-Barta</p>
    </div>
 
</div>




<div className='bg-gray-100 h-max md:flex    md:justify-center'>





   <div className='pt-36 pl-10 pr-10 w-full md:w-1/2 bg-gray-100 item-center text-center'>


<p className='text-4xl text-blue-800 '>Welcome to End-to-End Encrypted Secure messaging Platform </p>
<br></br>
<div className='text-2xl '>
<ol>
    <li>Chat with confidence.. </li>
    <li>Protect your privacy with end-to-end encryption..</li>
    <li>Privacy you can trust..</li>
    <li>Your messages are only visible to you and the people you communicate with..</li>
    <li>We use the strongest encryption standards to protect your data..</li>
</ol>
</div>





   {/* <header className="  py-20 text-center">
        <div className="container mx-auto">
            <h1 className="text-4xl font-semibold">E-Barta - Secure Messaging</h1>
            <p className="mt-2">Your Privacy Matters. Chat securely with E-Barta.</p>
            <a href="#" className="mt-4 inline-block bg-white text-blue-800 py-2 px-4 rounded-lg transition duration-300 hover:bg-blue-200">Get Started</a>
        </div>
    </header>
   
    <section className="py-16">
        <div className="container mx-auto">
            <h2 className="text-3xl font-semibold text-center">Features</h2>
            <div className="flex flex-wrap mt-8">
                <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold">End-to-End Encryption</h3>
                        <p className="mt-2">Your messages are always safe and private with our strong encryption.</p>
                    </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold">Multi-Platform Support</h3>
                        <p className="mt-2">Access your messages from anywhere, on any device.</p>
                    </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold">User-Friendly Interface</h3>
                        <p className="mt-2">Easily navigate and chat with friends and family in a clean interface.</p>
                    </div>
                </div>
            </div>
        </div>
    </section> */}
     {/* <div className="container mx-auto text-center h-screen  flex justify-center items-center">
        <div>
            <h1 className="text-4xl font-semibold">E-Barta - Secure Messaging</h1>
            <p className="mt-2">Your Privacy Matters. Chat securely with E-Barta.</p>
            <a href="#" className="mt-4 inline-block bg-white text-blue-800 py-2 px-4 rounded-lg transition duration-300 hover:bg-blue-200">Get Started</a>
        </div>
      </div> */}
   </div>

    <div className='w-full md:w-1/2  item-center '>

{status == true ?  
   <Login onClk={() => setStatus(false)}/>

: 
<Signup onClk={() => setStatus(true)}/>

}  
    </div>

</div>


  {/* <footer className="  bg-gray-400 text-white  text-center  ">
        <p>&copy; 2024 Encrypted Messenger. All rights reserved.</p>
    </footer> */}


    

    </main>
  )
}