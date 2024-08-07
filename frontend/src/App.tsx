import ProfilePage from 'pages/ProfilePage';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import EditProfilePage from './pages/EditProfilePage';
import Home from './pages/Home';
import Login from './pages/Login';
import PostDetails from './pages/PostDetails';
import SignUp from './pages/SignUp';
import UsersPage from './pages/UsersPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<RedirectIfLogged><Login /></RedirectIfLogged>} />
          <Route path="/signup" element={<RedirectIfLogged><SignUp /></RedirectIfLogged>} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
          <Route path="/users/:id" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/posts/:id" element={<PrivateRoute><PostDetails /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/profile/edit" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
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
