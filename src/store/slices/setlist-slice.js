import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    setlists: [],
    setListToGet: {},
    setListSongs: [],
    setListToEdit: {},
}

const setlistSlice = createSlice({
    name: 'setlist',
    initialState,
    reducers: {
        setSetlists: (state, action) => {
            state.setlists.push(action.payload);
        },
        setSetlistsArray: (state, action) => {
            state.setlists = action.payload;
        },
        setSetlistToGet: (state, action) => {
            state.setListToGet = action.payload;
        },
        setSetListSongs: (state, action) => {
            state.setListSongs = action.payload;
        },
        setSetlistToEdit: (state, action) => {
            state.setListToEdit = action.payload;
        },
    },
});

export const { setSetlists, setSetlistsArray, setSetlistToGet, setSetListSongs, setSetlistToEdit } = setlistSlice.actions;
export default setlistSlice.reducer;
