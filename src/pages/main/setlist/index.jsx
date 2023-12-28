import React from 'react'
import Navbar from '../../../layout/navbar'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react';
import { setSetListSongs, setSetlistToEdit, setSetlistToGet, setSetlistsArray } from '../../../store/slices/setlist-slice';
import axios from 'axios';
import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../components/loader';
import ErrorModal from '../../../components/errorModal';
import ConfirmationModel from '../../../components/confirmationModel';

const Setlist = () => {
    const { setlists } = useSelector((state) => state.setlist);
    const [selectedSetlist, setSelectedSetlist] = useState();
    const [setlistToDelete, setSetlistToDelete] = useState();
    const [noRecord, setNoRecord] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        errorMessage: '',
        isError: false
    });

    const addSetListHandler = () => {
        navigate('/add-setlist')
    }

    useLayoutEffect(() => {
        dispatch(setSetListSongs([]));
        if (setlists?.length === 0) {
            const fetchSongs = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/playlists`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    dispatch(setSetlistsArray(response.data.data));
                } catch (error) {
                    setError({
                        errorMessage: error?.response?.data?.message,
                        isError: true
                    });
                    console.log(error?.response?.data?.message);
                } finally {
                    setLoading(false);
                    setNoRecord(true);
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

    const setlistClickHandler = (setlist) => {
        dispatch(setSetlistToGet(setlist));
        navigate('/setlistSongs')
    }

    const optionsHandler = (setlist) => {
        if (selectedSetlist && selectedSetlist.id === setlist.id) {
            setSelectedSetlist(null);
            return;
        } else {
            setSelectedSetlist(setlist);
        }
    }

    const editSetListHandler = (setlist) => {
        dispatch(setSetlistToEdit(setlist));
        navigate('/add-setlist');
    }
    
    const deleteSetListHandler = (setlist) => {
        setSetlistToDelete(setlist);
        setConfirm(true);
    }


    const pressYesHandler = async () => {
        try {
          setConfirm(false);
          setLoading(true);
          await axios.get(`${process.env.REACT_APP_BASE_URL}/playlist-delete/${setlistToDelete.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
          dispatch(setSetlistsArray(setlists.filter((setlist) => setlist.id != setlistToDelete.id)));
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

    return (
        <>
            {loading && <Loader />}
            {confirm && <ConfirmationModel onPressYes={pressYesHandler} onPressNo={pressNoHandler} />}
            <div class="main-template">
                <div id="wrapper">
                    <Navbar />
                    <main id="main">
                        <div class="container-fluid">
                            <div class="list-container">
                                <div class="container-head">
                                    <h1>Setlists</h1>
                                    {error.isError && <ErrorModal onPressOk={handlerOkPress} errorMessage={error.errorMessage} />}
                                    <button type="button" class="add-btn" onClick={addSetListHandler}>
                                        <span class="txt">ADD NEW SETLIST</span>
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                                <div class="holder">
                                    <table class="list-table">
                                        {setlists?.map((setlist, index) => (
                                            <tr key={setlist.id} className='trRow' >
                                                <td onClick={setlistClickHandler.bind(null, setlist)}>
                                                    <span class="num">{index + 1}</span>
                                                    <i class="fa-regular fa-circle-pause"></i>
                                                </td>
                                                <td onClick={setlistClickHandler.bind(null, setlist)}>
                                                    <div class="title-box">
                                                        <div class="image"><img src="/list-icon.png" alt="image" /></div>
                                                        <strong class="title">{setlist.title}</strong>
                                                    </div>
                                                </td>
                                                <td align="right">
                                                    <ul className="list">
                                                        {/* <li>3:54</li> */}
                                                        <li className='linesParent' onClick={() => optionsHandler(setlist)}>
                                                            <i className="fa-solid fa-grip-lines"></i>
                                                            {(selectedSetlist && selectedSetlist.id === setlist.id) && <div className='dropdown'>
                                                                <ul className='ulDropdown'>
                                                                    <li onClick={editSetListHandler.bind(null, setlist)}>Edit</li>
                                                                    <li onClick={deleteSetListHandler.bind(null, setlist)}>Delete</li>
                                                                </ul>
                                                            </div>}
                                                        </li>
                                                    </ul>
                                                </td>
                                            </tr>
                                        ))}
                                    </table>
                                </div>
                                {(setlists?.length === 0 && noRecord) && <div className="holder no-record">
                                    <strong className="not-found">No Record Found</strong>
                                </div>}
                            </div>
                        </div>
                    </main>

                    <div class="corner left"><img src="/top-strip.png" alt="strip" /></div>
                    <div class="corner right"><img src="/bottom-strip.png" alt="strip" /></div>
                    <div class="bar left">
                        <img src="/logo.svg" alt="logo" class="side-logo" />
                    </div>
                    <div class="bar right">
                        <img src="/logo.svg" alt="logo" class="side-logo" />
                    </div>
                </div>

            </div>
        </>
    )
}

export default Setlist