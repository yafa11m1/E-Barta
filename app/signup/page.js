'use client';
// pages/signup.js
import React, { useContext, useState } from 'react';
import { UserAuth } from '../Context/AuthContext';
import { useRouter } from 'next/navigation'
import { useAuthState } from "react-firebase-hooks/auth";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Image from 'next/image';
import google from '../img/google.png';




const Signup = ({onClk}) => {
    const {auth, registerWithEmailAndPassword, signInWithGoogle,  } = UserAuth();
    const [user] = useAuthState(auth);

    const [formData, setFormData] = useState({
        fullname:'',
        username: '',
        email: '',
        phone: '',
        gender: 'male',
        password: '',
        confirmPassword: '',
    });
    const router = useRouter();


  

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        //validate fullname (should contain latters ans space)
        const fullnameRegex = /^[A-Za-z\s]+$/;
        if (!formData.fullname.match(fullnameRegex)) {
            newErrors.username = 'Full name can only contain letters and space.';
        }

        // Validate username (should contain only letters and numbers)
        

        // Validate email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!formData.email.match(emailRegex)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        // Add your phone number validation logic here if needed

        // Validate password (at least 8 characters)
        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long.';
        }

        // Confirm password
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Form is valid, you can submit the data or perform additional actions here
            // 
            const stat = await registerWithEmailAndPassword(formData.email,formData.password,formData.gender,formData.phone,formData.fullname);
            stat&&router.push( "/dashboard", undefined, { shallow: true });
        }
    };
    const handleSignWithGoogle = async ()=> {
        await signInWithGoogle();
        if(user){
            router.push( "/dashboard", undefined, { shallow: true });
            

        }
        
    }
    if(user){
        
        return router.push( "/dashboard", undefined, { shallow: true });

    }

    return (
        <div className=" flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-semibold mb-4">Sign Up for E-Barta</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="fullname" className="block text-gray-600">Full Name</label>
                        <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                            placeholder='John Deo'
                            required
                        />
                        {errors.username && <p className="text-red-500">{errors.username}</p>}
                    </div>
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
                        <label htmlFor="phone" className="block text-gray-600">Phone</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                        />
                        {errors.phone && <p className="text-red-500">{errors.phone}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-gray-600">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                            required
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-500">{errors.gender}</p>}
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
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-600">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
                    </div>
                    {/* Google reCAPTCHA */}
                    {/* Implement reCAPTCHA here */}
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Sign Up</button>
                </form>
                <div className="orr mt-2 w-75">Or</div>
                <div className="grid">
                    <button className="border border-dark text-lg text-center flex items-center justify-center" onClick={handleSignWithGoogle} type="submit">
                        <Image src={google} hight={50} width={50} alt="Google Logo" className="h-6 w-6 mr-2" />
                        Continue with Google
                    </button>
                </div>

                <div className="mt-4 text-gray-600 text-sm text-center">
                    Already have an account? <a href="#" onClick={onClk} className="text-blue-500 hover:underline">Log in</a>
                </div>

            </div>
        </div>
    );
};

export default Signup;
