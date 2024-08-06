import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.delete('/auth/logout');
      signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        await api.delete(`/users/${user?.id}`);
        signOut();
        navigate('/login');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error deleting account');
      }
    }
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <img src={user?.profilePicture || 'default-avatar.png'} alt="Profile" width="100" height="100" />
      <h2>{user?.firstName} {user?.lastName}</h2>
      <p>Birth Date: {user?.birthDate}</p>
      <button onClick={() => navigate('/')}>Home</button>
      <button onClick={() => navigate('/profile/update')}>Update Profile</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
};

export default ProfilePage;
