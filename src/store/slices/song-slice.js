import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    songs: [],
    songToPlay: []
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
        }
    },
});

export const { setSongs, setSongsArray, setSongToPlay } = songsSlice.actions;
export default songsSlice.reducer;
