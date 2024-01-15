import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    songs: [],
    recentlyPlayedSongs: [],
    songToPlay: [],
    songToPlayId: '',
    songToEdit: {},
    settings: false,
    lastPage: '',
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
        setSongToPlayId: (state, action) => {
            state.songToPlayId = action.payload;
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
        },
        setLastPage: (state, action) => {
            state.lastPage = action.payload;
        },
    },
});

export const { setSongs, setSongsArray, setSongToPlay, setSongToPlayId, setSettings, setSongToEdit, setRecentlyPlayedSongs, setRecentlyPlayedSongsArray, setLastPage } = songsSlice.actions;
export default songsSlice.reducer;
