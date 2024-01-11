import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import '../../../styles/custom-grids.css'

const Intro = () => {
    const navigate = useNavigate()
    const token = useSelector((state) => state.auth.token);

    const welcomeHandler = () => {
        navigate('/welcome')
    }
    return (
        <div className="splash">
            <div id="wrapper">
                <main id="main">
                    <div className="container-fluid">
                        <div className="row margin-0">
                            <div className="intro-box">
                                <div className="holder">
                                    <strong className="logo"><a href="index.html"><img src="/logo.svg" alt="StagePro" /></a></strong>
                                    <div className="text-box">
                                        <p>Unleash your creativity, organize your track lists and set lists effortlessly, boost your confidence by never forgetting the lyrics again. StagePro Canada is here to empower your performances and help to make every moment on stage truly memorable</p>
                                        <a className="btn" onClick={welcomeHandler}>LET’S START</a>
                                    </div>
                                </div>
                            </div>
                            <div className="splash-image-frame">
                                <div className="holder imgHolder">
                                    <div className="duplicate" title="STAGEPRO">STAGEPRO</div>
                                    <div className="image"><img src="/rockConcert.jpeg" alt="image" /></div>
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
        </div>
        // <div>
        //     <h1>INTRO PAGE</h1>
        //     <button onClick={welcomeHandler}>Go To Welcome</button>
        // </div>
    )
}

export default Intro