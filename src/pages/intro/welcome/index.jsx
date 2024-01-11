import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../../../styles/custom-grids.css'

const Welcome = () => {
    const navigate = useNavigate()

    const loginHandler = () => {
        navigate('/login')
    }
    return (
        <div id="wrapper">

            <div id="header">
                <div className="container-fluid d-flex">
                    <strong className="logo"><a href="index.html"><img src="/logo.svg" alt="StagePro" /></a></strong>
                </div>
            </div>

            <main id="main">
                <div className="container-fluid">
                    <div className="box welcom-box">
                        <div className="text-box">
                            <div className="box-head">
                                <h1>WELCOME!</h1>
                                <p className="lead">“STAGEPRO, Your Ultimate Musicians Stage Prompter and Work Station"</p>
                            </div>
                            <ul className="list">
                                <li><a href="#"><img className="icon" src="/list-icon.png" alt="icon" />Lyrics Stage Prompter</a></li>
                                <li><a href="#"><img className="icon" src="/list-icon.png" alt="icon" />Sheet Music</a></li>
                                <li><a href="#"><img className="icon" src="/list-icon.png" alt="icon" />Create Custom Setlists</a></li>
                                <li><a href="#"><img className="icon" src="/list-icon.png" alt="icon" />Easily Import Songs</a></li>
                                <li><a href="#"><img className="icon" src="/list-icon.png" alt="icon" />Customizable Lyrics Display</a></li>
                                <li><a href="#"><img className="icon" src="/list-icon.png" alt="icon" />Scroll and Change Pages</a></li>
                            </ul>
                            {/* <p className="txt">“The Ultimate Stage Prompter and Musicians Workstation”</p> */}
                            <div className="btns">
                                {/* <button type="button" className="btn">sign up</button> */}
                                <button type="button" className="btn" onClick={loginHandler}>Sign In</button>
                            </div>
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
    )
}

export default Welcome