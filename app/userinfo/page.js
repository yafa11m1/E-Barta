'use client'
import React from 'react';
import { UserAuth } from '../Context/AuthContext';

const Page = () => {
    const {auth} = UserAuth();
    const user = auth.currentUser;

    return (
        <div>
            {user?(<p>{user.displayName}</p>):(<h3>Login First</h3>)}
            
        </div>
    );
}

export default Page;
