import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import UserDirectory from './pages/UserDirectory';
import UserProfile from './pages/UserProfile';
import AddPost from './pages/AddPost';
import Login from './pages/Login';
import Signup from "./pages/Signup";
import NotFound from './pages/NotFound';
import Posts from './pages/Posts';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UserDirectory />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/edit-profile" element={<EditProfile />} />

          <Route
            path="/add-post"
            element={
              <ProtectedRoute>
                <AddPost />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;