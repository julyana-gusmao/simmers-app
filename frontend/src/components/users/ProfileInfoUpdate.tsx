import React, { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const ProfileInfoUpdate: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    birthDate: user?.birthDate || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleProfilePictureUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profilePicture) {
      alert('Please select a file first');
      return;
    }
    const formData = new FormData();
    formData.append('profile_picture', profilePicture);

    try {
      const response = await api.post(`/users/profile-picture/${user?.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      updateUser(response.data.data);
      alert('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Error uploading profile picture');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.put(`/users/${user?.id}`, formData);
      updateUser(response.data.data);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  return (
    <div>
      <h2>Update Profile Information</h2>
      <form onSubmit={handleUpdateProfile}>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          placeholder="Birth Date"
          required
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <button type="submit">Update Profile</button>
      </form>

      <h2>Profile Picture</h2>
      <form onSubmit={handleProfilePictureUpload}>
        <input type="file" onChange={handleProfilePictureChange} />
        <button type="submit">Upload Profile Picture</button>
      </form>
    </div>
  );
};

export default ProfileInfoUpdate;
