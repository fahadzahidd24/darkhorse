import React from 'react'
import Navbar from '../../../layout/navbar'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react';
import { setSetListSongToPlayId, setSetListSongs, setSetlistsArray } from '../../../store/slices/setlist-slice';
import axios from 'axios';
import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../components/loader';
import ErrorModal from '../../../components/errorModal';
import { setSongToEdit, setSongToPlay } from '../../../store/slices/song-slice';
import { Reorder, useDragControls, useMotionValue } from "framer-motion"
import { Item } from '../../../components/Item';
import { ReorderIcon } from '../../../components/Icon';
const SetlistSongs = () => {
    const controls = useDragControls();
    const y = useMotionValue(0);
    const dragControls = useDragControls();
    const { setListToGet, setListSongs } = useSelector((state) => state.setlist);
    const [items, setItems] = useState([]);
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

    const deleteSongHandler = async (song) => {
        setLoading(true);
        try {
            await axios.get(`${process.env.REACT_APP_BASE_URL}/playlists/${setListToGet.id}/songs/${song.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setItems(items.filter(item => item.id !== song.id));
            dispatch(setSetListSongs(setListSongs.filter(item => item.id !== song.id)));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
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
                setItems(response.data.data.data);
            } catch (error) {
                if (error?.response?.data?.message !== 'Error! Data not found') {
                    setError({
                        errorMessage: error?.response?.data?.message,
                        isError: true
                    });
                } else {
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

    const playSongHandler = async (song) => {
        setLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/recently-played`, { song_id: song.id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
        const songLyrics = song.lyrics.split('\n');
        dispatch(setSongToPlay(songLyrics))
        dispatch(setSetListSongToPlayId(song.id))
        navigate('/setlist-player')
    }

    const reorderHandler = async() => {
        const itemsIds = items.map((item, index) => {
            return item.id;
        });
        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/reorder-playlist-songs`, { new_order: itemsIds, playlistId: setListToGet.id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(setSetListSongs(items));
        } catch (error) {
            console.log(error);
        }
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

                                </div>
                                <div class="holder libraryListScroll">
                                    <table className="list-table">
                                        <Reorder.Group axis="y" onReorder={setItems} values={items}>
                                            {/* {console.log("ssss",setListSongs)} */}
                                            {/* {items.map((item, index) => (
                                                <Item key={index} item={item} />
                                            ))} */}

                                            {/* {setListSongs?.map((song, index) => { */}
                                            {items?.map((song, index) => (
                                                <Reorder.Item
                                                    key={song.id}
                                                    value={song}
                                                    id={song.id}
                                                    // style={{ width: '100%' }}
                                                    dragListener={true}
                                                    dragControls={dragControls}
                                                    onDragEnd={reorderHandler}
                                                >
                                                    <tr className='trRow d-flex w-full justify-content-between align-items-center'>
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
                                                                <li className='linesParent' onClick={() => optionsHandler(song)}>
                                                                    {/* <i className="fa-solid fa-grip-lines"></i> */}
                                                                    <ReorderIcon dragControls={dragControls} />
                                                                    {(selectedSong && selectedSong.id === song.id) && <div className='dropdown'>
                                                                        <ul className='ulDropdown'>
                                                                            <li onClick={editSongHandler.bind(null, song)}>Edit</li>
                                                                            <li onClick={deleteSongHandler.bind(null, song)}>Delete</li>
                                                                        </ul>
                                                                    </div>}
                                                                </li>
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                </Reorder.Item>
                                            ))
                                            }
                                        </Reorder.Group>
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