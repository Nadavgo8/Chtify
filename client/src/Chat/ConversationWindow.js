import React, {useEffect, useState} from "react";
import ConversationWindowHeader from "./ConversationWindowHeader.js";
import ConversationWindowBody from "./ConversationWindowBody.js";
import ConversationWindowFooter from "./ConversationWindowFooter.js";

function ConversationWindow({contact, token, contacts, socket}) {
    const [conversation, setConversation] = useState([]);

    useEffect(() => {
        const getConversation = async () => {
            if (!contact) {
                return;
            }
            try {
                const res = await fetch(
                    "http://localhost:5000/api/Chats/" + contact.id + "/Messages",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            authorization: "Bearer " + token,
                        },
                    }
                );
                if (res.status === 404) {
                    throw new Error('invalid_token')
                } else if(res.status !== 200) {
                    throw new Error('Error occurred while creating a new message')
                } else {
                    const data = await res.json();
                    // Add each message to the conversation
                    const newConversation = data.map((message) => ({
                        id: message.id,
                        time: new Date(message.created).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        }),
                        senderName: message.sender.username,
                        text: message.content,
                        SR: message.sender.username === contact.username ? "receiver" : "sender",
                    }));
                    setConversation(newConversation.reverse());
                }
            } catch (error) {
                alert(error);
            }
        };

        getConversation();
    }, [contact, token,contacts]);

    const updateConversation = (newMessage) => {
        setConversation((prevConversation) => [...prevConversation, newMessage]);
    };

    return (
        <div className="card" id="card">
            <ConversationWindowHeader contact={contact}/>
            <div className="card-body" id="card-body">
                <div className="conversation">
                    <ConversationWindowBody conversation={conversation} contact={contact}/>
                </div>
            </div>
            <ConversationWindowFooter contact={contact} handleSendMessage={updateConversation} token={token} contacts={contacts} socket={socket}/>
        </div>
    );

}

export default ConversationWindow;