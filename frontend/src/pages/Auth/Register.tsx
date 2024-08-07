import logotype from '@utils/logotype.png';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './../../services/api';

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      await api.post('/auth/register', {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        phone,
        email,
        password,
      });
      navigate('/');
    } catch (error) {
      console.error('Erro ao se cadastrar:', error);
    }
  };

  return (

    <section className='flex justify-between h-screen'>

      <div className='bg-darkGreen w-1/3 flex flex-col justify-between py-6 px-10'>
        <img src={logotype} alt='logotype' width="200" />

        <div id='handleForm' className='flex flex-col gap-5'>
          <input
            type="text"
            placeholder="Nome"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Sobrenome"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="date"
            placeholder="Data de Nascimento"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className='flex flex-col gap-4 text-center mt-2 border-2 p-3 border-lightGreen'>
            <p className='text-white'>Obs: Essas serão suas credenciais para fazer login</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button onClick={handleSignUp} className='btn-secondary hover:bg-lightGreen'>Cadastrar</button>
        
        <div className='flex gap-3 items-center ml-24'>
          <p className='text-white'>Já é cadastrado?</p>
          <Link to="/login" className='text-white font-medium'>
              Entrar agora
          </Link>
        </div>
      </div>

      <div className='bg-register-bg bg-cover bg-no-repeat bg-center w-2/3 text-center relative'>
        <div className='absolute top-16 left-52 space-y-4 text-center'>
          <h1 className='text-5xl font-bold'>Entre no mundo dos sims<br />e faça amigos!</h1>
          <h4 className='text-lg'>Simule a vida do seu sim online, mostre suas conquistas na carreira <br />e sua evolução na vida <b>(do seu sim)</b></h4>
        </div>
      </div>
    </section>
  );
};

export default Register;
