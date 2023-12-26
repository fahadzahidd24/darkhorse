import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/auth-slice'
import songsReducer from '../slices/song-slice'
import setlistSlice from '../slices/setlist-slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    songs: songsReducer,
    setlist: setlistSlice
  },
});

export default store;
