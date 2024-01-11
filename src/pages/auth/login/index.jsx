import React, { useState } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAuth, setToken, setUser } from '../../../store/slices/auth-slice';
import { useNavigate } from 'react-router-dom';
import '../../../styles/custom-grids.css'
import Loader from '../../../components/loader';
import ErrorModal from '../../../components/errorModal';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        errorMessage: '',
        isError: false
    });
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    })

    const changeHandler = (name, e) => {
        setLoginForm((prevData) => ({
            ...prevData,
            [name]: e.target.value
        }));
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/login`, loginForm);
            localStorage.setItem('token', response.data.data.api_token);
            localStorage.setItem('user', JSON.stringify({name: response.data.data.name, email: response.data.data.email}));
            dispatch(setToken(response.data.data.api_token));
            dispatch(setAuth(true));
            dispatch(setUser({name: response.data.data.name, email: response.data.data.email}));
            navigate('/');
        } catch (error) {
            setError({
                errorMessage: error.response.data.message,
                isError: true
            });
            console.log(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    const handlerOkPress = () => {
        setError({
            errorMessage: '',
            isError: false
        });
    }

    return (
        <>
            {loading && <Loader />}
            <div id="wrapper">
                <div id="header">
                    <div className="container-fluid d-flex">
                        <strong className="logo"><a href="index.html"><img src="/logo.svg" alt="StagePro" /></a></strong>
                    </div>
                </div>

                <main id="main">
                    <div className="container-fluid">
                        <div className="box">
                            <h1 className="text-center">SIGN IN</h1>
                            {error.isError && <ErrorModal onPressOk={handlerOkPress} errorMessage={error.errorMessage} />}
                            <form onSubmit={submitHandler} className="form">
                                <div className="form-group">
                                    <img className="icon" src="/mail-icon.svg" alt="mail" />
                                    <input type="email" className="form-control" placeholder="Email" value={loginForm.email} onChange={changeHandler.bind(null, "email")} />
                                </div>
                                <div className="form-group">
                                    <img className="icon lock" src="/lock-icon.svg" alt="lock" />
                                    <input type="password" className="form-control" placeholder="password" value={loginForm.password} onChange={changeHandler.bind(null, "password")} />
                                </div>
                                {/* <div className="form-group d-flex content-justify-end">
                                    <a href="#" className="link">Forget Password?</a>
                                </div> */}
                                <div className="form-group d-flex content-justify-center margin-0">
                                    <input type="submit" value="Sign In" className="btn" />
                                </div>
                            </form>
                        </div>
                    </div>
                </main>

                <div className="corner left"><img src="/top-strip.png" alt="strip" /></div>
                <div className="corner right"><img src="/bottom-strip.png" alt="strip" /></div>
                <div className="bar left">
                    <img src="/logo.svg" alt="logo" className="side-logo" />
                </div>
                <div className="bar right">
                    <img src="/logo.svg" alt="logo" className="side-logo" />
                </div>
            </div>
        </>
    )
}

export default Login;