import React, { useEffect, useState } from 'react'
import Navbar from '../../../layout/navbar'
import axios from 'axios';
import EditSong from '../../../components/EditSong';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutEffect } from 'react';
import ErrorModal from '../../../components/errorModal';
import Loader from '../../../components/loader';
import { setSongToPlay, setSongsArray } from '../../../store/slices/song-slice';
import { useNavigate } from 'react-router-dom';

const Library = () => {
  const { songs } = useSelector((state) => state.songs);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    errorMessage: '',
    isError: false
  });

  useLayoutEffect(() => {
    if (songs.length === 0) {
      const fetchSongs = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/songs`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
          console.log(response.data);
          dispatch(setSongsArray(response.data.data.data));
          console.log(songs);
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
  }, [])

  const handlerOkPress = () => {
    setError({
      errorMessage: '',
      isError: false
    });
  }

  const playSongHandler = (song) => {
    const songLyrics = song.lyrics.split('\n');
    dispatch(setSongToPlay(songLyrics))
    navigate('/player')
  }

  return (
    <>
      {loading && <Loader />}
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
                      <input type="search" className="form-field" placeholder="Search artists, songs..." />
                    </div>
                    <button type="button"><i className="fa-solid fa-microphone"></i></button>
                  </form>
                </div>
                <div className="holder">
                  <table className="list-table">
                    {songs?.map((song, index) => (
                      <tr key={song.id} className='trRow' onClick={()=> playSongHandler(song)}>
                        <td>
                          <span className="num">{index + 1}</span>
                          <i className="fa-regular fa-circle-pause"></i>
                        </td>
                        <td>
                          <div className="title-box">
                            <div className="image"><img src="/list-icon.png" alt="image" /></div>
                            <strong className="title">{song.title}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="cat-title">{song.artist}</span>
                        </td>
                        <td align="right">
                          <ul className="list">
                            {/* <li>3:54</li> */}
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
                    ))}
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