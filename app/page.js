'use client'

import Image from 'next/image'
import { useState } from 'react'
import Login from './login/page';
import Signup from './signup/page';
import logo from './img/logo.png';
import bg from './img/bg.jpeg';



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
                    <Image src={logo} alt='E-barta logo' width={150} height={150} className='w-34 h-34 rounded-full' />

                </div>

            </div>




            <div className='bg-gray-100  md:flex    md:justify-center'>





                <div className='pt-3 pl-10 pr-10 w-full md:w-1/2 bg-gray-100 item-center '>
                    <h1 className='text-4xl font-bold text-blue-800'>Welcome to E-Barta</h1>
                    <p className='mt-4 text-lg text-gray-700'>Your platform for secure, private, and reliable messaging. We believe in the power of communication and the right to privacy, which is why we have created a messenger that is end-to-end encrypted.</p>

                    <h2 className='mt-8 text-3xl font-bold text-blue-800'>Why Choose E-Barta?</h2>
                    <ul className='mt-4 text-lg text-gray-700 list-disc list-inside'>
                        <li><strong>End-to-End Encryption:</strong> Your messages are secured with top-notch encryption from the moment they leave your device until they reach the recipients. No one else, not even E-Barta, can read them.</li>
                        <li><strong>Futuristic and User-Friendly:</strong> Our platform combines cutting-edge technology with a user-friendly interface. Experience the future of communication today with our Platform.</li>
                        <li><strong>Reliable and Fast:</strong> E-Barta is designed to deliver your messages quickly and reliably, even on slow networks or in remote areas.</li>
                        <li><strong>Free and Global:</strong> With E-Barta, you can send messages, make calls, and share media, all for free. Connect with people around the world without worrying about fees or subscriptions.</li>
                    </ul>

                    <p className='mt-8 text-lg text-gray-700'>Join us at E-Barta and experience the future of secure communication today!</p>
                </div>


                <div className='w-full md:w-1/2  item-center '>

                    {status == true ?
                        <Login onClk={() => setStatus(false)} />

                        :
                        <Signup onClk={() => setStatus(true)} />

                    }
                </div>

            </div>


            {/* <footer className="  bg-gray-400 text-white  text-center  ">
        <p>&copy; 2024 Encrypted Messenger. All rights reserved.</p>
    </footer> */}




        </main>
    )
};