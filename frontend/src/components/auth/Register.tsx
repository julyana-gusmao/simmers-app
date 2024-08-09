import React, { useRef } from 'react';
import logotype from '@utils/logotype.png';
import calendar from '@utils/calendar.svg';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom';

interface RegisterProps {
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  birthDate: Date | null;
  setBirthDate: React.Dispatch<React.SetStateAction<Date | null>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: string;
  handleSignUp: () => void;
}

const Register: React.FC<RegisterProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  birthDate,
  setBirthDate,
  phone,
  setPhone,
  email,
  setEmail,
  password,
  setPassword,
  errorMessage,
  handleSignUp
}) => {
  const datePickerRef = useRef<DatePicker>(null);

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
          {errorMessage && <p className="text-red-800 font-bold text-center">{errorMessage}</p>}
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
