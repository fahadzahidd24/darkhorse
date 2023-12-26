import React from 'react'
import Navbar from '../../../layout/navbar'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import Loader from '../../../components/loader';
import ErrorModal from '../../../components/errorModal';
import axios from 'axios';
import { setSetlists } from '../../../store/slices/setlist-slice';

const AddSetlist = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        errorMessage: '',
        isError: false
    });

    const addSetListHandler = async (e) => {
        e.preventDefault();
        if (e.target.title.value === '') {
            setError({
                errorMessage: 'Please Give Setlist Name',
                isError: true
            });
        }
        else {
            const formData = {
                title: e.target.title.value,
            }
            setLoading(true);
            try {
                const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/playlist-create`, formData, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
                console.log(response.data);
                dispatch(setSetlists(response.data.data));
                navigate('/setlist')
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
                                <h1 class="text-center">ADD NEW SETLIST</h1>
                                {error.isError && <ErrorModal onPressOk={handlerOkPress} errorMessage={error.errorMessage} />}
                                <form onSubmit={addSetListHandler} class="lyrics-form">
                                    <div class="row">
                                        <div class="form-group column-12">
                                            <input type="text" name="title" id="title" class="form-control" placeholder="Add Setlist Name" />
                                        </div>
                                        <div class="column-12 d-flex justify-content-center">
                                            <button type="submit" class="btn">Add</button>
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