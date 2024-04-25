import {Link, useNavigate} from 'react-router-dom';
import './Register.css'
import {useState} from "react";

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [didChoosePic, setDidChoosePic] = useState(false);
    const [showTooltip, setShowTooltip] = useState(null);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleUsername = (e) => {
        setUsername(e.target.value);
    }
    const handlePassword = (e) => {
        setPassword(e.target.value);
    }
    const handleRepeatPassword = (e) => {
        setRepeatPassword(e.target.value);
    }
    const handleNickname = (e) => {
        setNickname(e.target.value);
    }
    const handleProfilePicture = (e) => {
        const pic = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setProfilePicture(reader.result);
        };
        if (pic) {
            reader.readAsDataURL(pic);
            setDidChoosePic(true);
        } else {
            setDidChoosePic(false);
        }
        setProfilePicture(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password || !repeatPassword || !nickname) {
            setError("All fields are required");
        }
        if (password !== repeatPassword) {
            setError("not the same")
            alert("Passwords not the same")
            return;
        }
        const usernameFormat = /^(?=.*[A-Z])[A-Za-z0-9]{8,16}$/.test(username);
        if (!usernameFormat) {
            alert("Username not in format")
            return;
        }
        const passwordFormat = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$/.test(password);
        if (!passwordFormat) {
            alert("Password not in format")
            return;
        }
        if(didChoosePic === false){
            alert("Forgot to choose your profile picture (;")
            return;
        }
        const newUser = {
            "username": username,
            "password": password,
            "displayName": nickname,
            "profilePic": profilePicture
        }
        try {
            const res = await fetch('http://localhost:5000/api/Users', {
                'method': 'post',
                'headers': {
                    'Content-Type': 'application/json',
                },
                'body': JSON.stringify(newUser)
            })
            if (res.status === 409){
                throw new Error('This user is already registered')
            }
            else if (res.status !== 200) {
                throw new Error('Something went wrong, try again')
            } else {
                // Navigate to the Login screen
                navigate("/")
            }
        }
        catch (error) {
            alert(error);
        }
    }
    const handleFocus = (tooltipId) => {
        setShowTooltip(tooltipId);
    };

    const handleBlur = () => {
        setShowTooltip(null);
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-center h-100 align-items-center vh-100">
                <div className="card">
                    <div className="card-header">
                        Create account
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            {/*username tooltip*/}
                            {showTooltip === 'username' && (
                                <span>Starts with a capital letter and 8-16 characters</span>
                            )}
                            {/*username input*/}
                            <div className="input-group form-group">
                                <input type="text" className="form-control" placeholder="Username"
                                       name="username" value={username} onChange={handleUsername} required
                                       onFocus={() => handleFocus('username')} onBlur={handleBlur}></input>
                                <i className="bx bx-error-circle error-icon"></i>
                            </div>
                            {/*password tooltip*/}
                            {showTooltip === 'password' && (
                                <span>A mix of 8-16 digits and letters</span>
                            )}
                            {/*password input*/}
                            <div className="input-group form-group">
                                <input type="password" className="form-control" placeholder="Password"
                                       name="password" value={password} onChange={handlePassword} required
                                       onFocus={() => handleFocus('password')} onBlur={handleBlur}></input>
                            </div>
                            {/*repeat password tooltip*/}
                            {showTooltip === 'repPassword' && (
                                <span>A mix of 8-16 digits and letters</span>
                            )}
                            {/*repeat password input*/}
                            <div className="input-group form-group">
                                <input type="password" className="form-control" placeholder="Repeat password"
                                       name="repeatPassword" value={repeatPassword} onChange={handleRepeatPassword}
                                       required onFocus={() => handleFocus('repPassword')} onBlur={handleBlur}></input>
                            </div>
                            {/*nickname tooltip*/}
                            {showTooltip === 'nickname' && (
                                <span>At least 1 note, feel free to be creative (;</span>
                            )}
                            {/*nickname input*/}
                            <div className="input-group form-group">
                                <input type="text" className="form-control" placeholder="Nickname"
                                       name="nickname" value={nickname} onChange={handleNickname}
                                       required  onFocus={() => handleFocus('nickname')} onBlur={handleBlur}></input>
                            </div>
                            {/*upload photo button*/}
                            <div className="input-group form-group">
                                <label htmlFor="profilePhoto" id="choosePhoto">Choose profile picture</label>
                                <input type="file" accept='image/*' id="profilePhoto" onChange={handleProfilePicture}></input>
                            </div>
                            {/*profile photo circle*/}
                            <div className="d-flex justify-content-center input-group form-group">
                                {didChoosePic ? (
                                    <img src={profilePicture} alt="profilePicture" className="circle" />
                                ) : (
                                    <img src="pictures/profilePic.jpg" alt="profilePic" className="circle" />
                                )}
                            </div>

                            {/*register button*/}
                            <div className="d-flex justify-content-center input-group form-group">
                                <input id="regButton" type="submit" value="Register"
                                       className="btn btn-primary float-right"></input>
                            </div>
                        </form>
                    </div>
                    <div className="card-footer">
                        {/*registry screen*/}
                        <div className="d-flex justify-content-center">
                            Already registered? <Link className="link" to={"/"}>&nbsp;click here&nbsp;</Link>to login
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register
