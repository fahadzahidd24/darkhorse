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
    const [color, setColor] = useState("#000000");
    const [fontColor, setFontColor] = useState("#ffffff");
    const [currentLine, setCurrentLine] = useState(0);
    const [value, setValue] = useState(30);
    const [speedAtStop, setSpeedAtStop] = useState();
    const [fontSize, setfontSize] = useState(40);
    const [playSpeed, setPlaySpeed] = useState(4);
    const dispatch = useDispatch();
    const [isPlaying, setIsPlaying] = useState(true);


    const speed = playSpeed;
    let emSpeed = 121 - speed;
    if (emSpeed > 120)
        emSpeed = 0;

    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isFontColorPickerOpen, setIsFontColorPickerOpen] = useState(false);

    const togglePlay = () => {
        setIsPlaying((prevIsPlaying) => !prevIsPlaying);
        setPlaySpeed((prevSpeed) => (prevSpeed === 0 ? 20 : 0)); // Toggle play speed between 0 and 20
        if (playSpeed === 0) {
            setPlaySpeed(speedAtStop);
        }
        else {
            setSpeedAtStop(playSpeed);
            setPlaySpeed(0);
        }
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
            const currentLineSpeed = songToPlay[currentLine]?.speed || 0;
            const currentEmSpeed = 121 - currentLineSpeed;
    
            scrollInterval = setInterval(() => {
                setCurrentLine((prevLine) => (prevLine < songToPlay.length - 1 ? prevLine + 1 : prevLine));
            }, currentEmSpeed * 10);
        }
    
        return () => clearInterval(scrollInterval);
    }, [isPlaying, songToPlay, currentLine]);

    // const handlePlayPauseClick = () => {
    //     setIsPlaying((prevIsPlaying) => !prevIsPlaying);
    // };

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

    const openFontColorPicker = () => {
        setIsFontColorPickerOpen(true);
    }

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
                                <div class="control-box">
                                    <div class="frame">
                                        <div className='d-flex w-full justify-content-between'>
                                            <strong class="txt">BACKGROUND COLOUR</strong>
                                            <strong class="txt">FONT COLOR</strong>
                                        </div>
                                        <div className='d-flex w-full justify-content-between'>
                                            <button class="color-picker" onClick={openColorPicker}>
                                                <i class="fa-solid fa-palette"></i>
                                            </button>
                                            <button class="color-picker" onClick={openFontColorPicker}>
                                                <i class="fa-solid fa-palette"></i>
                                            </button>
                                        </div>
                                        {isColorPickerOpen && (
                                            <ColorPicker color={color} setColor={setColor} onClose={() => setIsColorPickerOpen(false)} />
                                        )}
                                        {isFontColorPickerOpen && (
                                            <ColorPicker color={fontColor} setColor={setFontColor} onClose={() => setIsFontColorPickerOpen(false)} />
                                        )}
                                    </div>
                                </div>
                                <div class="control-box">
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
                                <div class="control-box">
                                    <div class="range-controls">
                                        <strong class="txt">Auto Scroll Speed</strong>
                                        <Slider aria-label="Volume" value={playSpeed} onChange={handleChangeSpeedSlider} min={1} />
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
                                <div class="control-box">
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
                        <div class="list-container lyrics-frame" style={settings ? { background: color } : { width: "100%", background: color }}>
                            {playSpeed === 0 && <div className="stopDiv">
                                <div class="btns-frame">
                                    <button class="btn-play"><i class="fa-solid fa-circle-stop"></i></button>
                                </div>
                            </div>}
                            <div class="holder" >
                                <div class="lyrics-list preLine" style={emSpeed > 0 ? { animation: `scrollText ${emSpeed}s linear`, fontSize: fontSize } : {}}>
                                    {songToPlay.map((line, index) => (
                                        // <li key={index} className={`lyrics-line${index === currentLine ? ' current-line' : (index < currentLine ? ' passed-line' : '')}`}>{line}</li>
                                        <li key={index}    className={`lyrics-line ${
                                            index === currentLine
                                                ? 'current-line'
                                                : index < currentLine
                                                ? 'passed-line'
                                                : ''
                                        }`}
                                        style={{ opacity: index < currentLine ? 0.5 : fontColor, color: fontColor }}>{line}</li>
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