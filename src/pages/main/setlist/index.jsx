import React from 'react'
import Navbar from '../../../layout/navbar'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react';
import { setSetlistsArray } from '../../../store/slices/setlist-slice';
import axios from 'axios';
import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../components/loader';
import ErrorModal from '../../../components/errorModal';

const Setlist = () => {
    const { setlists } = useSelector((state) => state.setlist);
    console.log(setlists);
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

    const handlerOkPress = () => {
        setError({
            errorMessage: '',
            isError: false
        });
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
                                    <h1>Setlists</h1>
                                    {error.isError && <ErrorModal onPressOk={handlerOkPress} errorMessage={error.errorMessage} />}
                                    <button type="button" class="add-btn" onClick={addSetListHandler}>
                                        <span class="txt">ADD NEW SETLIST</span>
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                                <div class="holder">
                                    <table class="list-table">
                                        {setlists?.map((setlist, index) => (
                                            <tr key={setlist.id} className='trRow'>
                                                <td>
                                                    <span class="num">{index + 1}</span>
                                                    <i class="fa-regular fa-circle-pause"></i>
                                                </td>
                                                <td>
                                                    <div class="title-box">
                                                        <div class="image"><img src="/list-icon.png" alt="image" /></div>
                                                        <strong class="title">{setlist.title}</strong>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="cat-title">Maria Carey</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </table>
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
        </>
    )
}

export default Setlist