import React from 'react';
import './login.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


const LoginForm = (props) => {

    const handleEmailChange = (e) => {

        props.setUserName(e.target.value);
    };

    const handlePasswordChange = (e) => {
        props.setPassword(e.target.value);
    };

    return (
       

            <div className="container">
                <div className="loginform-wrapper">
                    <h2 className="loginform-title">{`${props.type === 'login' ? 'Login' : 'SignUp'}`}</h2>
                    <form className="loginform" onSubmit={props.type === 'login' ? props.handleLogin : props.handleSignUp}>
                        <div className="loginform-field">
                            <label htmlFor="userName">User Name:</label>
                            <input
                                type="name"
                                id="userName"
                                placeholder='User Name'
                                value={props.userName}
                                className='loginInputfield'
                                onChange={handleEmailChange}
                            />
                        </div>
                        <div className="loginform-field" style={{ marginBottom: "40px" }}>
                            <label htmlFor="password">Password:</label>
                            <input
                                type={"password"}
                                id="password"
                                placeholder='Password'
                                className='loginInputfield'
                                value={props.password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <>
                            <div style={{ color: "White", display: (props.isLoading === true ? "block" : 'none') }} >
                                <FontAwesomeIcon icon={faSpinner} spin />
                            </div>
                        </>
                        <button disabled={props.isLoading} className="submit-button" type="submit">
                            {props.type === 'login' ? 'Login' : 'SignUp'}
                        </button>
                    </form>
                </div>
            </div>
      
    );
};

export default LoginForm;
