// pages/users.js
import React from 'react';
import Card from '../components/Card';

const users = [
    {
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        picture: 'https://placekitten.com/200/200', // Replace with your picture link
      },{
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        picture: 'https://placekitten.com/200/200', // Replace with your picture link
      },{
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        picture: 'https://placekitten.com/200/200', // Replace with your picture link
      },{
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        picture: 'https://placekitten.com/200/200', // Replace with your picture link
      },{
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        picture: 'https://placekitten.com/200/200', // Replace with your picture link
      },{
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        picture: 'https://placekitten.com/200/200', // Replace with your picture link
      },{
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        picture: 'https://placekitten.com/200/200', // Replace with your picture link
      },{
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        picture: 'https://placekitten.com/200/200', // Replace with your picture link
      },{
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        picture: 'https://placekitten.com/200/200', // Replace with your picture link
      },{
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        picture: 'https://placekitten.com/200/200', // Replace with your picture link
      },{
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        picture: 'https://placekitten.com/200/200', // Replace with your picture link
      },
  // Add more users as needed
];

const Users = () => {
  return (
    <div className=" xl:col-span-8 lg:col-span-7 md:col-span-11 sm:col-span-10 col-span-10 px-3 justify-center">
      {users.map((user, index) => (
        <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4">
          <Card {...user} />
        </div>
      ))}
    </div>
  );
};

export default Users;
