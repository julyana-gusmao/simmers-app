import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import arrowBack from '@utils/arrow-back.svg';

const UpdateProfilePage: React.FC = () => {
  const { user: currentUser, updateUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>('');

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
      setBirthDate(currentUser.birthDate);
      setProfilePictureUrl(currentUser.profilePicture ? `http://localhost:3333${currentUser.profilePicture}` : 'default-avatar.png');
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('birthDate', birthDate);

    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const response = await api.put(`/users/${currentUser?.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (profilePicture) {
        const pictureFormData = new FormData();
        pictureFormData.append('profilePicture', profilePicture);

        const pictureResponse = await api.post(`/users/profile-picture/${currentUser?.id}`, pictureFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        updateUser(pictureResponse.data.data);
      } else {
        updateUser(response.data.data);
      }

      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        await api.delete(`/users/${currentUser?.id}`);
        signOut();
        navigate('/login');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error deleting account');
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
       <button
          className="size-10 absolute bottom-44 left-10"
          onClick={() => navigate(-1)}
        >
          <img src={arrowBack} alt="Voltar" />
        </button>
      <h1 className="text-2xl font-bold">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col items-center">
          <label className="text-lg font-medium">Profile Picture</label>
          <img
            src={profilePictureUrl}
            alt="Profile"
            className="h-32 w-32 rounded-full object-cover border border-gray-300 mb-2"
          />
          <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mt-2">
            Editar Foto
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                setProfilePicture(file);
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    setProfilePictureUrl(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <label className="text-lg font-medium">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label className="text-lg font-medium">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label className="text-lg font-medium">Birth Date</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            className="border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete Account
          </button>
        </div>
      </form>
      <button
        onClick={() => navigate('/profile')}
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
      >
        Back to Profile
      </button>
    </div>
  );
};

export default UpdateProfilePage;
