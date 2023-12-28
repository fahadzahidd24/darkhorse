import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSongs } from '../store/slices/song-slice';

const EditSong = ({ title = '', artist = '', album = '', generous = '', id }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        title: title,
        artist: artist,
        album: album,
        generous: generous,
        id: id
    })

    const changeHandler = (name, e) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: e.target.value
        }));
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/song-update`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            // dispatch(setSongs(response.data.data));
            // navigate('/library');
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

    return (
        <form onSubmit={submitHandler}>
            <label>Title</label>
            <input type="text" name="title" id="Title" value={formData.title} onChange={changeHandler.bind(null, "title")} />
            <label>Artist</label>
            <input type="text" name="artist" id="Artist" value={formData.artist} onChange={changeHandler.bind(null, "artist")} />
            <label>Album</label>
            <input type="text" name="album" id="Album" value={formData.album} onChange={changeHandler.bind(null, "album")} />
            <label>Genre</label>
            <input type="text" name="generous" id="Genre" value={formData.generous} onChange={changeHandler.bind(null, "generous")} />
            <button type='submit'>Update Song</button>
        </form>
    )
}

export default EditSong