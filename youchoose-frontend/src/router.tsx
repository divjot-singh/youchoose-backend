import React from 'react'
import { Route, BrowserRouter as Router, Routes, Outlet, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SelectClub from './pages/SelectClub';
import SelectSongs from './pages/SelectSongs';
import { useAuth } from './providers/userProvider';
import { RoutesKeys } from './utils/routes';

const ProtectedRoute = (props:any) => {
    const {user} = useAuth()
    const location = useLocation()
    return user ? <Outlet /> : <Navigate to={RoutesKeys.LOGIN} state={{from:location.pathname}} />
}

const AppRouter = () => {
    return (
    <Router>
        <Routes>
            <Route path={RoutesKeys.ROOT} element={<ProtectedRoute />}>
                <Route path={RoutesKeys.ROOT} element={<Home />} />
                <Route path={RoutesKeys.HOME} element={<Home />} />
            </Route>
            <Route path={RoutesKeys.LOGIN} element={<Login />} />
            <Route path={RoutesKeys.REGISTER} element={<Register />} />
            <Route path={RoutesKeys.SELECT_CLUB} element={<SelectClub />} />
            <Route path={RoutesKeys.SELECT_SONGS} element={<SelectSongs />} />
            <Route path="*" element={<Navigate to={RoutesKeys.ROOT} replace />} />
        </Routes>
    </Router>
  )
}

export default AppRouter