import React, { useEffect, useState } from 'react'
import Navbar from '../../../layout/navbar'
import { useDispatch, useSelector } from 'react-redux'
import { setRecentlyPlayedSongs, setSettings, setSongToPlay, setSongToPlayId } from '../../../store/slices/song-slice'
import Slider from '@mui/material/Slider'
import { HexColorPicker } from 'react-colorful'
import ColorPicker from '../../../components/colorPicker'
import axios from 'axios'
import Loader from '../../../components/loader'

const Player = () => {
    const { songToPlay, songToPlayId, settings, songs } = useSelector((state) => state.songs)
    const [color, setColor] = useState("#000000");
    const [loading, setLoading] = useState(false);
    const [fontColor, setFontColor] = useState("#ffffff");
    const [lineColor, setLineColor] = useState(fontColor);
    const [currentLine, setCurrentLine] = useState(0);
    const [value, setValue] = useState(30);
    const [speedAtStop, setSpeedAtStop] = useState();
    const [fontSize, setfontSize] = useState(40);
    const [playSpeed, setPlaySpeed] = useState(4);
    const dispatch = useDispatch();
    const [isPlaying, setIsPlaying] = useState(true);
    const [linesToSkip, setLinesToSkip] = useState(0);
    const [fullScreen, setFullScreen] = useState(false);
    const [newSongToPlay, setNewSongToPlay] = useState(songToPlay);
    const [recentColors, setRecentColors] = useState(['#F88379', '#0ABAB5', '#FFEF00', "#E6E6FA", "#98FF98"]);

    const speed = playSpeed;
    let emSpeed = 121 - speed;
    if (emSpeed > 120)
        emSpeed = 0;

    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isFontColorPickerOpen, setIsFontColorPickerOpen] = useState(false);
    const [isLineColorPickerOpen, setIsLineColorPickerOpen] = useState(false);
    const [selectedLines, setSelectedLines] = useState([]);

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
            const playerDiv = document.querySelector('.playerDiv');
            if (event.key === 'ArrowUp') {
                togglePlay();
            }
            if (event.key === 'ArrowRight' && loading === false) {
                if (linesToSkip < playerDiv.scrollHeight - 1000)
                    setLinesToSkip((prevLinesToSkip) => (prevLinesToSkip + 500));
                else
                    playNextSong();
            }
            if (event.key === 'ArrowLeft' && loading === false) {
                if (linesToSkip > 0)
                    setLinesToSkip((prevLinesToSkip) => (prevLinesToSkip - 500));
                // togglePlay();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [togglePlay]);

    const playNextSong = async () => {
        if (songs.length > 0) {
            const index = songs.findIndex((song) => song.id === songToPlayId);
            if (index < songs.length - 1) {
                setLoading(true);
                try {
                    await axios.post(`${process.env.REACT_APP_BASE_URL}/recently-played`, {
                        song_id: songs[index + 1].id
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    const song2 = await axios.get(`${process.env.REACT_APP_BASE_URL}/song/${songs[index + 1].id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    console.log(song2.data.data.lyrics);
                    // dispatch(setRecentlyPlayedSongs(song));
                    const songLyrics = song2.data.data.lyrics.split('\n');
                    dispatch(setSongToPlay(songLyrics))
                    // dispatch(setRecentlyPlayedSongs(songs[index + 1]));
                    // const lyrics = songs[index + 1].lyrics.split('\n');
                    // dispatch(setSongToPlay(lyrics));
                    dispatch(setSongToPlayId(songs[index + 1].id));
                    setLinesToSkip(0);
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false);
                }
            }
            else {
                setLoading(true);
                try {
                    await axios.post(`${process.env.REACT_APP_BASE_URL}/recently-played`, {
                        song_id: songs[0].id
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    const song2 = await axios.get(`${process.env.REACT_APP_BASE_URL}/song/${songs[0].id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    console.log(song2.data.data.lyrics);
                    // dispatch(setRecentlyPlayedSongs(song));
                    const songLyrics = song2.data.data.lyrics.split('\n');
                    dispatch(setSongToPlay(songLyrics))
                    // dispatch(setRecentlyPlayedSongs(songs[0]));
                    // const lyrics = songs[0].lyrics.split('\n');
                    // dispatch(setSongToPlay(lyrics));
                    dispatch(setSongToPlayId(songs[0].id));
                    setLinesToSkip(0);
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false);
                }
            }
        }
    }

    const playPrevSong = async () => {
        if (songs.length > 0) {
            const index = songs.findIndex((song) => song.id === songToPlayId);
            if (index > 0) {
                setLoading(true);
                try {
                    await axios.post(`${process.env.REACT_APP_BASE_URL}/recently-played`, {
                        song_id: songs[index - 1].id
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    const song2 = await axios.get(`${process.env.REACT_APP_BASE_URL}/song/${songs[index - 1].id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    console.log(song2.data.data.lyrics);
                    // dispatch(setRecentlyPlayedSongs(song));
                    const songLyrics = song2.data.data.lyrics.split('\n');
                    dispatch(setSongToPlay(songLyrics))
                    // dispatch(setRecentlyPlayedSongs(songs[index - 1]));
                    // const lyrics = songs[index - 1].lyrics.split('\n');
                    // dispatch(setSongToPlay(lyrics));
                    dispatch(setSongToPlayId(songs[index - 1].id));
                    setLinesToSkip(0);
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false);
                }
            }
        }
    };

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

    if (fullScreen) {
        dispatch(setSettings(false))
    }

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

    const openLineColorPicker = () => {
        setIsLineColorPickerOpen(true);
    }

    const selectLinesHandler = (index) => {
        const object = {
            index: index,
            color: lineColor
        }
        setSelectedLines((prevSelectedLines) => {
            const index = prevSelectedLines.findIndex((lineObj) => lineObj.index === object.index);
            if (index === -1) {
                return [...prevSelectedLines, object];
            }
            else {
                const newSelectedLines = [...prevSelectedLines];
                newSelectedLines.splice(index, 1);
                return newSelectedLines;
            }
        });
        const newSongToPlay2 = [...newSongToPlay];

        newSongToPlay2[index] = `<li style="color: ${lineColor}">${songToPlay[index].match(/<li style="color: (.*?)">(.*?)<\/li>/)[2]}</li>`;
        setNewSongToPlay(newSongToPlay2);
        setRecentColors((prevRecentColors) => {
            const index = prevRecentColors.findIndex((color) => color === lineColor);
            if (index === -1) {
                if (prevRecentColors.length > 7)
                    prevRecentColors.splice(7, 1);
                return [lineColor, ...prevRecentColors];
            }
            else {
                const newRecentColors = [...prevRecentColors];
                if (newRecentColors.length > 7)
                    newRecentColors.splice(7, 1);
                newRecentColors.splice(index, 1);
                return [lineColor, ...newRecentColors];
                // newRecentColors.splice(index, 1);
                // return [lineColor, ...newRecentColors];
            }
        });
    }


    const saveHandler = async () => {
        if (newSongToPlay.length > 0) {
            const finalText = newSongToPlay.join('\n');
            const formData = {
                id: songToPlayId,
                lyrics: finalText
            }
            console.log({ formData });
            console.log({ songToPlay });
            setLoading(true);
            try {
                await axios.post(`${process.env.REACT_APP_BASE_URL}/song-update`, formData, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    }

    const selectColorHandler = (color) => {
        console.log(color);
        setLineColor(color);
    }

    return (
        <div class="main-template">
            {loading && <Loader />}
            <div id="wrapper">

                <Navbar />

                <main id="main" class="layrics-main">
                    <div className='settingsBtnDiv'>
                        <button className='btn' onClick={openSettingsHandler} style={{ fontSize: 25, paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10, border: 'none' }}><i class="fa-solid fa-bars"></i></button>
                    </div>
                    <div className={fullScreen ? "fullScreenContainerFluid " : "container-fluid controlsScreenFlex"}>
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
                                        {isLineColorPickerOpen && (
                                            <ColorPicker color={lineColor} line={true} setColor={setLineColor} onClose={() => setIsLineColorPickerOpen(false)} recentColors={recentColors} onSelectColor={selectColorHandler} />
                                        )}
                                    </div>
                                    <div class="frame">
                                        <div className='d-flex w-full justify-content-between'>
                                            <strong class="txt">LINE COLOR</strong>
                                        </div>
                                        <div className='d-flex w-full justify-content-between'>
                                            <button class="color-picker" onClick={openLineColorPicker}>
                                                <i class="fa-solid fa-palette"></i>
                                            </button>
                                        </div>
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
                                        <Slider aria-label="Volume" value={playSpeed} onChange={handleChangeSpeedSlider} min={0} />
                                    </div>
                                </div>
                                <div class="control-box">
                                    <strong class="txt">Controls</strong>
                                    <div class="btns-frame d-flex flex-column">
                                        <button class="btn-play" onClick={togglePlay}><i class={playSpeed === 0 ? "fa-solid fa-circle-play" : "fa-solid fa-circle-stop"}></i></button>
                                        <div class="d-flex">
                                            <button class="btn-play m-2" onClick={playPrevSong}><i class="fa fa-angle-left"></i></button>
                                            <button class="btn-play m-2" onClick={playNextSong}><i class="fa fa-angle-right"></i></button>
                                        </div>
                                        {/* <div class="btns">
                                            <button class="btn"><i class="fa-solid fa-angle-up" style={{ color: color }}></i></button>
                                            <button class="btn"><i class="fa-solid fa-angle-down" style={{ color: color }}></i></button>
                                        </div> */}
                                    </div>
                                </div>
                                <div class="control-box d-flex justify-content-center align-items-center">
                                    <button className='btn smallBtn' onClick={saveHandler}>Save</button>
                                </div>
                            </div>
                        </div>
                        <div className={fullScreen ? "list-container lyrics-frame fullScreenListContainer" : "list-container lyrics-frame"} style={settings ? { background: color } : { width: "100%", background: color }}>


                            {/* {playSpeed === 0 && <div className="stopDiv">
                                <div class="btns-frame">
                                    <button class="btn-play"><i class="fa-solid fa-circle-stop"></i></button>
                                </div>
                            </div>} */}
                            <div class="holder" >
                                {/* <div class="lyrics-list preLine" style={emSpeed > 0 ? { animation: `scrollText ${emSpeed}s linear`, fontSize: fontSize } : {}}> */}
                                <div class="lyrics-list preLine playerDiv" style={emSpeed > 0 ? { animation: `scrollText ${emSpeed}s linear`, fontSize: fontSize } : { fontSize: fontSize, overflow: 'hidden', transform: `translateY(-${linesToSkip}px)`, transition: 'transform 0.5s, opacity 0.5s' }}>

                                    <div className={fullScreen ? "fullScreenIcon d-flex justify-content-end" : 'd-flex justify-content-end'}>
                                        <i className="fa-solid fa-expand" style={{ fontSize: 40, color: "#ffffff" }} onClick={() => setFullScreen(!fullScreen)}></i>
                                    </div>
                                    {songToPlay.map((line, index) => (
                                        // <li key={index} className={`lyrics-line${index === currentLine ? ' current-line' : (index < currentLine ? ' passed-line' : '')}`}>{line}</li>
                                        // <li key={index}    className={`lyrics-line ${
                                        //     index === currentLine
                                        //         ? 'current-line'
                                        //         : index < currentLine
                                        //         ? 'passed-line'
                                        //         : ''
                                        // }`}
                                        // style={{ opacity: index < currentLine ? 0.5 : fontColor, color: fontColor }}>{line}</li>
                                        <li key={index} className="lyrics-line"
                                            style={{
                                                color: selectedLines.find((lineObj) => lineObj.index === index) ? selectedLines.find((lineObj) => lineObj.index === index).color : line.match(/style="color: (.*?)"/)[1] || fontColor,
                                            }} onClick={selectLinesHandler.bind(null, index, line)}>{
                                                line.match(/style="color: (.*?)"/)
                                                    ? line.match(/<li style="color: (.*?)">(.*?)<\/li>/)[2]
                                                    : line
                                            }</li>
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