import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const UnprotectedRoute = () => {
    let auth = useSelector(state => state.auth);
    return (
        auth.isAuth === false ? <Outlet /> : <Navigate to="/" />
    )
}

export default UnprotectedRoute;