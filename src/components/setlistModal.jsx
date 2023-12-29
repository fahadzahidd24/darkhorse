import React from 'react'
import style from './popup.module.css'
import { useEffect } from 'react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutEffect } from 'react';
import { setSetlistsArray } from '../store/slices/setlist-slice';
import Loader from './loader';
import axios from 'axios';
import ErrorModal from './errorModal';
import { useState } from 'react';

const SetlistModal = ({ onClose, song }) => {
    const setListModalRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const { setlists } = useSelector((state) => state.setlist);

    const dispatch = useDispatch();
    const [error, setError] = useState({
        errorMessage: '',
        isError: false
    });

    const handleClickOutside = (event) => {
        if (setListModalRef.current && !setListModalRef.current.contains(event.target)) {
            // Clicked outside the color picker, so close it
            onClose();
        }
    };


    useEffect(() => {
        // Attach the event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);

        // Detach the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setListModalRef]);


    useLayoutEffect(() => {
        if (setlists?.length === 0) {
            const fetchSongs = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/playlists`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    dispatch(setSetlistsArray(response.data.data));
                } catch (error) {
                    setError({
                        errorMessage: error?.response?.data?.message,
                        isError: true
                    });
                    console.log(error?.response?.data?.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchSongs();
        }
    }, [])

    const addSongToSetlist = async (setlist) => {
        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_BASE_URL}/playlists/songs/create`, { playlist_id: setlist.id, song_id: song.id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            onClose();
        } catch (error) {
            setError({
                errorMessage: error?.response?.data?.message || error.message,
                isError: true
            });
            console.log(error?.response?.data?.message || error.message);
        } finally {
            setLoading(false);
            // onClose();
        }
    }

    const handlerOkPress = () => {
        setError({
            errorMessage: '',
            isError: false
        });
    }


    return (
        <>
            {loading && <Loader />}
            {error.isError && <ErrorModal onPressOk={handlerOkPress} errorMessage={error.errorMessage} />}
            <div className={style.popup2}>
                <div ref={setListModalRef} className={style.popup_inner2}>
                    <p className={style.message2}>Add To Setlist</p>
                    {setlists.length > 0 && <p className={style.message2} style={{ fontSize: '2rem', textDecoration: 'none', color: "grey" }}>Choose Setlist</p>}
                    {setlists.length> 0 ? <ol className={style.setList_list}>
                        {setlists.map((setlist, index) => {
                            return (
                                <div className={style.setListTitleHover}>
                                    <li onClick={addSongToSetlist.bind(null, setlist)} className={style.setListTitle} key={setlist.id}>{setlist.title}</li>
                                    <hr style={{ width: "100%" }} />
                                </div>
                            )
                        })}
                    </ol>: <p className={style.message2} style={{ fontSize: '2rem', textDecoration: 'none', color: "grey" }}>No Setlist Found</p>}
                    <button className='btn'>Ok</button>
                </div>
            </div>
        </>
    )
}

export default SetlistModal