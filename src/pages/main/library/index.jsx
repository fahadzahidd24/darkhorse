import React, { useEffect, useState } from 'react'
import Navbar from '../../../layout/navbar'
import axios from 'axios';
import EditSong from '../../../components/EditSong';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutEffect } from 'react';
import ErrorModal from '../../../components/errorModal';
import Loader from '../../../components/loader';
import { setRecentlyPlayedSongs, setSongToEdit, setSongToPlay, setSongToPlayId, setSongs, setSongsArray } from '../../../store/slices/song-slice';
import { useNavigate } from 'react-router-dom';
import ConfirmationModel from '../../../components/confirmationModel';
import SetlistModal from '../../../components/setlistModal';
import SongComponents from '../../../components/SongComponents';
import { Reorder, useDragControls, useMotionValue } from 'framer-motion';
import { ReorderIcon } from '../../../components/Icon';

const Library = () => {
  const controls = useDragControls();
  const y = useMotionValue(0);
  const dragControls = useDragControls();
  const { songs, lastPage: lastPg } = useSelector((state) => state.songs);
  const [lastPage, setLastPage] = useState(lastPg);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [globalSong, setGlobalSong] = useState([])
  const [loading, setLoading] = useState(false);
  const [globalSearch, setGlobalSearch] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [selectedSong, setSelectedSong] = useState();
  const [songToDelete, setSongToDelete] = useState();
  const [songToSetlist, setSongToSetlist] = useState();
  const [globalSongsArray, setGlobalSongsArray] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [error, setError] = useState({
    errorMessage: '',
    isError: false
  });

  const [Increment, setIncrement] = useState(1);

  useEffect(() => {
    setFilteredSongs(songs.filter((song) =>
      song.title.toLowerCase().startsWith(searchTerm.toLowerCase())
    ))
  }, [searchTerm, songs])

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

  console.log(globalSongsArray)

  useEffect(() => {
    const SearchGlobalSongs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/genius-search?term=${globalSearchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        console.log("sss", response.data.data);
        setGlobalSongsArray(response.data.data)
      } catch (error) {
        console.log(error.message)
      } finally {
        setLoading(false);
      }
    };

    // debouncing 
    const debouncing = setTimeout(() => {
      if (globalSearchTerm !== '') {
        SearchGlobalSongs();
      }
    }, 1000)
    return () => clearTimeout(debouncing);
  }, [globalSearchTerm]);

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


  const handlerOkPress = () => {
    setError({
      errorMessage: '',
      isError: false
    });
  }

  const playSongHandler = async (song) => {
    setLoading(true);
    if (song.id)
      try {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/recently-played`, { song_id: song.id }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        // dispatch(setRecentlyPlayedSongs(song));
        const songLyrics = song.lyrics.split('\n');
        dispatch(setSongToPlay(songLyrics))
        dispatch(setSongToPlayId(song.id))
        navigate('/player')
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    else if (song.song_id) {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/genius-song${song.slug}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(response.data.data);
      dispatch(setSongToPlay(response.data.data));
      dispatch(setSongToPlayId(song.song_id))
      setLoading(false);
      navigate('/player')
    }
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

  const addSongHandler = () => {
    navigate('/add-song')
  }

  const globalSearchHandler = () => {
    if (globalSearch) {
      setGlobalSearch(false);
      setSearchTerm('');
    } else {
      setGlobalSearch(true);
    }
  }

  const handleScroll = () => {
    const container = document.querySelector('.libraryListScroll');
    const scrolledToBottom =
      container.scrollHeight - container.scrollTop === container.clientHeight;

    if (scrolledToBottom && Increment < lastPage) {
      // Fetch more data when scrolled to the bottom and there is more data to load
      const nextPage = Increment + 1;
      setIncrement(nextPage);
      fetchSongs(nextPage);
    }
  };

  useEffect(() => {
    // Attach scroll event listener to the list container
    const container = document.querySelector('.libraryListScroll');
    console.log("yo");
    container.addEventListener('scroll', handleScroll);

    // Cleanup event listener
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [Increment, lastPage]);

  const addGlobalSongToLibrary = async (song) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/genius-song${song.slug}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const joinedText = response.data.data.join('\n');
      const formData = {
        title: song.title,
        artist: song.artist,
        genre: 'rock',
        lyrics: joinedText
      }
      console.log(formData);
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/song-create`, formData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      dispatch(setSongs(res.data.data));
      setGlobalSearch(false);
      setSearchTerm('');
    } catch (error) {
      setError({
        errorMessage: error?.response?.data?.message || error.message,
        isError: true
      });
      console.log(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  const reorderHandler = async() => {
    const itemsIds = filteredSongs.map((item, index) => {
        return item.id;
    });
    console.log({itemsIds});
    try {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/reorder-songs`, { new_order: itemsIds }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        dispatch(setSongsArray(filteredSongs));
    } catch (error) {
        console.log(error);
    }
}

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
                  <h1>{globalSearch ? "Search Songs" : "Library"}</h1>
                  {error.isError && <ErrorModal onPressOk={handlerOkPress} errorMessage={error.errorMessage} />}
                  {!globalSearch && <form onSubmit={(e) => e.preventDefault()} className="track-search">
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
                  </form>}
                  <div className='d-flex'>
                    {globalSearch && <form className="track-search" onSubmit={(e) => e.preventDefault()} style={{ marginRight: 10 }}>
                      <div className="form-group">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                          style={{ maxWidth: 340, width: 250 }}
                          type="search"
                          className="form-field"
                          placeholder="Search songs globally..."
                          value={globalSearchTerm}
                          onChange={(e) => setGlobalSearchTerm(e.target.value)}
                        />
                      </div>
                    </form>}
                    <button type="button" className="add-btn" onClick={globalSearchHandler} style={{ marginRight: 4 }}>
                      {/* <span className="txt">ADD NEW SONG</span> */}
                      {!globalSearch ? <img style={{ width: 50, height: 50, borderRadius: "50%" }} src="/genius-icon.png" alt="Genius Api Icon" /> :
                        <i className="fa-solid fa-remove mgRemove"></i>}
                    </button>
                    <button type="button" className="add-btn" onClick={addSongHandler}>
                      {/* <span className="txt">ADD NEW SONG</span> */}
                      <i className="fa-solid fa-plus mgRemove"></i>
                    </button>
                  </div>
                </div>
                <div className="holder libraryListScroll">
                  <table className="list-table">
                    {
                      (globalSongsArray.length > 0 && globalSearch) && (
                        globalSongsArray
                          .map((song, index) => (
                            <tr key={song.song_id} className='trRow' >
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
                                  <li className='linesParent' onClick={() => addGlobalSongToLibrary(song)}>
                                    <i className="fa fa-plus-circle"></i>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          ))
                      )
                    }

                    {
                      (filteredSongs.length > 0 && !globalSearch) ? (
                        <Reorder.Group axis="y" onReorder={setFilteredSongs} values={filteredSongs}>
                          {filteredSongs
                            .map((song, index) => (
                              <Reorder.Item
                                key={song.id}
                                value={song}
                                id={song.id}
                                dragListener={true}
                                dragControls={dragControls}
                                onDragEnd={reorderHandler}
                              >
                                <tr key={song.id} className='trRow d-flex w-full justify-content-between align-items-center' >
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
                                        {/* <i className="fa-solid fa-grip-lines"></i> */}
                                        <ReorderIcon dragControls={dragControls} />
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
                              </Reorder.Item>
                            ))
                          }
                        </Reorder.Group>
                      ) : (globalSong.length > 0 && !globalSearch) ? (
                        globalSong
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
                      ) : <></>
                    }

                  </table>
                  {((songs.length === 0 && !globalSearch) || (globalSongsArray.length === 0 && globalSearch)) && <div className="holder no-record">
                    <strong className="not-found">No Record Found</strong>
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