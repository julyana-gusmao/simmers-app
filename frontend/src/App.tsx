import ProfilePage from 'pages/ProfilePage';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import PostDetails from './pages/PostDetails';
import ExplorerPage from './pages/ExplorerPage';
import UpdateProfilePage from 'pages/Auth/UpdateProfile';
import Register from 'pages/Auth/Register';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<RedirectIfLogged><Login /></RedirectIfLogged>} />
          <Route path="/signup" element={<RedirectIfLogged><Register /></RedirectIfLogged>} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><ExplorerPage /></PrivateRoute>} />
          <Route path="/users/:id" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/posts/:id" element={<PrivateRoute><PostDetails /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/profile/edit" element={<PrivateRoute><UpdateProfilePage /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { signed } = useAuth();
  return signed ? children : <Navigate to="/login" />;
};

const RedirectIfLogged: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { signed } = useAuth();
  return signed ? <Navigate to="/" /> : children;
};

export default App;
