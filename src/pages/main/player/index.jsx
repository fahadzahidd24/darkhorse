import React, { useEffect, useState } from 'react'
import Navbar from '../../../layout/navbar'
import { useDispatch, useSelector } from 'react-redux'
import { setRecentlyPlayedSongs, setSettings } from '../../../store/slices/song-slice'
import Slider from '@mui/material/Slider'
import { HexColorPicker } from 'react-colorful'
import ColorPicker from '../../../components/colorPicker'
import axios from 'axios'

const Player = () => {
    const { songToPlay, settings } = useSelector((state) => state.songs)
    const [color, setColor] = useState("#f00");
    const [currentLine, setCurrentLine] = useState(0);
    const [value, setValue] = useState(30);
    const [fontSize, setfontSize] = useState(40);
    const [playSpeed, setPlaySpeed] = useState(10);
    const dispatch = useDispatch();
    const [isPlaying, setIsPlaying] = useState(true);

    
    const speed = playSpeed;
    let emSpeed = 101 - speed;
    if(emSpeed > 100)
        emSpeed = 0;

    console.log({speed, emSpeed})

    console.log({speed})
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

    const togglePlay = () => {
        setIsPlaying((prevIsPlaying) => !prevIsPlaying);
        setPlaySpeed((prevSpeed) => (prevSpeed === 0 ? 20 : 0)); // Toggle play speed between 0 and 20
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowRight') {
                togglePlay();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [togglePlay]);


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

    const closeSettingsHandler = () => {
        dispatch(setSettings(false));
    }
    const openSettingsHandler = () => {
        if (!settings)
            dispatch(setSettings(true));
        else
            dispatch(setSettings(false));
    }

    const handleChangeSpeedSlider = (event, newValue) => {
        setPlaySpeed(newValue);
    };

    const handleChangeFontSlider = (event, newValue) => {
        setfontSize(newValue);
    };

    const openColorPicker = () => {
        setIsColorPickerOpen(true);
    };

    return (
        <div class="main-template">

            <div id="wrapper">

                <Navbar />

                <main id="main" class="layrics-main">
                    <div className='settingsBtnDiv'>
                        <button className='btn' onClick={openSettingsHandler} style={{ fontSize: 25, paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10, border: 'none' }}><i class="fa-solid fa-bars"></i></button>
                    </div>
                    <div class="container-fluid controlsScreenFlex">
                        <div class="settings-controls" style={settings ? { display: 'block' } : { display: 'none' }}>
                            <div class="settings-head">
                                <strong class="heading">Settings</strong>
                                <button class="btn-close" onClick={closeSettingsHandler}><i class="fa-solid fa-circle-xmark"></i></button>
                            </div>
                            <div class="controls-holder">
                                <div class="control-box" style={{ backgroundColor: color }}>
                                    <div class="frame">
                                        <strong class="txt">BACKGROUND COLOUR</strong>

                                        <button class="color-picker" onClick={openColorPicker}>
                                            <i class="fa-solid fa-palette"></i>
                                        </button>
                                        {isColorPickerOpen && (
                                            <ColorPicker color={color} setColor={setColor} onClose={() => setIsColorPickerOpen(false)} />
                                        )}
                                    </div>
                                </div>
                                <div class="control-box" style={{ backgroundColor: color }}>
                                    <strong class="txt">LYRICS</strong>
                                    <div class="range-controls">
                                        <strong class="txt">Font Size</strong>
                                        {/* <div class="slide-bar"> */}
                                        <Slider aria-label="Volume" value={fontSize} onChange={handleChangeFontSlider} min={20} max={150} />
                                        {/* <div class="range-slide" style={{ width: "80%" }}>
                                                <div class="range-thumb"></div>
                                            </div> */}
                                        {/* </div> */}
                                        {/* <div class="icons-bar">
                                            <button class="btn"><i class="fa-solid fa-circle-minus"></i></button>
                                            <button class="btn"><i class="fa-solid fa-circle-plus"></i></button>
                                        </div> */}
                                    </div>
                                    {/* <div class="frame">
                                        <strong class="txt">FONT COLOUR</strong>
                                        <button class="color-picker"><i class="fa-solid fa-palette"></i></button>
                                    </div> */}
                                </div>
                                <div class="control-box" style={{ backgroundColor: color }}>
                                    <div class="range-controls">
                                        <strong class="txt">Auto Scroll Speed</strong>
                                        <Slider aria-label="Volume" value={playSpeed} onChange={handleChangeSpeedSlider} />
                                        {/* <div class="slide-bar">
                                            <div class="range-slide" style={{ width: "80%" }}>
                                                <div class="range-thumb"></div>
                                            </div>
                                        </div>
                                        <div class="icons-bar">
                                            <button class="btn"><i class="fa-solid fa-circle-minus"></i></button>
                                            <button class="btn"><i class="fa-solid fa-circle-plus"></i></button>
                                        </div> */}
                                    </div>
                                </div>
                                <div class="control-box" style={{ backgroundColor: color }}>
                                    <strong class="txt">Controls</strong>
                                    <div class="btns-frame">
                                        <button class="btn-play" onClick={togglePlay}><i class={playSpeed === 0 ? "fa-solid fa-circle-play" : "fa-solid fa-circle-stop"}></i></button>
                                        {/* <div class="btns">
                                            <button class="btn"><i class="fa-solid fa-angle-up" style={{ color: color }}></i></button>
                                            <button class="btn"><i class="fa-solid fa-angle-down" style={{ color: color }}></i></button>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="list-container lyrics-frame" style={settings ? {} : { width: "100%" }}>
                            {playSpeed === 0 && <div className="stopDiv">
                                <div class="btns-frame">
                                    <button class="btn-play"><i class="fa-solid fa-circle-stop"></i></button>
                                </div>
                            </div>}
                            <div class="holder">
                                <div class="lyrics-list preLine" style={{ animation: `scrollText ${emSpeed}s linear infinite`, fontSize: fontSize }}>
                                    {songToPlay.map((line, index) => (
                                        // <li key={index} className={`lyrics-line${index === currentLine ? ' current-line' : (index < currentLine ? ' passed-line' : '')}`}>{line}</li>
                                        <li key={index} className={`lyrics-line`}>{line}</li>
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