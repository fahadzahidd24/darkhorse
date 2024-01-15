import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuth, setToken } from '../store/slices/auth-slice';
import Loader from '../components/loader';
import { setSettings } from '../store/slices/song-slice';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth)
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
            setActive({
                home: true,
                library: false,
                setList: false
            });
            navigate('/home');
        } else if (text === 'library') {
            setActive({
                home: false,
                library: true,
                setList: false
            });
            navigate('/library');
        } else if (text === 'setlist') {
            setActive({
                home: false,
                library: false,
                setList: true
            });
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

    const globalSearchHandler = () =>{
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
                        <li><a className='active' onClick={() => clickHandler('home')}>Home</a></li>
                        <li><a className='active' onClick={() => clickHandler('library')}>My Library</a></li>
                        <li><a className='active' onClick={() => clickHandler('setlist')}>Set Lists</a></li>
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