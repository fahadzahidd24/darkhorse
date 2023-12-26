import React, { useEffect, useState } from 'react'
import Navbar from '../../../layout/navbar'
import { useSelector } from 'react-redux'


const Player = () => {
    const { songToPlay } = useSelector((state) => state.songs)
    const [currentLine, setCurrentLine] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const speed = 3000;

    useEffect(() => {
        let scrollInterval;

        if (isPlaying) {
            scrollInterval = setInterval(() => {
                setCurrentLine((prevLine) => (prevLine < songToPlay.length - 1 ? prevLine + 1 : prevLine));
            }, speed);
        }

        return () => clearInterval(scrollInterval);
    }, [isPlaying, songToPlay]);

    const handlePlayPauseClick = () => {
        setIsPlaying((prevIsPlaying) => !prevIsPlaying);
    };


    return (
        <div class="main-template">

            <div id="wrapper">

                <Navbar />

                <main id="main" class="layrics-main">
                    <div class="container-fluid">
                        <div class="settings-controls">
                            <div class="settings-head">
                                <strong class="heading">Settings</strong>
                                <button class="btn-close"><i class="fa-solid fa-circle-xmark"></i></button>
                            </div>
                            <div class="controls-holder">
                                <div class="control-box">
                                    <div class="frame">
                                        <strong class="txt">BACKGROUND COLOUR</strong>
                                        <button class="color-picker"><i class="fa-solid fa-palette"></i></button>
                                    </div>
                                </div>
                                <div class="control-box">
                                    <strong class="txt">LYRICS</strong>
                                    <div class="range-controls">
                                        <strong class="txt">Font Size</strong>
                                        <div class="slide-bar">
                                            <div class="range-slide" style={{ width: "80%" }}>
                                                <div class="range-thumb"></div>
                                            </div>
                                        </div>
                                        <div class="icons-bar">
                                            <button class="btn"><i class="fa-solid fa-circle-minus"></i></button>
                                            <button class="btn"><i class="fa-solid fa-circle-plus"></i></button>
                                        </div>
                                    </div>
                                    <div class="frame">
                                        <strong class="txt">FONT COLOUR</strong>
                                        <button class="color-picker"><i class="fa-solid fa-palette"></i></button>
                                    </div>
                                </div>
                                <div class="control-box">
                                    <div class="range-controls">
                                        <strong class="txt">Auto Scroll Speed</strong>
                                        <div class="slide-bar">
                                            <div class="range-slide" style={{ width: "80%" }}>
                                                <div class="range-thumb"></div>
                                            </div>
                                        </div>
                                        <div class="icons-bar">
                                            <button class="btn"><i class="fa-solid fa-circle-minus"></i></button>
                                            <button class="btn"><i class="fa-solid fa-circle-plus"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="control-box">
                                    <strong class="txt">Controls</strong>
                                    <div class="btns-frame">
                                        <button class="btn-play"><i class="fa-solid fa-circle-play"></i></button>
                                        <div class="btns">
                                            <button class="btn"><i class="fa-solid fa-angle-up"></i></button>
                                            <button class="btn"><i class="fa-solid fa-angle-down"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="list-container lyrics-frame">
                            <div class="holder">
                                <div class="lyrics-list preLine" style={{ animation: `scrollText ${speed/10}s linear infinite` }}>
                                    {songToPlay.map((line, index) => (
                                        <li key={index} className={`lyrics-line${index === currentLine ? ' current-line' : (index < currentLine ? ' passed-line' : '')}`}>{line}</li>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <div class="corner left"><img src="/top-strip.png" alt="strip" /></div>
                <div class="corner right"><img src="/bottom-strip.png" alt="strip" /></div>
                <div class="bar left">
                    <img src="/logo.svg" alt="logo" class="side-logo" />
                </div>
                <div class="bar right">
                    <img src="/logo.svg" alt="logo" class="side-logo" />
                </div>
            </div>
        </div>
    )
}

export default Player