
import './App.css';
import './App.scss'
import AppRouter from './router';
import { useEffect, useState } from 'react';
import { InitialiseFirebaseApp } from './services/firebaseService';
import { UserContextWrapper } from './providers/userProvider';
import { CommonComponentsProvider } from './providers/commonComponentsProvider';
import { ClubProvider } from './providers/clubProvider';
import { AddedSongsProvider } from './providers/addedSongsProvider';
import { LikedSongsProvider } from './providers/likedSongsProvider';


function App() {
  const [appInitialised, setAppInitialised] = useState(false)
  useEffect(() => {
    if(InitialiseFirebaseApp()){
      setAppInitialised(true)
    }
  },[])
  return (
    <CommonComponentsProvider>
      <UserContextWrapper isAppInitialised={appInitialised}>
        <LikedSongsProvider>
          <ClubProvider>
            <AddedSongsProvider>
              <AppRouter />
            </AddedSongsProvider>
          </ClubProvider>
        </LikedSongsProvider>
      </UserContextWrapper>
    </CommonComponentsProvider>
  );
}

export default App;
