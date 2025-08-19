import React, { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute';
import { LoadersLayout } from './components/Layout/Loaders';
import axios from "axios";
import { serverConnection } from "./constants/Configuration";
import { useDispatch, useSelector } from 'react-redux';
import {Toaster} from 'react-hot-toast';
import { UserIfExists, userIfNotExists } from './Redux/Reducers/auth';

// lazy loading components
const Home = lazy(() => import('./pages/Home'));
const Chat = lazy(() => import('./pages/Chat'));
const GroupManagement = lazy(() => import('./pages/GroupManagement'));
const Login = lazy(() => import('./pages/Login'));
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'))
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'))
const UserManagement = lazy(() => import('./pages/Admin/UserManagement'))
const ChatManagement = lazy(() => import('./pages/Admin/ChatManagement'))
const MessageManagement = lazy(() => import('./pages/Admin/MessageManagement'))



const App = () => {
  const {user} = useSelector(state => state.auth);    // Simulating user authentication status
  const dispatch = useDispatch();
  useEffect(() => {
    axios.get(`${serverConnection}/api/v1/user/profile`,{withCredentials: true})
      .then(({data}) => dispatch(UserIfExists(data.user)))
        .catch((err) => dispatch(userIfNotExists())
        )
  }, [dispatch]);


  return (
    <BrowserRouter>
      <Suspense fallback={<LoadersLayout />}>
        <Routes>
          <Route element={<ProtectedRoute user={user} />}>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<GroupManagement />} />
          </Route>

          <Route path="/login" element={
            <ProtectedRoute user={!user} redirect="/">
              <Login />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users-management" element={<UserManagement />} />
          <Route path="/admin/chats-management" element={<ChatManagement />} />
          <Route path="/admin/messages" element={<MessageManagement />} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" />
    </BrowserRouter>
  )
}

export default App;