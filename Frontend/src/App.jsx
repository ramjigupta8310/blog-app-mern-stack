import React from 'react'
import UserLogin from './pages/UserLogin'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserRegister from './pages/UserRegister';
import GlobalState from './context/GlobalState';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import ForgetPassword from './pages/ForgetPassword';
import Navbar from './components/Navbar';
import CreateBlog from './pages/CreateBlog';
import BlogDetail from './pages/BlogDetail';

const App = () => {
  return (
    <GlobalState>
      <BrowserRouter>
        <ProtectedRoute>
          <Navbar />
        </ProtectedRoute>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/create-blog" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
          <Route path="/blog/:id" element={<ProtectedRoute><BlogDetail /></ProtectedRoute>} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
        </Routes>
      </BrowserRouter>
    </GlobalState>

  )
}

export default App