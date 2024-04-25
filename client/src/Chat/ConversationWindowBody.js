import Message from "./Message.js";
import React from "react";

function ConversationWindowBody({conversation, contact }) {
    if (!contact) {
        return (
            <h3>Welcome <br/> to <br/> Chatify!</h3>
        );
    }
    return (
        <>{conversation.map((message, index) => (
            <Message key={index} SR={message.SR} time={message.time} text={message.text}/>
        ))}</>
    );
}

export default ConversationWindowBody;