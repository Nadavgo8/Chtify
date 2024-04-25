import React from "react";

function Contact({id, SR, username, nickName, profilePic, lastMessageContent, date, onClick }) {
    const handleClick = () => {
        onClick(username); // Pass the name of the clicked contact to the onClick handler in the Chat component
    };

    return (
        <li onClick={handleClick} id="li">
            <div className={SR}>
                <div className="profilePic">
                    <img src={profilePic} className="circle" alt={""}></img>
                </div>
                <div className="contactName">
                    <h6>{nickName}</h6>
                </div>
                <div className="lastMsgContent">
                    <h6>{lastMessageContent}</h6>
                </div>
                <div className="date">
                    <h6>{date}</h6>
                </div>
            </div>
        </li>
    );
}

export default Contact;