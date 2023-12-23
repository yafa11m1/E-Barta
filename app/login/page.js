// pages/login.js
'use client';
import React, { useEffect, useState } from 'react';
import { logInWithEmailAndPassword, signInWithGoogle } from '../firebase';
import { UserAuth } from '../Context/AuthContext';
import { useRouter } from 'next/navigation'

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const { user } = UserAuth();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const router = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validate email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!formData.email.match(emailRegex)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        // Validate password (at least 8 characters)
        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Form is valid, you can submit the data or perform additional actions here
            // console.log('Form data:', formData);
            const stat = await logInWithEmailAndPassword(formData.email,formData.password)
            stat&&router.push( "/dashboard", undefined, { shallow: true })
            
            
        }
    };
    const handleSignWithGoogle = ()=> {
        signInWithGoogle();
        if(user){
            router.push( "/dashboard", undefined, { shallow: true });
            

        }
        
    }
    useEffect(()=>{  if(user){
        router.push( "/dashboard", undefined, { shallow: true });
        

    }},[user])
  
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-semibold mb-4">Log In to E-Barta</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-600">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                        {errors.email && <p className="text-red-500">{errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-600">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                        {errors.password && <p className="text-red-500">{errors.password}</p>}
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Log In</button>
                </form>
                <div className="orr mt-2 w-75">Or</div>
                <div className="grid">
                <button className="border border-dark text-lg text-center" onClick={handleSignWithGoogle} type="submit">
                    Continue with Google
                </button>
                </div>
                <div className="mt-4 text-gray-600 text-sm text-center">
                    Dont have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
