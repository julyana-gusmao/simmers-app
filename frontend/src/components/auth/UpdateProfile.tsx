import React, { RefObject } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import InputMask from 'react-input-mask';
import calendar from '@utils/calendar.svg';
import { useNavigate } from 'react-router-dom';

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
  datePickerRef
}) => {

  const navigate = useNavigate()

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center justify-center p-5">
      <div className='flex gap-14 items-center'>
        <div id='picture' className="flex flex-col items-center gap-2">
          <img
            src={profilePictureUrl}
            alt="Profile"
            className="h-32 w-32 rounded-full object-cover border border-gray-300 mb-2"
          />
          <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mt-2">
            Editar Foto de Perfil
            <input
              type="file"
              onChange={(e) => handleProfilePictureChange(e.target.files ? e.target.files[0] : null)}
              className="hidden"
            />
          </label>
        </div>
        <div className='space-y-5'>
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
        </div>
      </div>
      <div id='credencials' className='flex gap-5 w-full mt-5'>
        <div id='email' className='flex flex-col w-full'>
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
              className="bg-black text-white px-4 py-2 rounded-md"
            >
              Alterar Email
            </button>
          )}
        </div>
        <div id='password' className='flex flex-col w-full'>
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
              className="bg-black text-white px-4 py-2 rounded-md"
            >
              Alterar Senha
            </button>
          )}
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        {errorMessage && <p className="text-red-700 text-center">{errorMessage}</p>}
        <div className="flex gap-3 mt-5">
          <button type="submit" className="btn-primary text-white px-10 py-2 rounded-md">
            Salvar Alterações
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="bg-gray-500 text-white px-10 py-2 rounded-md"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
};

export default UpdateProfile;
