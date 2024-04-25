import React from "react";

function Message({SR, text, time, id, senderName}) {
    return (
        <div id="message">
            <div className={SR}>
                <p>{text}<span>{time}</span></p>
            </div>
        </div>
    );
}

export default Message;