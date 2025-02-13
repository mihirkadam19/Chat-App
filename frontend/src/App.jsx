//UI
import React, { useEffect } from 'react';
import {Loader} from "lucide-react";
import {Routes, Route, Navigate} from 'react-router-dom';
import {Toaster} from "react-hot-toast";

//components
import Navbar from './components/Navbar';

//pages
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

//store
import { useAuthStore } from './store/useAuthStore.js';
import { useThemeStore } from './store/useThemeStore.js';

const App = () => {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers, isUpdatingProfile} = useAuthStore();
  const {setTheme, theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth,isUpdatingProfile, theme]);

  //console.log({authUser});
  //console.log(onlineUsers);
  
  if (isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"/>
    </div>
  );
  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage/>: <Navigate to="/login"/>} />
        <Route path='/signup' element={ !authUser ? <SignUpPage/> : <Navigate to="/"/>} />
        <Route path='/login' element={ !authUser ? <LoginPage/> : <Navigate to="/"/>} />
        <Route path='/themes' element={<SettingsPage/>} />
        <Route path='/profile' element={ authUser ? <ProfilePage/> : <Navigate to="/login"/> } />
      </Routes>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  )
}

export default App
