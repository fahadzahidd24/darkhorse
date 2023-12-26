import React from 'react'
import Navbar from '../../../layout/navbar';
import { genreList } from '../../../constants/genre-list';
import { useState } from 'react';
import ErrorModal from '../../../components/errorModal';
import axios from 'axios'
import Loader from '../../../components/loader';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSongs } from '../../../store/slices/song-slice';

const AddSong = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        errorMessage: '',
        isError: false
    });

    const addSongHandler = async (e) => {
        e.preventDefault();
        if (e.target.title.value === '' || e.target.artist.value === '' || e.target.genre.value === '' || e.target.lyrics.value === '') {
            setError({
                errorMessage: 'Please fill all the required fields',
                isError: true
            });
        }
        else {
            const formData = {
                title: e.target.title.value,
                artist: e.target.artist.value,
                genre: e.target.genre.value || '',
                album: e.target.album.value,
                lyrics: e.target.lyrics.value
            }
            console.log(formData);
            setLoading(true);
            try {
                const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/song-create`, formData, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
                console.log(response.data);
                dispatch(setSongs(response.data.data));
                navigate('/library')
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
            <div className="main-template">
                <div id="wrapper">
                    <Navbar />
                    <main id="main">
                        <div className="container-fluid">
                            <div className="form-container">
                                <h1 className="text-center">ADD NEW SONG</h1>
                                {error.isError && <ErrorModal onPressOk={handlerOkPress} errorMessage={error.errorMessage} />}
                                <form className="lyrics-form" onSubmit={addSongHandler}>
                                    <div className="row">
                                        <div className="form-group column-12">
                                            <input type="text" id='title' name='title' className="form-control" placeholder="Song Title" />
                                        </div>
                                        <div className="form-group column-12 column-sm-7 column-lg-8">
                                            <input type="text" id='artist' name='artist' className="form-control" placeholder="Artist" />
                                        </div>
                                        <div className="form-group column-12 column-sm-5 column-lg-4">
                                            <select className="form-select" name='genre' id='genre'>
                                                <option disabled defaultValue='genre'>Genre</option>
                                                {genreList.genres.map((genre, index) => (
                                                    <option key={index}>{genre}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group column-12 column-sm-7 column-lg-8">
                                            <input type="text" id='album' name='album' className="form-control" placeholder="Album (optional)" />
                                        </div>
                                        {/* <div className="form-group column-12 column-sm-5 column-lg-4">
                                        <div className="options">
                                            <label for="keys" className="option">Keys
                                                <input id="keys" type="radio" checked="checked" name="radio" />
                                                <span className="checkmark"></span>
                                            </label>
                                            <label for="chords" className="option">Chords
                                                <input id="chords" type="radio" checked="checked" name="radio" />
                                                <span className="checkmark"></span>
                                                </label>
                                                </div>
                                            </div> */}
                                        <div className="form-group column-12">
                                            <textarea className="form-control" id='lyrics' name='lyrics' cols="30" rows="10" placeholder="ADD LYRICS"></textarea>
                                        </div>
                                        <div className="column-12 d-flex justify-content-center">
                                            <button type="submit" className="btn">Submit</button>
                                        </div>
                                    </div>
                                </form>

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

export default AddSong;