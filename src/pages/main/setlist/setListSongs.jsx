import React from 'react'
import Navbar from '../../../layout/navbar'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react';
import { setSetListSongs, setSetlistsArray } from '../../../store/slices/setlist-slice';
import axios from 'axios';
import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../components/loader';
import ErrorModal from '../../../components/errorModal';
import { setSongToEdit, setSongToPlay } from '../../../store/slices/song-slice';

const SetlistSongs = () => {
    const { setListToGet, setListSongs } = useSelector((state) => state.setlist);
    const [selectedSong, setSelectedSong] = useState();
    const [noRecord, setNoRecord] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        errorMessage: '',
        isError: false
    });

    const addSetListHandler = () => {
        navigate('/add-setlist')
    }

    const optionsHandler = (song) => {
        if (selectedSong && selectedSong.id === song.id) {
            setSelectedSong(null);
            return;
        } else {
            setSelectedSong(song);
        }
    }

    const editSongHandler = (song) => {
        dispatch(setSongToEdit(song));
        navigate('/add-song');
    }

    useLayoutEffect(() => {
        const fetchSongs = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/playlists/${setListToGet.id}/songs`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                dispatch(setSetListSongs(response.data.data.data));
            } catch (error) {
                if (error?.response?.data?.message !== 'Error! Data not found') {
                    setError({
                        errorMessage: error?.response?.data?.message,
                        isError: true
                    });
                }else{
                    setNoRecord(true);
                }
                console.log(error?.response?.data?.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, [])

    const handlerOkPress = () => {
        setError({
            errorMessage: '',
            isError: false
        });
    }

    const playSongHandler = (song) => {
        const songLyrics = song.lyrics.split('\n');
        dispatch(setSongToPlay(songLyrics))
        navigate('/player')
    }

    return (
        <>
            {loading && <Loader />}
            <div class="main-template">
                <div id="wrapper">
                    <Navbar />
                    <main id="main">
                        <div class="container-fluid">
                            <div class="list-container">
                                <div class="container-head">
                                    <h1>{setListToGet.title}</h1>
                                    {error.isError && <ErrorModal onPressOk={handlerOkPress} errorMessage={error.errorMessage} />}
                                    {/* <button type="button" class="add-btn" onClick={addSetListHandler}>
                                        <span class="txt">ADD NEW SETLIST</span>
                                        <i class="fa-solid fa-plus"></i>
                                    </button> */}
                                </div>
                                <div class="holder">
                                    {/* <table class="list-table">
                                        {setListSongs?.map((song, index) => (
                                            <tr key={song.id} className='trRow'>
                                                <td>
                                                    <span class="num">{index + 1}</span>
                                                    <i class="fa-regular fa-circle-pause"></i>
                                                </td>
                                                <td>
                                                    <div class="title-box">
                                                        <div class="image"><img src="/list-icon.png" alt="image" /></div>
                                                        <strong class="title">{song.title}</strong>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </table> */}
                                    <table className="list-table">
                                        {setListSongs?.map((song, index) => (
                                            <tr key={song.id} className='trRow' >
                                                {/* // <tr key={song.id} className='trRow'> */}
                                                <td onClick={() => playSongHandler(song)}>
                                                    <span className="num">{index + 1}</span>
                                                    <i className="fa-regular fa-circle-pause"></i>
                                                </td>
                                                <td onClick={() => playSongHandler(song)}>
                                                    <div className="title-box">
                                                        <div className="image"><img src="/list-icon.png" alt="image" /></div>
                                                        <strong className="title">{song.title}</strong>
                                                    </div>
                                                </td>
                                                <td onClick={() => playSongHandler(song)}>
                                                    <span className="cat-title">{song.artist}</span>
                                                </td>
                                                <td align="right">
                                                    <ul className="list">
                                                        {/* <li>3:54</li> */}
                                                        <li className='linesParent' onClick={() => optionsHandler(song)}>
                                                            <i className="fa-solid fa-grip-lines"></i>
                                                            {(selectedSong && selectedSong.id === song.id) && <div className='dropdown'>
                                                                <ul className='ulDropdown'>
                                                                    <li onClick={editSongHandler.bind(null, song)}>Edit</li>
                                                                    <li>Delete</li>
                                                                </ul>
                                                            </div>}
                                                        </li>
                                                    </ul>
                                                </td>
                                            </tr>
                                        ))}
                                    </table>
                                </div>
                                {(setListSongs?.length === 0 && noRecord) && <div className="holder no-record">
                                    <strong className="not-found">No Record Found</strong>
                                </div>}
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
        </>
    )
}

export default SetlistSongs