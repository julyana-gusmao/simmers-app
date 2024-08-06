import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileInfoUpdate from '../components/users/ProfileInfoUpdate';
import PasswordUpdate from '../components/users/PasswordUpdate';

const ProfileUpdatePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Update Profile</h1>
      <ProfileInfoUpdate />
      <PasswordUpdate />
      <button onClick={() => navigate('/profile')}>Back to Profile</button>
    </div>
  );
};

export default ProfileUpdatePage;
