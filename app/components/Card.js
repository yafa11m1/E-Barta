// components/Card.js
import React from 'react';

const Card = ({ fullname, email, picture }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden m-4">
      <div className="p-4">
        <img
          src={picture}
          alt={fullname}
          className="w-16 h-16 rounded-full mx-auto mb-4"
        />
        <h2 className="text-xl font-bold text-gray-800 mb-2">{fullname}</h2>
        <p className="text-gray-600">{email}</p>
      </div>
    </div>
  );
};

export default Card;
