import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { setAuth, setToken } from '../../../store/slices/auth-slice';
import axios from 'axios';
import Navbar from '../../../layout/navbar';
import { setLastPage, setRecentlyPlayedSongsArray, setSongToEdit, setSongToPlay, setSongToPlayId, setSongsArray } from '../../../store/slices/song-slice';
import Loader from '../../../components/loader';
import { useLayoutEffect } from 'react';

const Home = () => {
    const { recentlyPlayedSongs } = useSelector(state => state.songs)
    const [loading, setLoading] = useState(false);
    const [noRecord, setnoRecord] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    

    useLayoutEffect(() => {
        const fetchRecentlyPlayedSongs = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/recently-played`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                dispatch(setRecentlyPlayedSongsArray(response.data.data));
            } catch (error) {
                if(error?.response?.data?.message == "Error! Data not found"){
                    setnoRecord(true);
                }
                console.log(error);
            } finally {
                setLoading(false);
                dispatch(setSongToEdit({}));
            }
        }
        const fetchLibrarySongs = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/songs`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                dispatch(setSongsArray(response.data.data.data));
                dispatch(setLastPage(response.data.data.last_page));
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
                dispatch(setSongToEdit({}));
            }
        }
        fetchLibrarySongs();
        fetchRecentlyPlayedSongs();
    }, [])

    const playSongHandler = (song) => {
        const songLyrics = song.lyrics.split('\n');
        dispatch(setSongToPlay(songLyrics))
        dispatch(setSongToPlayId(song.id))
        navigate('/player')
    }


    const clearHandler = async () => {
        setLoading(true);
        try {
            await axios.get(`${process.env.REACT_APP_BASE_URL}/recently-played/clear`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(setRecentlyPlayedSongsArray([]));
            setnoRecord(true);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {loading && <Loader />}
            <div className="main-template">
                <div id="wrapper">
                    <Navbar />
                    <main id="main">
                        <div className="container-fluid">
                            <div className="list-container">
                                <div className="container-head">
                                    <h1>Recently Played</h1>
                                    {/* <button type="button" className="add-btn" onClick={addSongHandler}>
                                        <span className="txt">ADD NEW SONG</span>
                                        <i className="fa-solid fa-plus"></i>
                                    </button> */}
                                {recentlyPlayedSongs.length> 0 && <div className="clearAll d-flex justify-content-end mt-3">
                                    <button className='btnConfirm text-sm' onClick={clearHandler}>Clear All</button>
                                </div>}
                                </div>
                                <table className="list-table">
                                    {recentlyPlayedSongs?.map((song, index) => (
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
                                        </tr>
                                    ))}
                                </table>
                                {(recentlyPlayedSongs.length == 0 && noRecord) && <div className="holder no-record">
                                    <strong className="not-found">No Record Found</strong>
                                </div>}
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
        </>
    )
}

export default Home