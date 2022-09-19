import React from 'react'
import { Route, BrowserRouter as Router, Routes, Outlet, Navigate, useLocation } from 'react-router-dom';
import { UserType } from './entities/user';
import ClubSongsList from './pages/ClubSongsList';
import Home from './pages/Home';
import Login from './pages/Login';
import MySongs from './pages/MySongs';
import Register from './pages/Register';
import SelectClub from './pages/SelectClub';
import SelectSongs from './pages/SelectSongs';
import SuggestedSongsList from './pages/SuggestedSongs';
import { useAuth } from './providers/userProvider';
import { RoutesKeys } from './utils/routes';

const DjProtectedRoute = (props:any) => {
    const {user} = useAuth()
    const location = useLocation()
    return user && user.user_type === UserType.DJ ? <Outlet /> : <Navigate to={RoutesKeys.LOGIN} state={{from:location.pathname}} />
}

const UserProtectedRoute = (props:any) => {
    const {user} = useAuth()
    const location = useLocation()
    return user && user.user_type === UserType.USER ? <Outlet /> : <Navigate to={RoutesKeys.LOGIN} state={{from:location.pathname}} />
}


const AppRouter = () => {
    return (
    <Router>
        <Routes>
            <Route path={RoutesKeys.ROOT} element={<DjProtectedRoute />}>
                <Route path={RoutesKeys.SUGGESTED_SONG_LIST} element={<SuggestedSongsList />} />
            </Route>
            <Route path={RoutesKeys.ROOT} element={<UserProtectedRoute />}>
                <Route path={RoutesKeys.MY_SONGS} element={<MySongs />} />
                <Route path={RoutesKeys.SELECT_CLUB} element={<SelectClub />} />
                <Route path={RoutesKeys.SELECT_SONGS} element={<SelectSongs />} />
            </Route>
            <Route path={RoutesKeys.LOGIN} element={<Login />} />
            <Route path={RoutesKeys.REGISTER} element={<Register />} />
            <Route path={RoutesKeys.CLUB_SONG_LIST} element={<ClubSongsList />} />
            <Route path="*" element={<Navigate to={RoutesKeys.ROOT} replace />} />
        </Routes>
    </Router>
  )
}

export default AppRouter