import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import arrowBack from '@utils/arrow-back.svg';
import DatePicker from 'react-datepicker';
import UpdateProfile from '@components/users/UpdateProfile';
import SuccessModal from '@components/modal/SuccessModal';

const UpdateProfilePage: React.FC = () => {
  const { user: currentUser, updateUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [phone, setPhone] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showEmailInput, setShowEmailInput] = useState<boolean>(false);
  const [showPasswordInput, setShowPasswordInput] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const datePickerRef = useRef<DatePicker>(null);

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
      setBirthDate(currentUser.birthDate ? new Date(currentUser.birthDate) : null);
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email || '');
      setProfilePictureUrl(currentUser.profilePicture ? `http://localhost:3333${currentUser.profilePicture}` : 'default-avatar.png');
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (firstName.length < 3 || firstName.length > 30) {
      setErrorMessage('O nome deve ter entre 3 e 30 caracteres');
      return;
    }

    if (lastName.length < 3 || lastName.length > 30) {
      setErrorMessage('O sobrenome deve ter entre 3 e 30 caracteres');
      return;
    }

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('birthDate', birthDate ? birthDate.toISOString().split('T')[0] : '');
    formData.append('phone', phone);

    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    if (showEmailInput) {
      formData.append('email', email);
    }

    try {
      const response = await api.put(`/users/${currentUser?.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (showPasswordInput && currentPassword && newPassword) {
        await api.put(`/users/password/${currentUser?.id}`, {
          currentPassword,
          newPassword
        });
      }

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

      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Erro ao atualizar perfil, tente novamente.');
      }
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

  const handleProfilePictureChange = (file: File | null) => {
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePictureUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      <UpdateProfile
        firstName={firstName}
        lastName={lastName}
        birthDate={birthDate}
        phone={phone}
        email={email}
        currentPassword={currentPassword}
        newPassword={newPassword}
        profilePictureUrl={profilePictureUrl}
        showEmailInput={showEmailInput}
        showPasswordInput={showPasswordInput}
        errorMessage={errorMessage}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setBirthDate={setBirthDate}
        setPhone={setPhone}
        setEmail={setEmail}
        setCurrentPassword={setCurrentPassword}
        setNewPassword={setNewPassword}
        handleProfilePictureChange={handleProfilePictureChange}
        setShowEmailInput={setShowEmailInput}
        setShowPasswordInput={setShowPasswordInput}
        handleSubmit={handleSubmit}
        handleDeleteAccount={handleDeleteAccount}
        datePickerRef={datePickerRef}
      />
      <button
        onClick={() => navigate('/profile')}
        className="bg-gray-500 text-white px-4 py-2 rounded-md mt-4"
      >
        Back to Profile
      </button>
      {showSuccessModal && (
        <SuccessModal
          onClose={() => setShowSuccessModal(false)}
          message="Informações atualizadas com sucesso!"
          redirectPath="/profile"
        />
      )}
    </div>
  );
};

export default UpdateProfilePage;
