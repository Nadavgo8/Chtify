import React, {useRef, useState} from "react";

function TypingBox({onSendMessage, contact, token, contacts, socket}) {

    const text = useRef(null);

    const [message, setMessage] = useState("");

    const handleChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSubmit = async (event) => {
        if (message.trim() !== "") {
            event.preventDefault();
            const msg = {"msg": message}
            try {
                const res = await fetch('http://localhost:5000/api/Chats/' + contact.id + '/Messages', {
                    'method': 'POST',
                    'headers': {
                        'Content-Type': 'application/json',
                        "authorization": 'Bearer ' + token,
                    },
                    'body': JSON.stringify(msg)
                })
                if (res.status === 404) {
                    throw new Error('invalid_token')
                } else if (res.status !== 200) {
                    throw new Error('Error occurred while creating a new message')
                } else {
                    const data = await res.json();
                    const date = new Date(data.created);
                    // Add each message to the conversation
                    const newMessage = {
                        id: data.id,
                        time: date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false}),
                        senderName: data.sender.username,
                        text: data.content,
                        SR: data.id === contact.id ? "receiver" : "sender"
                    }

                    for (const element of contacts) {
                        if (element.id === newMessage.id) {
                            element.date = newMessage.time;
                            break;
                        }
                    }
                    onSendMessage(newMessage); // Pass the new message to the onSendMessage function
                }
            } catch (error) {
                alert(error);
            }
            setMessage("");
        }
        let id = contact.id
        text.current.value = ""; // Clear the input field after sending the message
        socket.emit('newMessage', id);
        console.log("sending")
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    }

    return (
        <div className="input-group mb-3"  onKeyDown={handleKeyDown}>
            <input ref={text} type="text" className="form-control" placeholder="Type a message"
                   aria-describedby="button-addon2" onChange={handleChange} id="messageBox"></input>
            <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={handleSubmit}>Send
            </button>

        </div>
    );
}

export default TypingBox;