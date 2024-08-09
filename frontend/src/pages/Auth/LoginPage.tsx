import plumbob from '@utils/plumbob.png';
import { useAuth } from 'contexts/AuthContext';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/');
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        setErrorMessage('Verifique suas credenciais');
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <section className='flex justify-between h-screen'>
      <div id='hero' className='flex flex-col h-full w-3/4 gap-6 bg-custom-bg bg-cover bg-center justify-center items-center'>
        <img src={plumbob} alt='plumbob' width="100" className='animate-bounce' />
        <h1 className='text-6xl font-extrabold text-stroke'>S.IMMERS</h1>
        <h2 className='text-3xl font-medium'>A rede social <span className='text-green-600 font-bold'>favorita</span> dos players de The Sims!</h2>
      </div>
      <div id='LOGIN' className='bg-darkGreen w-1/4 flex flex-col justify-evenly items-center'>
        <form onSubmit={handleLogin} className='flex flex-col gap-4 w-72'>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <p className="text-red-800 font-bold text-center">{errorMessage}</p>}
          <button type="submit" className='btn-primary shadow-m hover:scale-110'>Entrar</button>
        </form>
        <div className='flex flex-col gap-3 items-center'>
          <p className='text-white'>Não tem uma conta?</p>
          <Link to="/signup">
            <button className="btn-secondary px-5 shadow-m hover:scale-110">Cadastre-se grátis!</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
