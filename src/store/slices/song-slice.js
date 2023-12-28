import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    songs: [],
    recentlyPlayedSongs: [],
    songToPlay: [],
    songToEdit: {},
    settings: false,
}

const songsSlice = createSlice({
    name: 'songs',
    initialState,
    reducers: {
        setSongs: (state, action) => {
            state.songs.unshift(action.payload);
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
        setRecentlyPlayedSongs: (state, action) => {
            state.recentlyPlayedSongs.push(action.payload);
        },
        setRecentlyPlayedSongsArray: (state, action) => {
            state.recentlyPlayedSongs = action.payload;
        }
    },
});

export const { setSongs, setSongsArray, setSongToPlay, setSettings, setSongToEdit, setRecentlyPlayedSongs, setRecentlyPlayedSongsArray } = songsSlice.actions;
export default songsSlice.reducer;
