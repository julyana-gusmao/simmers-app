import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import plumbob from '@utils/plumbob.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (

    <section className='bg-darkGreen flex justify-between h-screen'>

      <div id='hero'
        className='flex flex-col h-full w-3/4 gap-6 bg-custom-bg bg-cover bg-center justify-center items-center'>
        <img src={plumbob} alt='plumbob' width="100" className='animate-bounce' />
        <h1 className='text-6xl font-extrabold text-stroke'>S.IMMERS</h1>
        <h2 className='text-3xl font-medium'>A rede social <span className='text-green-600 font-bold'>favorita</span> dos players de The Sims!</h2>
      </div>


      <div id='LOGIN'
        className='w-1/4 flex flex-col justify-evenly items-center'>
        <form onSubmit={handleLogin} className='flex flex-col gap-4 w-72 [&>input]:p-2 [&>input]:rounded-md'>
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
          <button type="submit" className='btn-primary shadow-m hover:scale-110'>Entrar</button>
        </form>
        <div className='flex flex-col gap-3 items-center'>
          <p className='text-white'>Não tem uma conta?</p>
            <Link to="/signup">
              <button className="btn-secondary font-medium">
                Cadastre-se grátis!
              </button>
            </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
