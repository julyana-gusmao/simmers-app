import logotype from '@utils/logotype.png';
import calendar from '@utils/calendar.svg';
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import InputMask from 'react-input-mask';
import api from './../../services/api';

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const datePickerRef = useRef<DatePicker>(null);

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
      navigate('/');
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage('Esse email já possui conta registrada no Simmers');
      } else {
        setErrorMessage('Erro ao se cadastrar, tente novamente.');
      }
    }
  };

  return (
    <section className='flex justify-between h-screen'>
      <div className='bg-darkGreen w-1/3 flex flex-col justify-between py-6 px-10'>
        <img src={logotype} alt='logotype' width="200" />
        <div id='handleForm' className='flex flex-col gap-5 [&>input]:w-full items-center'>
          <input
            required
            type="text"
            minLength={3}
            maxLength={30}
            placeholder="Nome"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            required
            type="text"
            minLength={3}
            maxLength={30}
            placeholder="Sobrenome"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <div className='flex gap-5'>
            <div className='relative'>
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
                      } else {
                        setBirthDate(null);
                      }
                    }}
                    className="input"
                    placeholder="00-00-0000"
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
            <InputMask
              required
              mask="(99) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Telefone"
              className="input"
            />
          </div>
          <div className='flex flex-col gap-4 text-center mt-2 border-2 p-3 border-lightGreen'>
            <p className='text-white'>Obs: Essas serão suas credenciais para fazer login</p>
            <input
              required
              minLength={3}
              maxLength={50}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              required
              minLength={6}
              maxLength={20}
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          {errorMessage && <p className="text-red-700 text-center">{errorMessage}</p>}
          <button onClick={handleSignUp} className='btn-secondary hover:bg-lightGreen'>Cadastrar</button>
        </div>
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
