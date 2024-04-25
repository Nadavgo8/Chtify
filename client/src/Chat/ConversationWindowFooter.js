import TypingBox from "./TypingBox.js";
import React from "react";

function ConversationWindowFooter({contact, handleSendMessage, token, contacts, socket}) {
    if (!contact) {
        return null;
    }
    return (
        <div className="card-footer" id="card-footer">
            <TypingBox onSendMessage={handleSendMessage} contact={contact} token={token} contacts={contacts} socket={socket}/>
        </div>
    );
}

export default ConversationWindowFooter;