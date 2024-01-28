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
    <div className="flex flex-wrap justify-center">
      {users.map((user, index) => (
        <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4">
          <Card {...user} />
        </div>
      ))}
    </div>
  );
};

export default Users;
