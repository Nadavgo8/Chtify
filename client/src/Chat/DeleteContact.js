import React, {useRef} from "react";

function DeleteContact({onDeleteContact, token, contacts}) {

    // Function to create a new contact
    const contact = useRef(null);

    const deleteContact = async () => {
        const username = contact.current.value;

        // Find the contact by username
        const contactToDelete = contacts.find((contact) => contact.username === username);
        if (!contactToDelete) {
            alert("Error, this contact does not exist");
            contact.current.value = "";
            return;
        }
        try {
            const res = await fetch("http://localhost:5000/api/Chats/" + contactToDelete.id, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    authorization: "Bearer " + token,
                },
            });
            if (!res.ok) {
                throw new Error("Failed to delete contact");
            }
            onDeleteContact(contactToDelete.id); // Call onDeleteContact with the contact id
        } catch (error) {
            alert(error);
        }

        contact.current.value = ""; // Clear the input field after deleting the contact
    };

    return (
        <>
            <button id="delete" type="button" className="btn" data-bs-toggle="modal" data-bs-target="#deleteModal">
                <img src="pictures/delete.png" className="circle" alt=""/>
            </button>
            {/* Modal */}
            <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Delete contact</h1>
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
                            <button type="submit" className="btn btn-primary" onClick={deleteContact}
                                    data-bs-dismiss="modal">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DeleteContact;