import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    setlists: []
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
        }
    },
});

export const { setSetlists, setSetlistsArray } = setlistSlice.actions;
export default setlistSlice.reducer;
