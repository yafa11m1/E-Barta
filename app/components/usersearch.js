import React, { useState } from 'react';
import { collection, query, where, getDocs, or, addDoc } from 'firebase/firestore';
import { UserAuth } from '../Context/AuthContext';
import { addChat } from '../firedb';
import Link from 'next/link';

const UserSearch = ({setactive}) => {
  const { auth, db,user, placeholderurl } = UserAuth();

  const [formData, setFormData] = useState({
    param: '', // Changed "peram" to "param"
  });

  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const ClearDrop = ()=>{
    setFormData({
      param: '', // Changed "peram" to "param"
    });
    setIsDropdownOpen(false);

  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // setFormData({ ...formData, [name]: value });
    // Check if the Enter key was pressed (keyCode 13)
    console.log(e.key);
  if (e.key === 'Enter') {
    // Handle Enter key press if needed
    // For example, you can submit a form or perform a specific action
    console.log('Enter key pressed!');
  } else {
    // If Enter key was not pressed, update the form data
    setFormData({ ...formData, [name]: value });
  }
  };
  const clicked =async (FriendUid)=> {
    await addChat(user.uid,FriendUid);
    setIsDropdownOpen(false);
    setactive(FriendUid)
  }
  const handleSearch = async () => {
    
    try{
      const q = query(
        collection(db, 'users'),
        or(
        where('Email', '==', formData.param),
        where('Fullname', '==', formData.param)
      ));
  
      const querySnapshot = await getDocs(q);
      const results = [];
  
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
        console.log(doc);
      });
  
      setSearchResults(results);
      setIsDropdownOpen(true);
    }
    catch(err){
      console.log(err)
    }
    
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAdd = async (FriendUid) => {
    
    try{
      console.log(user.uid,FriendUid);
      const res =   await addFriend(user.uid,FriendUid);
      alert(res);

    }
    catch(err){
      console.log(err)

    }
  };

  return (
    <div className="relative">
      <input
        type="search"
        name="param"
        value={formData.param}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search Users"
        className="p-2 w-16 lg:w-full bg-gray-200  rounded-2xl"
      />
      {/* <button onClick={handleSearch} className="p-2 w-16 lg:w-full bg-gray-200  rounded-2xl">
        Search
      </button> */}
      
      {isDropdownOpen && (searchResults.length >0 ? 
        (
        <div className="absolute top-10 mt-2 w-max p-2 bg-white border  rounded-lg shadow-lg">
          <button
          className="absolute top-0 right-0 m-5 p-1 text-gray-500 hover:text-gray-700"
          // Button for closing drop down
          onClick={ClearDrop}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <br/><br/>
          <div>
          {searchResults.map((user, index) => (
            <Link key={index} onClick={()=> clicked(user.Uid)} href={`#`}>
              <div class="p-2 m-2 w-16  cursor-pointer  rounded-lg shadow-lg   hover:scale-105 hover:shadow-xl rounded-md  lg:w-80  lg:flex">
                          
                          <div class="lg:flex-auto lg:justify-items-center lg:m p-1 m-2" >
                              <a href="#"> <img src={user.PhotoUrl || placeholderurl} alt="" class="rounded-full w-12   "/></a>
                          </div>
                      
                          <div class=" invisible w-0 h-0 lg:visible lg:w-full lg:flex lg:justify-between">
                              <div class=" ">
                                  <strong>{user.Fullname}</strong>
                                  <p>{user.Email}</p>
                              </div>
                            
                              
                          </div>  
                      </div>
             
            </Link>
            
          ))}
          </div>
        </div>)
        :
        <div className="absolute top-10 mt-2 w-60 p-2 bg-white border rounded shadow-lg">
                No User found
        </div>
      )}
    </div>
  );
};

export default UserSearch;
