
import './App.css';
import './App.scss'
import AppRouter from './router';
import { useEffect, useState } from 'react';
import { InitialiseFirebaseApp } from './services/firebaseService';
import { UserContextWrapper } from './providers/userProvider';
import { CommonComponentsProvider } from './providers/commonComponentsProvider';
import { ClubProvider } from './providers/clubProvider';


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
        <ClubProvider>
          <AppRouter />
        </ClubProvider>
      </UserContextWrapper>
    </CommonComponentsProvider>
  );
}

export default App;
