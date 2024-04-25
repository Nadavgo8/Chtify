import React from "react";

function ConversationWindowHeader({contact}) {
    if (!contact) {
        return null;
    }
    return (
        <div className="card-header" id="card-header">
            <div className="d-flex justify-content-center input-group form-group">
                <div className="contact">
                    <div className="profilePic">
                        <img src={contact.profilePic} className="circle" alt=""/>
                    </div>
                    <div className="contactName">
                        {contact.nickName}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConversationWindowHeader;