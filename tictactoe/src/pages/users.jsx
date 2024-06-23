import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Potentialchat({ potential, currentUser, createChat }) {
    return (
        <div className="all-users">
            {potential.map((user) => (
                <div
                    key={user.userID}
                    className="single-user"
                    onClick={() => createChat(currentUser._id, user.userID)}
                >
                    {user.userID}
                    <div className="user-online" />
                </div>
            ))}
        </div>
    );
}
