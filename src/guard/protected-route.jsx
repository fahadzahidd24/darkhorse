import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    let auth = useSelector(state => state.auth);
    return (
        auth.isAuth ? <Outlet /> : <Navigate to="/intro" />
    )
}

export default ProtectedRoute;