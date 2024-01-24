import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setAuth, setToken } from '../store/slices/auth-slice';
import Loader from '../components/loader';
import { setSettings } from '../store/slices/song-slice';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth)
    const currentRoute = useLocation()
    const [loading, setLoading] = useState(false);
    const [dropdown, setdropdown] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [active, setActive] = useState({
        home: false,
        library: false,
        setList: false
    });

    const clickHandler = async (text) => {
        let newState;
        if (text === 'home') {
            navigate('/home');
        } else if (text === 'library') {
            navigate('/library');
        } else if (text === 'setlist') {
            navigate('/setlist');
        }
    };



    const logoutHandler = async () => {
        try {
            setLoading(true);
            await axios.get(`${process.env.REACT_APP_BASE_URL}/logout`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            dispatch(setToken(''));
            dispatch(setAuth(false));
            navigate('/login')
        } catch (error) {
            console.log(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }

    const toggleDropdown = () => {
        setdropdown(!dropdown);
    }

    const globalSearchHandler = () => {
        navigate('/globalSearch')
    }
    return (
        <>
            {loading && <Loader />}
            <div id="header">
                <div className="container-fluid d-flex">
                    <strong className="logo"><a onClick={() => navigate('/')}><img src="/logo.svg" alt="StagePro" /></a></strong>
                    <ul className="navigation">
                        {/* <li className={active.home===true && 'active'}><a onClick={() => clickHandler('home')}>Uploads</a></li> */}
                        {/* <li className={active.library===true && 'active'}><a onClick={() => clickHandler('library')}>My Library</a></li> */}
                        <li><a className={currentRoute.pathname === '/home' ? 'navLinkColor text-light' : "navLinkColor"} onClick={() => clickHandler('home')}>Home</a></li>

                        <li><a className={(currentRoute.pathname === '/library' || currentRoute.pathname === '/add-song' || currentRoute.pathname === '/player') ? 'navLinkColor text-light' : "navLinkColor"} onClick={() => clickHandler('library')}>My Library</a></li>

                        <li><a className={(currentRoute.pathname === '/setlist' || currentRoute.pathname === '/setlistSongs' || currentRoute.pathname === '/add-setlist' || currentRoute.pathname === '/setlist-player') ? 'navLinkColor text-light' : "navLinkColor"} onClick={() => clickHandler('setlist')}>Set Lists</a></li>
                    </ul>
                    <div className="user-box">
                        <button onClick={toggleDropdown} type="button" className="opener">
                            <span className="avatar">{user?.name?.charAt(0)}</span>
                            <span className="txt">{user.name}</span>
                            <i className="fa-solid fa-angle-down"></i>
                        </button>
                        <div className="dropdown" style={dropdown ? { display: 'block' } : { display: 'none' }}>
                            {/* <a className="dropdown-item" onClick={globalSearchHandler}>Global Search</a> */}
                            <a className="dropdown-item" onClick={logoutHandler}>Logout</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar