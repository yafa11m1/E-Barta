'use client'
import React, { useEffect, useState } from 'react';
import { UserAuth } from '../Context/AuthContext';
import Spinner from '../components/Spinner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { FriendList, updateInfoarray, userInfo } from '../firedb';
import FriendCard from '../components/Friendcard';
import { storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Page = () => {
    const { user, auth, isLoggedIn, setLoggedin, placeholderurl} = UserAuth();

    const [loading, setLoading] = useState(true);
    const [detail, setdetail] = useState(false);
    const uid = typeof window  !== 'undefined' ?sessionStorage.getItem("uid"):"";
    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);

    


    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        gender: '',
        photourl: '',
        profileimage:null

    }); 10
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

    };


    // 
    const defaultFullName = 'John Doe';
    const defaultPhone = '123-456-7890';
    const defaultGender = 'Male';


    useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setLoading(false);
            const info = await userInfo(uid);

            setdetail(info);
            setFormData({
                name: info.Fullname,
                phone: info.Phone,
                gender: info.Gender,
                photourl: info.PhotoUrl,
            })
            setSelectedImage(info.PhotoUrl);
            


        };
        checkAuthentication();


    }, [user]);
    // 

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, phone, gender,profileimage } = formData;
        // 


        // Regular expressions for validation
        const nameRegex = /^[A-Za-z\s]+$/; // Matches alphabetical characters and spaces
        const phoneRegex = /^\d{11}$/; // Matches exactly 11 digits
        const genderRegex = /^(male|female)$/i;

        let newerrors = {};

        if (!name.match(nameRegex)) {
            newerrors.name = "Invalid name. Only alphabets and spaces allowed.";
        }

        if (!phone.match(phoneRegex)) {
            newerrors.phone = "Invalid phone number. Must be 11 digits.";
        }

        if (!gender.match(genderRegex)) {
            newerrors.gender = "Invalid gender address.";
        }
        setErrors(newerrors);


        if (Object.keys(newerrors).length === 0) {
            // No validation errors, submit the form or take further action
            const date = new Date().getTime();
            const storageRef = ref(storage, `${uid + date}`);

            formData.profileimage? uploadBytesResumable(storageRef, formData.profileimage).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    try{
                        // 
                        setFormData({ ...formData, photourl: downloadURL });
                        updateProfile(user, {
                            displayName: formData.name,
                            phoneNumber: formData.phone,
                            photoURL: downloadURL
                            
            
                        }).then(async () => {
                            // Profile updated!
                            // ...
                            await updateInfoarray(user.uid, formData.name, formData.gender, formData.phone, downloadURL);
                            alert("profile updated")
            
                        }).catch((error) => {
                            // An error occurred
                            // ...
                            
                        });
                    }
                    catch(err){
                        
                    }
                    
                
                })
            }):await updateProfile(user, {
                displayName: formData.name,
                phoneNumber: formData.phone
                

            }).then(async () => {
                // Profile updated!
                // ...
                await updateInfoarray(user.uid, formData.name, formData.gender, formData.phone, formData.photourl);
                alert("profile updated")

            }).catch((error) => {
                // An error occurred
                // ...
                
            });

            
        } else {
            // Validation errors detected, display errors or handle them accordingly
            
        }
    };
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl||placeholderurl);
        
        setFormData({ ...formData, profileimage: file });
      };

    return (
        <div>
            {loading ? (<Spinner />) : (detail ? (
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
                        <form onSubmit={handleSubmit}>
                            <h1 className="text-2xl font-semibold">Profile Settings</h1>
                            <div className=" p-4 space-y-4">
                                <div className='flex justify-center '>
                                <div className="relative h-28 w-28 rounded-full overflow-hidden">
                                    <img
                                        src={selectedImage || placeholderurl} // You can use a placeholder image
                                        alt="Selected"
                                        className="object-cover h-full w-full"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        name='profileimage'
                                        onChange={handleImageUpload}
                                    />
                                </div>
                                </div>
                                <div>
                                    <label className="block text-gray-600 font-semibold">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                                        defaultValue={detail.Fullname}
                                        onChange={handleInputChange}
                                        name='name'
                                    />
                                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-600 font-semibold">Phone</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                                        defaultValue={detail.Phone}
                                        onChange={handleInputChange}
                                        name='phone'
                                    />
                                    {errors.phone && <p className="text-red-500">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-600 font-semibold">Gender</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                                        defaultValue={detail.Gender}
                                        name='gender'
                                        onChange={handleInputChange}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.gender && <p className="text-red-500">{errors.gender}</p>}
                                </div>
                                <div className='flex justify-center'>
                                    <button type="submit" className="bg-blue-500 justify-center text-white rounded p-2">Update</button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            ) : (<div>Please Login </div>))}

        </div>
    );
}

export default Page;
