import React from 'react'

const SongComponents = ({ song, index, playSongHandler, optionsHandler, editSongHandler, deleteSongHandler ,selectedSong, addToSetlistHandler}) => {
    return (

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
                    {/* <li>3:54</li> */}
                    {/* <li>
                        <a href="#" className="fav">
                            <i className="fa-regular fa-heart"></i>
                            <i className="fa-solid fa-heart"></i>
                        </a>
                    </li> */}
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
    )
}
export default SongComponents