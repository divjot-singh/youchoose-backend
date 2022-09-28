import React, { useEffect } from 'react'
import { Route, BrowserRouter as Router, Routes, Outlet, Navigate, useLocation } from 'react-router-dom';
import { UserType } from './entities/user';
import ClubsList from './pages/ClubsList';
import ClubSongsList from './pages/ClubSongsList';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import Login from './pages/Login';
import ModeratorsList from './pages/ModeratorsList';
import MySongs from './pages/MySongs';
import Register from './pages/Register';
import SelectClub from './pages/SelectClub';
import SelectSongs from './pages/SelectSongs';
import { useAuth } from './providers/userProvider';
import { AuthType } from './services/authService';
import { RoutesKeys } from './utils/routes';


const ModeratorProtectedRoute = (props:any) => {
    const {user} = useAuth()
    const location = useLocation()
    return user && user.user_type === UserType.MODERATOR ? <Outlet /> : <Navigate to={RoutesKeys.LOGIN} state={{from:location.pathname}} />
}

const UserProtectedRoute = (props:any) => {
    const {user} = useAuth()
    const location = useLocation()
    return user && user.user_type === UserType.USER ? <Outlet /> : <Navigate to={RoutesKeys.LOGIN} state={{from:location.pathname}} />
}

const NonLoggedInUser = (props:any) => {
    const {user, authenticate} = useAuth()
    const location = useLocation()
    useEffect(() => {
        if(!user){
            authenticate(AuthType.None)
        }
    },[user])
    return user && user.user_type === UserType.USER ? <Outlet /> : <Navigate to={RoutesKeys.LOGIN} state={{from:location.pathname}} />
}

const AppRouter = () => {
    return (
    <Router>
        <Routes>
            <Route path={RoutesKeys.ROOT} element={<UserProtectedRoute />}>
                <Route path={RoutesKeys.MY_SONGS} element={<MySongs />} />
            </Route>
            <Route path={RoutesKeys.ROOT} element={<ModeratorProtectedRoute />}>
                <Route path={RoutesKeys.CLUBS_LIST} element={<ClubsList />} />
                <Route path={RoutesKeys.MODERATORS_LIST} element={<ModeratorsList />} />
            </Route>
            <Route path={RoutesKeys.LOGIN} element={<Login />} />
            <Route path={RoutesKeys.REGISTER} element={<Register />} />
            <Route path={RoutesKeys.CLUB_SONG_LIST} element={<ClubSongsList />} />
            <Route path={RoutesKeys.SELECT_CLUB} element={<SelectClub />} />
            <Route path={RoutesKeys.ROOT} element={<NonLoggedInUser />}>
                <Route path={RoutesKeys.SELECT_SONGS} element={<SelectSongs />} />
            </Route>
            <Route path={RoutesKeys.ERROR_PAGE} element={<ErrorPage />} />
            <Route path="*" element={<Navigate to={RoutesKeys.ERROR_PAGE} replace />} />
        </Routes>
    </Router>
  )
}

export default AppRouter