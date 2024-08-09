import React, { useState } from 'react';
import api from './../../services/api';
import SuccessModal from '@components/modal/SuccessModal';
import Register from '@components/auth/Register';

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !birthDate || !phone || !email || !password) {
      setErrorMessage('Por favor, preencha todos os campos');
      return;
    }

    if (firstName.length < 3 || firstName.length > 30) {
      setErrorMessage('O nome deve ter entre 3 e 30 caracteres');
      return;
    }

    if (lastName.length < 3 || lastName.length > 30) {
      setErrorMessage('O sobrenome deve ter entre 3 e 30 caracteres');
      return;
    }

    if (email.length < 3 || email.length > 50) {
      setErrorMessage('O email deve ter entre 3 e 50 caracteres');
      return;
    }

    if (password.length < 6 || password.length > 20) {
      setErrorMessage('A senha deve ter entre 6 e 20 caracteres');
      return;
    }

    try {
      await api.post('/auth/register', {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate ? birthDate.toISOString().split('T')[0] : null,
        phone,
        email,
        password,
      });
      setShowSuccessModal(true);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage('Esse email já possui conta registrada no Simmers');
      } else {
        setErrorMessage('Erro ao se cadastrar, tente novamente.');
      }
    }
  };

  return (
    <div>
      <Register
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        birthDate={birthDate}
        setBirthDate={setBirthDate}
        phone={phone}
        setPhone={setPhone}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        errorMessage={errorMessage}
        handleSignUp={handleSignUp}
      />
      {showSuccessModal && (
        <SuccessModal
          onClose={() => setShowSuccessModal(false)}
          message="Registrado com sucesso!"
          redirectPath="/profile"
        />
      )}
    </div>
  );
};

export default RegisterPage;
