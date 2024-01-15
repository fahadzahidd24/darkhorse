import React from 'react'
import Navbar from '../../../layout/navbar'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import Loader from '../../../components/loader';
import ErrorModal from '../../../components/errorModal';
import axios from 'axios';
import { setSetlistToEdit, setSetlists, setSetlistsArray } from '../../../store/slices/setlist-slice';

const AddSetlist = () => {
    let { setListToEdit, setlists } = useSelector((state) => state.setlist)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        errorMessage: '',
        isError: false
    });
    const [iformData, setFormData] = useState({
        title: setListToEdit ? setListToEdit.title : '',
    });

    const changeHandler = (e) => {
        setFormData({
            ...iformData,
            [e.target.name]: e.target.value
        })
    }

    const addSetListHandler = async (e) => {
        e.preventDefault();
        if (!iformData.title) {
            setError({
                errorMessage: 'Please Give Setlist Name',
                isError: true
            });
        }
        else {
            const formData = {
                title: iformData.title,
            }
            setLoading(true);
            try {
                if (setListToEdit.id) {
                    formData.id = setListToEdit.id;
                    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/playlist-update`, formData, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
                    setlists = setlists.map((setlist) => {
                        return {
                            ...setlist,
                            title: setlist.id === setListToEdit.id ? response.data.data.title : setlist.title,
                        }
                    })
                    dispatch(setSetlistsArray(setlists))
                    // songs[songs.findIndex(song => song.id === songToEdit.id)] = response.data.data;
                    dispatch(setSetlistToEdit({}));
                    navigate('/setlist')
                } else {
                    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/playlist-create`, formData, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
                    dispatch(setSetlists(response.data.data));
                    navigate('/setlist')
                }
            } catch (error) {
                setError({
                    errorMessage: error?.response?.data?.message,
                    isError: true
                });
                console.log(error?.response?.data?.message);
            } finally {
                setLoading(false);
            }
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
            <div class="main-template">
                <div id="wrapper">
                    <Navbar />
                    <main id="main">
                        <div class="container-fluid">
                            <div class="form-container">
                                <h1 class="text-center">{setListToEdit.id ? "EDIT SETLIST" : "ADD NEW SETLIST"}</h1>
                                {error.isError && <ErrorModal onPressOk={handlerOkPress} errorMessage={error.errorMessage} />}
                                <form onSubmit={addSetListHandler} class="lyrics-form">
                                    <div class="row">
                                        <div class="form-group column-12">
                                            <input type="text" name="title" id="title" onChange={changeHandler} class="form-control" placeholder="Add Setlist Name" value={iformData.title} />
                                        </div>
                                        <div class="column-12 d-flex justify-content-center">
                                            <button type="submit" class="btn">{setListToEdit.id ? "Update" : "ADD"}</button>
                                        </div>
                                    </div>
                                </form>

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

export default AddSetlist