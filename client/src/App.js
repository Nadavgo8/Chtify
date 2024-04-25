import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import React, {useState} from "react";
import Login from "./Login/Login.js"
import Register from "./Register/Register.js"
import Chat from "./Chat/Chat.js"
import io from "socket.io-client";
const socket = io.connect("http://localhost:3000");

function App() {
    const [token, setToken] = useState(null);
    const [userName, setUsername] = useState(null);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login setToken={setToken} setUname={setUsername}/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/chat" element={token ? <Chat token={token} userName={userName} socket={socket}/> : <Navigate to="/"/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;