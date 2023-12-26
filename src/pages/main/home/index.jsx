import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { setAuth, setToken } from '../../../store/slices/auth-slice';
import axios from 'axios';
import Navbar from '../../../layout/navbar';

const Home = () => {
    const navigate = useNavigate();
    const addSongHandler = () => {
        navigate('/add-song')
    }
    return (
        <div className="main-template">
            <div id="wrapper">
                <Navbar />
                <main id="main">
                    <div className="container-fluid">
                        <div className="list-container">
                            <div className="container-head">
                                <h1>Recently Played</h1>
                                <button type="button" className="add-btn" onClick={addSongHandler}>
                                    <span className="txt">ADD NEW SONG</span>
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </div>
                            <div className="holder no-record">
                                <strong className="not-found">No Record Found</strong>
                            </div>
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

        </div>

        // <>
        // <Navbar />
        // <div>
        //     {addSong && <AddSong />}
        //     {loading && <h1>Loading...</h1>}
        //     <h1>Home</h1>
        //     <button onClick={addSongHandler}>add song</button>
        //     <button onClick={logoutHandler}>
        //         Logout
        //     </button>
        // </div>
        // </>
    )
}

export default Home