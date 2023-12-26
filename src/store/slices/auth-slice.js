import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    isAuth: false,
    token: '',
    user: {},
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setAuth: (state, action) => {
            state.isAuth = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
});

export const { setAuth, setUser, setToken } = authSlice.actions;
export default authSlice.reducer;
