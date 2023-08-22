import React, { useEffect, useState } from "react";
import LoginForm from "./login";
import axios from 'axios';
import { useCookies } from "react-cookie";
import {  useNavigate } from "react-router-dom";
import bcrypt from 'bcryptjs'




const Authentication = (props) => {
    const [cookies, setCookie] = useCookies(['isAuthenticated', "user_data"]);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [userDetails, setUserDetails] = useState('')

    const url="https://jewel-inv-management-backend-demo.vercel.app/"

    const [encryptedCookie, setEncryptedCookie] = useState('')
    // const navigate = useNavigate()
    // const location = useLocation()


    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (encryptedCookie !== '' && userDetails !== '') {
            console.log(cookies)
            setCookie('isAuthenticated', encryptedCookie, { path: '/' });
            setCookie('user_data', userDetails, { path: '/' })
            props.setIsAuthenticated(true);
            navigate('/');
        }
        //eslint-disable-next-line
    }, [encryptedCookie, userDetails])


    const handleLogin = async (e) => {
        e.preventDefault();
        // console.log(userName)

        const response = await axios.post(`${url}/login`, { params: { userName: userName.toLowerCase(), password: password } });

        if (response.data.foundUser === true) {
            if (response.data.isAdmin) {
                props.setIsAdmin(true)
            }
            else {
                props.setIsAdmin(false)
            }
            console.log("loading Started")
            setIsLoading(true)
            const saltRounds = 12
            setEncryptedCookie(await bcrypt.hash('true', saltRounds));
            setUserDetails(await bcrypt.hash(JSON.stringify(response.data.isAdmin), saltRounds))
            setIsLoading(false)
            console.log("loading over")
        }
        else {
            if (response.data === false) {
                alert('Wrong Password')
                setPassword("")

            }
            else {
                alert(`${response.data}`)
                setPassword('')
                setUserName("")
            }
        }

    };


 

    const handleSignUp = async (e) => {
        e.preventDefault();

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const response = await axios.post(`${url}/signup`, { params: { userName: userName.toLowerCase(), password: hashedPassword } })
        if (response.data) {
            alert("New User Added")
            
            navigate('/')
            props.setActiveItem("/")
        }
        else {
            alert('User Already Exists')

        }
    };

    return (
        <LoginForm isLoading={isLoading} type={props.type} handleLogin={handleLogin} handleSignUp={handleSignUp}
            setPassword={setPassword} password={password} setUserName={setUserName} userName={userName}
        />
    )

}
export default Authentication