import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import arrowBack from '@utils/arrow-back.svg';
import calendar from '@utils/calendar.svg';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import InputMask from 'react-input-mask';

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

      navigate('/profile');
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
        <div className='flex flex-col'>
          <label className="text-lg font-medium">Nome</label>
          <input
            type="text"
            minLength={3}
            maxLength={30}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="border border-gray-300 p-2 rounded-md"
          />
        </div>
        <div className='flex flex-col'>
          <label className="text-lg font-medium">Sobrenome</label>
          <input
            type="text"
            minLength={3}
            maxLength={30}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="border border-gray-300 p-2 rounded-md"
          />
        </div>
        <div id='date birth and tel' className='flex items-center gap-3'>
          <div className='flex flex-col'>
            <label className="text-lg font-medium">Data de Nascimento</label>
            <div className="relative">
              <DatePicker
                selected={birthDate}
                onChange={(date: Date | null) => setBirthDate(date)}
                dateFormat="dd-MM-yyyy"
                maxDate={new Date()}
                showYearDropdown
                showMonthDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                placeholderText="00-00-0000"
                customInput={
                  <InputMask
                    mask="99-99-9999"
                    value={birthDate ? birthDate.toLocaleDateString('en-GB') : ''}
                    onChange={(e) => {
                      const dateParts = e.target.value.split('-');
                      if (dateParts.length === 3) {
                        const [day, month, year] = dateParts.map(part => parseInt(part, 10));
                        setBirthDate(new Date(year, month - 1, day));
                      }
                    }}
                    className="border border-gray-300 p-2 rounded-md w-full"
                  />
                }
                ref={datePickerRef}
              />
              <img 
                src={calendar} 
                alt="Calendar" 
                className="w-5 h-5 absolute right-3 top-[10px] cursor-pointer" 
                onClick={() => datePickerRef.current?.setOpen(true)}
              />
            </div>
          </div>
          <div className='flex flex-col'>
            <label className="text-lg font-medium">Telefone</label>
            <InputMask
              mask="(99) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Telefone"
              className="border border-gray-300 p-2 rounded-md"
            />
          </div>
        </div>
        <div className='flex flex-col'>
          <label className="text-lg font-medium">Email</label>
          {showEmailInput ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 rounded-md"
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowEmailInput(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Alterar Email
            </button>
          )}
        </div>
        <div className='flex flex-col'>
          <label className="text-lg font-medium">Senha</label>
          {showPasswordInput ? (
            <>
              <input
                type="password"
                placeholder="Senha Atual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
              <input
                type="password"
                placeholder="Nova Senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-gray-300 p-2 rounded-md mt-2"
              />
            </>
          ) : (
            <button
              type="button"
              onClick={() => setShowPasswordInput(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Alterar Senha
            </button>
          )}
        </div>
        <div className='flex flex-col gap-3'>
          {errorMessage && <p className="text-red-700 text-center">{errorMessage}</p>}
          <div className="flex gap-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Save
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Delete Account
            </button>
          </div>
        </div>
      </form>
      <button
        onClick={() => navigate('/profile')}
        className="bg-gray-500 text-white px-4 py-2 rounded-md mt-4"
      >
        Back to Profile
      </button>
    </div>
  );
};

export default UpdateProfilePage;
