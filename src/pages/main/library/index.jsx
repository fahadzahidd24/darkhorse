import React, { useEffect, useState } from 'react'
import Navbar from '../../../layout/navbar'
import axios from 'axios';
import EditSong from '../../../components/EditSong';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutEffect } from 'react';
import ErrorModal from '../../../components/errorModal';
import Loader from '../../../components/loader';
import { setRecentlyPlayedSongs, setSongToEdit, setSongToPlay, setSongs, setSongsArray } from '../../../store/slices/song-slice';
import { useNavigate } from 'react-router-dom';
import ConfirmationModel from '../../../components/confirmationModel';
import SetlistModal from '../../../components/setlistModal';
import SongComponents from '../../../components/SongComponents';

const Library = () => {
  const { songs, lastPage:lastPg } = useSelector((state) => state.songs);
  console.log(lastPg);
  const [lastPage, setLastPage] = useState(lastPg);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [globalSong, setGlobalSong] = useState([])
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [selectedSong, setSelectedSong] = useState();
  const [songToDelete, setSongToDelete] = useState();
  const [songToSetlist, setSongToSetlist] = useState();
  const [error, setError] = useState({
    errorMessage: '',
    isError: false
  });

  const [Increment, setIncrement] = useState(1);

  var filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().startsWith(searchTerm.toLowerCase())
  );
  useLayoutEffect(() => {
    if (songs.length === 0) {
      const fetchSongs = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/songs?page=1`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
          setLastPage(response.data.data.last_page)
          dispatch(setSongsArray(response.data.data.data));
        } catch (error) {
          setError({
            errorMessage: error?.response?.data?.message,
            isError: true
          });
          console.log(error?.response?.data?.message);
        } finally {
          setLoading(false);
        }
      };

      fetchSongs();
    }
  }, [dispatch, songs.length])

  useEffect(() => {
    const SearchSongs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/songs/${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        console.log(response.data)
        setLastPage(response.data.data.last_page)
        setIncrement(1)
        setGlobalSong(response.data.data.data)
        setLoading(false);

      } catch (error) {
        console.log(error.message)
      } finally {
        setLoading(false);
      }
    };

    // debouncing 
    const debouncing = setTimeout(() => {
      if (searchTerm !== '') {
        SearchSongs();
      }
    }, 300)
    return () => clearTimeout(debouncing);
  }, [searchTerm, Increment]);

  const fetchSongs = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/songs?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const newSongs = response.data.data.data.filter((song) => !songs.some((s) => s.id === song.id)); // Filter out duplicates
      newSongs.forEach((song) => {
        dispatch(setSongs(song))
      })
    } catch (error) {
      setError({
        errorMessage: error?.response?.data?.message,
        isError: true
      });
    } finally {
      setLoading(false);
    }
  }

  const handleNextClick = () => {
    if (Increment === lastPage) return;
    const nextPage = Increment + 1;
    setIncrement(nextPage);
    fetchSongs(nextPage);
  };

  const handlePrevClick = () => {
    console.log("prev", songs)
    const nextPage = Increment - 1;
    setIncrement(nextPage);
  };

  const handlerOkPress = () => {
    setError({
      errorMessage: '',
      isError: false
    });
  }

  const playSongHandler = async (song) => {
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/recently-played`, { song_id: song.id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      // dispatch(setRecentlyPlayedSongs(song));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    const songLyrics = song.lyrics.split('\n');
    dispatch(setSongToPlay(songLyrics))
    navigate('/player')
  }

  const optionsHandler = (song) => {
    if (selectedSong && selectedSong.id === song.id) {
      setSelectedSong(null);
      return;
    } else {
      setSelectedSong(song);
    }
  }

  const pressYesHandler = async () => {
    try {
      setConfirm(false);
      setLoading(true);
      await axios.get(`${process.env.REACT_APP_BASE_URL}/song-delete/${songToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      dispatch(setSongsArray(songs.filter((song) => song.id != songToDelete.id)));
    } catch (error) {
      setError({
        errorMessage: error?.response?.data?.message || error.message,
        isError: true
      });
      console.log(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  const pressNoHandler = () => {
    setConfirm(false);
  }

  const deleteSongHandler = (song) => {
    setSongToDelete(song);
    setConfirm(true);
  }

  const editSongHandler = (song) => {
    dispatch(setSongToEdit(song));
    navigate('/add-song');
  }

  const addToSetlistHandler = (song) => {
    setSongToSetlist(song);
  }

  const closeSetlistModalHandler = () => {
    setSongToSetlist(null);
  }

  console.log({ Increment });
  console.log({ lastPage });
  return (
    <>
      {loading && <Loader />}
      {songToSetlist && <SetlistModal song={songToSetlist} onClose={closeSetlistModalHandler} />}
      {confirm && <ConfirmationModel onPressYes={pressYesHandler} onPressNo={pressNoHandler} />}
      <div className="main-template">
        <div id="wrapper">
          <Navbar />
          <main id="main">
            <div className="container-fluid">
              <div className="list-container">
                <div className="container-head">
                  <h1>Library</h1>
                  {error.isError && <ErrorModal onPressOk={handlerOkPress} errorMessage={error.errorMessage} />}
                  <form className="track-search">
                    <div className="form-group">
                      <i className="fa-solid fa-magnifying-glass"></i>
                      <input
                        type="search"
                        className="form-field"
                        placeholder="Search songs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
                <div className="holder">
                  <table className="list-table">

                    {/* yeh mera */}
                    {/* {songs?.map((song, index) => (
                      <tr key={song.id} className='trRow' >
                        <td onClick={() => playSongHandler(song)}>
                          <span className="num">{index + 1}</span>
                          <i className="fa-regular fa-circle-pause"></i>
                        </td>
                        <td onClick={() => playSongHandler(song)}>
                          <div className="title-box">
                            <div className="image"><img src="/list-icon.png" alt="image" /></div>
                            <strong className="title">{song.title}</strong>
                          </div>
                        </td>
                        <td onClick={() => playSongHandler(song)}>
                          <span className="cat-title">{song.artist}</span>
                        </td>
                        <td align="right">
                          <ul className="list">
                            <li className='linesParent' onClick={() => optionsHandler(song)}>
                              <i className="fa-solid fa-grip-lines"></i>
                              {(selectedSong && selectedSong.id === song.id) && <div className='dropdown'>
                                <ul className='ulDropdown'>
                                  <li onClick={editSongHandler.bind(null, song)}>Edit</li>
                                  <li onClick={deleteSongHandler.bind(null, song)}>Delete</li>
                                  <li onClick={addToSetlistHandler.bind(null, song)}>Add to Setlist</li>
                                </ul>
                              </div>}
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))} */}
                    {/* yeh mera */}

                    {
                      filteredSongs.length > 0 ? (
                        filteredSongs
                          .slice((Increment - 1) * 10, Increment * 10)
                          .map((song, index) => (
                            <SongComponents
                              song={song}
                              index={index}
                              key={song.id}
                              playSongHandler={playSongHandler}
                              optionsHandler={optionsHandler}
                              editSongHandler={editSongHandler}
                              deleteSongHandler={deleteSongHandler}
                              selectedSong={selectedSong}
                              addToSetlistHandler={addToSetlistHandler}
                            />
                          ))
                      ) : globalSong.length > 0 ? (
                        globalSong
                          .slice((Increment - 1) * 10, Increment * 10)
                          .map((globalSong, index) => (
                            <SongComponents
                              song={globalSong}
                              index={index}
                              key={globalSong.id}
                              playSongHandler={playSongHandler}
                              optionsHandler={optionsHandler}
                              editSongHandler={editSongHandler}
                              deleteSongHandler={deleteSongHandler}
                              selectedSong={selectedSong}
                              addToSetlistHandler={addToSetlistHandler}
                            />
                          ))
                      ) : <div className="holder no-record">
                        <strong className="not-found">No Record Found</strong>
                      </div>
                    }



                    {/* <tr className="pause">
                    <td>
                    <span className="num">2</span>
                    <i className="fa-regular fa-circle-pause"></i>
                    </td>
                    <td>
                      <div className="title-box">
                        <div className="image"><img src="/img1.jpg" alt="image" /></div>
                        <strong className="title">All I Want For Christmas Is You</strong>
                      </div>
                    </td>
                    <td>
                      <span className="cat-title">Maria Carey</span>
                    </td>
                    <td align="right">
                      <ul className="list">
                        <li>3:54</li>
                        <li>
                          <a href="#" className="fav">
                            <i className="fa-regular fa-heart"></i>
                            <i className="fa-solid fa-heart"></i>
                            </a>
                        </li>
                        <li><i className="fa-solid fa-grip-lines"></i></li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="num">3</span>
                      <i className="fa-regular fa-circle-pause"></i>
                    </td>
                    <td>
                      <div className="title-box">
                        <div className="image"><img src="/img1.jpg" alt="image" /></div>
                        <strong className="title">All I Want For Christmas Is You</strong>
                      </div>
                    </td>
                    <td>
                      <span className="cat-title">Maria Carey</span>
                    </td>
                    <td align="right">
                      <ul className="list">
                        <li>3:54</li>
                        <li>
                          <a href="#" className="fav">
                            <i className="fa-regular fa-heart"></i>
                            <i className="fa-solid fa-heart"></i>
                            </a>
                            </li>
                            <li><i className="fa-solid fa-grip-lines"></i></li>
                            </ul>
                            </td>
                          </tr> */}
                  </table>
                  {songs.length > 0 && <div className="pagination">
                    {Increment !== 1 && <button onClick={() => handlePrevClick()} className='btnConfirm2'>
                      Prev
                    </button>}
                    {Increment !== lastPage && <button onClick={() => handleNextClick()} className='btnConfirm2'>
                      Next
                    </button>}
                  </div>}
                </div>
              </div>
            </div>
          </main>

          <div className="corner left"><img src="/top-strip.png" alt="strip" /></div>
          <div className="corner right"><img src="/bottom-strip.png" alt="strip" /></div>
          <div className="bar left">
            <img src="/logo.svg" alt="logo" className="side-logo" />
          </div>
          <div className="bar right">
            <img src="/logo.svg" alt="logo" className="side-logo" />
          </div>
        </div>

      </div>
    </>
  )
}

export default Library