import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import SettingPage from './pages/SettingPage.jsx';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore.js';
import { Loader } from 'lucide-react';
import { Toaster } from "react-hot-toast";
const App = () => {
  const { authUser, checkAuth, isCheckAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  if (isCheckAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/login' element={authUser ? <Navigate to="/" /> : <LoginPage />} />
        <Route path='/signup' element={authUser ? <Navigate to="/" /> : <SignupPage />} />
        <Route path='/settings' element={<SettingPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App