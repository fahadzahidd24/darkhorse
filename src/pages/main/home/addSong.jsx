import React from 'react'
import Navbar from '../../../layout/navbar';
import { genreList } from '../../../constants/genre-list';
import { useState } from 'react';
import ErrorModal from '../../../components/errorModal';
import axios from 'axios'
import Loader from '../../../components/loader';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSongToEdit, setSongs, setSongsArray } from '../../../store/slices/song-slice';

const AddSong = () => {
    const navigate = useNavigate();
    let { songToEdit, songs } = useSelector((state) => state.songs)
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [iformData, setFormData] = useState({
        title: songToEdit ? songToEdit.title : '',
        artist: songToEdit ? songToEdit.artist : '',
        genre: songToEdit ? songToEdit.generous : 'Rock',
        album: songToEdit ? songToEdit.album : '',
        lyrics: songToEdit ? songToEdit.lyrics : ''
    });
    const [error, setError] = useState({
        errorMessage: '',
        isError: false
    });

    const changeHandler = (e) => {
        setFormData({
            ...iformData,
            [e.target.name]: e.target.value
        })
    }

    const addSongHandler = async (e) => {
        e.preventDefault();
        if (!iformData.title || !iformData.artist || !iformData.lyrics) {
            setError({
                errorMessage: 'Please fill all the required fields',
                isError: true
            });
        }
        else {
            const formData = {
                title: iformData.title,
                artist: iformData.artist,
                genre: iformData.genre || 'Rock',
                album: iformData.album,
                lyrics: iformData.lyrics
            }
            setLoading(true);
            try {
                if (songToEdit.id) {
                    formData.id = songToEdit.id;
                    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/song-update`, formData, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
                    songs = songs.map((song)=>{
                        return {
                            ...song,
                            title: song.id === songToEdit.id ? response.data.data.title : song.title,
                            artist: song.id === songToEdit.id ? response.data.data.artist : song.artist,
                            genre: song.id === songToEdit.id ? response.data.data.generous : song.genre,
                            album: song.id === songToEdit.id ? response.data.data.album : song.album,
                            lyrics: song.id === songToEdit.id ? response.data.data.lyrics : song.lyrics
                        }
                    })
                    dispatch(setSongsArray(songs))
                    // songs[songs.findIndex(song => song.id === songToEdit.id)] = response.data.data;
                    dispatch(setSongToEdit({}));
                    navigate('/library')
                } else {
                    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/song-create`, formData, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
                    dispatch(setSongs(response.data.data));
                    navigate('/library')
                }
            } catch (error) {
                setError({
                    errorMessage: error?.response?.data?.message || error.message,
                    isError: true
                });
                console.log(error?.response?.data?.message || error.message);
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
                                <h1 className="text-center">{songToEdit.id ? "EDIT SONG" : "ADD NEW SONG"}</h1>
                                {error.isError && <ErrorModal onPressOk={handlerOkPress} errorMessage={error.errorMessage} />}
                                <form className="lyrics-form" onSubmit={addSongHandler}>
                                    <div className="row">
                                        <div className="form-group column-12">
                                            <input type="text" id='title' name='title' onChange={changeHandler} className="form-control" placeholder="Song Title" value={iformData.title} />
                                        </div>
                                        <div className="form-group column-12 column-sm-7 column-lg-8">
                                            <input type="text" id='artist' name='artist' onChange={changeHandler} className="form-control" placeholder="Artist" value={iformData.artist} />
                                        </div>
                                        <div className="form-group column-12 column-sm-5 column-lg-4">
                                            <select className="form-select" name='genre' onChange={changeHandler} id='genre' value={iformData.genre}>
                                                <option disabled defaultValue='genre'>Genre</option>
                                                {genreList.genres.map((genre, index) => (
                                                    <option key={index}>{genre}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group column-12 column-sm-7 column-lg-8">
                                            <input type="text" id='album' name='album' onChange={changeHandler} className="form-control" placeholder="Album (optional)" value={iformData.album} />
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
                                            <textarea className="form-control" id='lyrics' name='lyrics' onChange={changeHandler} cols="30" rows="10" placeholder="ADD LYRICS" value={iformData.lyrics}></textarea>
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