import './chat.css'
import NewContact from "./NewContact.js";
import ConversationWindow from "./ConversationWindow.js";
import Contact from "./Contact.js";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import DeleteContact from "./DeleteContact.js";

function Chat({token, userName, socket}) {
    const [contacts, setContacts] = useState([]); // Storing contacts
    const [selectedContact, setSelectedContact] = useState(null); // Update the selected contact
    const [profilePicture, setProfilePicture] = useState("");
    const [nickname, setNickname] = useState("");
    let id = socket.id
        useEffect(() => {
        getUserDetails();
        getContactsAndLastMsg();
            },
            [contacts]);
    useEffect(() => {
        socket.on("newMessage", async (id) => {
            await getContactsAndLastMsg()
            console.log("sent message\n")
        });
    }, []);

    useEffect(()=>{
        socket.on("newContact", async (id) => {
            await addContact(id)
            console.log("received new contact\n")
            socket.emit('newContact');
        });
        socket.on("deleteContact", async (id) => {
            // deleteContact(id)
            // await getContactsAndLastMsg()
            console.log("received delete\n")
            socket.emit('deleteContact', id);
        });
    })

    async function getUserDetails() {
        try {
            const res = await fetch('http://localhost:5000/api/Users/' + userName, {
                'method': 'get',
                'headers': {
                    'Content-Type': 'application/json',
                    "authorization": 'Bearer ' + token,
                },
            })
            if (res.status !== 200) {
                throw new Error('We have an error :(')
            } else {
                const data = await res.json();

                setProfilePicture(data.profilePic);
                setNickname(data.displayName);
            }
        } catch (error) {
            alert(error);
        }
    }

    //retrieve the former conversations
    async function getContactsAndLastMsg() {
        try {
            const res = await fetch('http://localhost:5000/api/Chats' , {
                'method': 'get',
                'headers': {
                    'Content-Type': 'application/json',
                    "authorization": 'Bearer ' + token,
                }
            });
            if (res.status !== 200) {
                throw new Error('retrieving former conversations failed')
            } else {
                const data = await res.json();
                setContacts([]);
                for(let i = 0; i < data.length; i++){
                    addContact({
                        id: data[i].id,
                        username: data[i].user.username,
                        nickName: data[i].user.displayName,
                        profilePic: data[i].user.profilePic,
                        lastMessageContent: data[i].lastMessage
                            ? truncateMessage(data[i].lastMessage.content, 10)
                            : "",
                        lastMessageCreated: (data[i].lastMessage ?
                        new Date(data[i].lastMessage.created).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        }) : "")
                    });
                }
            }
        } catch (error) {
            alert(error);
        }
    }

    // Function to add a new contact to the list
    const addContact = (newContact) => {    ;
        setContacts((prevContacts) => [...prevContacts, newContact]);
        // socket.emit('newContact')
    };

    // Handle the contact click event
    const handleContactClick = (clickedContact) => {
        setSelectedContact(clickedContact);
    };

    const fixConversationWindow = (userId) => {
        if(selectedContact.id === userId){
            setSelectedContact(null);
        }
    }
    const deleteContact = (userId) => {
        setContacts(prevContacts => {
            const contactToDelete = prevContacts.find(contact => contact.id === userId);
            if (contactToDelete) {
                return prevContacts.filter(contact => contact.id !== userId);
            }
            return prevContacts;
        });
        fixConversationWindow(userId);
        socket.emit('deleteContact',id)
    };

    // Helper function to truncate the message content
    const truncateMessage = (message, maxLength) => {
        if (message.length <= maxLength) {
            return message;
        } else {
            return message.slice(0, maxLength) + "...";
        }
    };

    return (
        <div className="container d-flex justify-content-center" id="container">
            <div className="firstCard">
                {/*contacts*/}
                <div className="card" id="card">
                    <div className="card-header" id="card-header">
                        {/*my info*/}
                        <img src={profilePicture} className="circle" alt=""/>
                        {nickname}
                        {/* Button trigger modal */}
                        <NewContact onAddContact={addContact} token={token}/>
                        <DeleteContact onDeleteContact={deleteContact} token={token} contacts={contacts}/>
                    </div>
                    <div className="card-body" id="card-body">
                        <div className="chats">
                            <ul id="ul">
                                {contacts.map((contact, index) => (
                                    <Contact key={index}
                                             id={contact.id}
                                             SR={contact === selectedContact ? 'contact inConversation' : 'contact'}
                                             username={contact.username}
                                             nickName={contact.nickName}
                                             profilePic={contact.profilePic}
                                             lastMessageContent={contact.lastMessageContent}
                                             date={contact.lastMessageCreated}
                                             onClick={() => handleContactClick(contact)}
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/*chat*/}
            <div className="secondCard" id="secondCard">
                <ConversationWindow contact={selectedContact} token={token} contacts={contacts} socket={socket}/>
            </div>
            <button className="btn btn-danger" id="logOut">
                <Link to="/">Log out </Link>
            </button>
        </div>
    );
}

export default Chat;
