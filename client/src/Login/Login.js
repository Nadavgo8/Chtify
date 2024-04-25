import {Link, useNavigate} from 'react-router-dom';
import './Login.css'
import {useState} from "react";


function Login({setToken, setUname}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()

    const handleUsername = (e) => {
        setUsername(e.target.value);
    }
    const handlePassword = (e) => {
        setPassword(e.target.value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            "username": username,
            "password": password
        }
        try {
            const res = await fetch('http://localhost:5000/api/Tokens', {
                'method': 'post',
                'headers': {
                    'Content-Type': 'application/json',
                },
                'body': JSON.stringify(user)
            })
            const token = await res.text();
            if (res.status !== 200) {
                throw new Error('Incorrect username or password')
            }  else {
                setToken(token);
                setUname(username);
                navigate(`/Chat`);
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-center h-100 align-items-center vh-100">
                <div className="card">
                    <div className="card-header">
                        Sign in
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            {/*username input*/}
                            <div className="input-group form-group">
                                <input type="text" className="form-control" placeholder="Username"
                                       value={username} onChange={handleUsername}></input>
                            </div>
                            {/*password input*/}
                            <div className="input-group form-group">
                                <input type="password" className="form-control" placeholder="Password"
                                       value={password} onChange={handlePassword}></input>
                            </div>
                            {/*login button*/}
                            <div className="input-group form-group">
                                <input type="submit" value="Login" className="btn btn-primary float-right"></input>
                            </div>
                        </form>
                    </div>
                    <div className="card-footer">
                        {/*registry screen*/}
                        <div className="d-flex justify-content-center">
                            Not registered? <Link className="link" to={"../Register"}>&nbsp;click here&nbsp;</Link> to
                            register
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;