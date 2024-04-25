import React, {useRef} from "react";

function NewContact({onAddContact, token}) {

    const contact = useRef(null);

    // Function to create a new contact
    const addContact = async () => {
        const user = {"username": contact.current.value}
        try {
            const res = await fetch('http://localhost:5000/api/Chats/', {
                'method': 'post',
                'headers': {
                    'Content-Type': 'application/json',
                    "authorization": 'Bearer ' + token,
                },
                'body': JSON.stringify(user)
            })
            if (res.status === 403) {
                throw new Error('Wrong username')
            } else if (res.status === 404) {
                throw new Error('There is no such user')
            } else if (!res.ok) {
                throw new Error('invalid_token')
            } else {
                const data = await res.json();
                const newContact = {
                    id: data.id,
                    username: data.user.username,
                    nickName: data.user.displayName,
                    profilePic: data.user.profilePic,
                    lastMessageContent: "",
                    date: "",
                    SR: "receiver"
                };
                onAddContact(newContact);// Call the onAddContact function passed as a prop to add the new contact to the Chat
            }
        } catch (error) {
            alert(error);
        }
        contact.current.value = ""; // Clear the input field after adding the contact
    };

    return (
        <>
            <button id="newContact" type="button" className="btn" data-bs-toggle="modal" data-bs-target="#contactModal">
                <img src="pictures/new-contact.png" className="circle" alt=""/>
            </button>
            {/* Modal */}
            <div className="modal fade" id="contactModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Add new contact</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
                        </div>
                        <div className="modal-body">
                            <div className="input-group form-group">
                                <input ref={contact} type="text" className="form-control"
                                       placeholder="Contact's identifier"
                                       id="contactIdentifier"/>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary" onClick={addContact}
                                    data-bs-dismiss="modal">
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NewContact;