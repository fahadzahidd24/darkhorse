import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    songs: [],
    songToPlay: [],
    songToEdit: {},
    settings: false,
}

const songsSlice = createSlice({
    name: 'songs',
    initialState,
    reducers: {
        setSongs: (state, action) => {
            state.songs.push(action.payload);
        },
        setSongsArray: (state, action) => {
            state.songs = action.payload;
        },
        setSongToPlay: (state, action) => {
            state.songToPlay = action.payload;
        },
        setSettings: (state, action) => {
            state.settings = action.payload;
        },
        setSongToEdit: (state, action) => {
            state.songToEdit = action.payload;
        },
    },
});

export const { setSongs, setSongsArray, setSongToPlay, setSettings, setSongToEdit } = songsSlice.actions;
export default songsSlice.reducer;
