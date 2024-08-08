import React, { RefObject } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import InputMask from 'react-input-mask';
import calendar from '@utils/calendar.svg';

interface UpdateProfileProps {
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  phone: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  profilePictureUrl: string;
  showEmailInput: boolean;
  showPasswordInput: boolean;
  errorMessage: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setBirthDate: (value: Date | null) => void;
  setPhone: (value: string) => void;
  setEmail: (value: string) => void;
  setCurrentPassword: (value: string) => void;
  setNewPassword: (value: string) => void;
  handleProfilePictureChange: (file: File | null) => void;
  setShowEmailInput: (value: boolean) => void;
  setShowPasswordInput: (value: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleDeleteAccount: () => void;
  datePickerRef: RefObject<DatePicker>;
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({
  firstName,
  lastName,
  birthDate,
  phone,
  email,
  currentPassword,
  newPassword,
  profilePictureUrl,
  showEmailInput,
  showPasswordInput,
  errorMessage,
  setFirstName,
  setLastName,
  setBirthDate,
  setPhone,
  setEmail,
  setCurrentPassword,
  setNewPassword,
  handleProfilePictureChange,
  setShowEmailInput,
  setShowPasswordInput,
  handleSubmit,
  handleDeleteAccount,
  datePickerRef
}) => {
  return (
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
            onChange={(e) => handleProfilePictureChange(e.target.files ? e.target.files[0] : null)}
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
  );
};

export default UpdateProfile;
