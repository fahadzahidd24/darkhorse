import React from 'react'
import { useState } from 'react';
import Navbar from '../../../layout/navbar';
import Loader from '../../../components/loader';
import { useEffect } from 'react';
import axios from 'axios';

const GlobalSearch = () => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {

        // const SearchSongs = async () => {
        // }
        const SearchSongs = async () => {
            setLoading(true);
            try {
                console.log(searchTerm);
                const songs = await axios.post('http://localhost:3000/globalSearch', { term: searchTerm });
                console.log(songs);
                // console.log(songs);
                // const response = await axios.get(
                //     `${process.env.REACT_APP_BASE_URL}/songs/${searchTerm}`,
                //     {
                //         headers: {
                //             Authorization: `Bearer ${localStorage.getItem("token")}`
                //         }
                //     }
                // );
                // console.log(response.data)
                // setLastPage(response.data.data.last_page)
                // setIncrement(1)
                // setGlobalSong(response.data.data.data)
                // setLoading(false);

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
        }, 1000)
        return () => clearTimeout(debouncing);
    }, [searchTerm]);

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
                                    <h1>Search Songs</h1>
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
                                    {/* <button type="button" className="add-btn" onClick={addSongHandler}>
                                        <span className="txt">ADD NEW SONG</span>
                                        <i className="fa-solid fa-plus"></i>
                                    </button> */}
                                </div>
                                {/* {recentlyPlayedSongs.length > 0 && <div className="clearAll d-flex justify-content-end mt-3">
                                    <button className='btnConfirm text-sm' onClick={clearHandler}>Clear All</button>
                                </div>} */}
                                <table className="list-table">
                                    {/* {recentlyPlayedSongs?.map((song, index) => (
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
                                        </tr>
                                    ))} */}
                                </table>
                                {/* {(recentlyPlayedSongs.length == 0 && noRecord) && <div className="holder no-record">
                                    <strong className="not-found">No Record Found</strong>
                                </div>} */}
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

export default GlobalSearch;