import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import './App.css';
import Login from './pages/auth/login';
import Intro from './pages/intro/Intro';
import Welcome from './pages/intro/welcome';
import { useDispatch } from 'react-redux';
import store from './store/store/store';
import { useEffect } from 'react';
import { setAuth, setToken, setUser } from './store/slices/auth-slice';
import ProtectedRoute from './guard/protected-route';
import Home from './pages/main/home';
import UnprotectedRoute from './guard/unproctedRoute';
import Library from './pages/main/library';
import AddSong from './pages/main/home/addSong';
import Setlist from './pages/main/setlist';
import AddSetlist from './pages/main/setlist/addSetlist';
import Player from './pages/main/player';
import SetlistSongs from './pages/main/setlist/setListSongs';
import SetlistPlayer from './pages/main/player/playlistSongPlayer';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      dispatch(setToken(token));
      dispatch(setAuth(true));
      dispatch(setUser(JSON.parse(user)));
    }
  }, [dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UnprotectedRoute />}>
          <Route path="/intro" exact element={<Intro />} />
          <Route path="/welcome" exact element={<Welcome />} />
          <Route path="/Login" exact element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" exact element={<Home />} />
          <Route path="/library" exact element={<Library />} />
          <Route path="/add-song" exact element={<AddSong />} />
          <Route path="/setlist" exact element={<Setlist />} />
          <Route path="/setlistSongs" exact element={<SetlistSongs />} />
          <Route path="/add-setlist" exact element={<AddSetlist />} />
          <Route path="/player" exact element={<Player />} />
          <Route path="/setlist-player" exact element={<SetlistPlayer />} />
        </Route>
      </Routes>
    </BrowserRouter >
  );
}

export default App;
