import React, { useState } from 'react';
import PostForm from '../components/posts/Form';
import PostList from '../components/posts/List';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logotype from '@utils/logotype.png';

const Home: React.FC = () => {
  const [updatePosts, setUpdatePosts] = useState<boolean>(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handlePostCreated = () => {
    setUpdatePosts(!updatePosts);
  };

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <section className='flex flex-col items-center'>

      <header
        className='bg-mediumGreen fixed flex gap-5 items-center justify-between w-full h-[13vh] px-20'>
        <img src={logotype} alt='logotype' width="170" className='' />
        <div id='navbar' className='flex gap-10 mr-5 items-center'>
          <Link to="/users">
            <button className='btn-secondary'>
              Conhecer Simmers
            </button>
          </Link>
          <Link to="/profile">
            <button className='btn-secondary'>
            Editar Perfil
            </button>
          </Link>
          <button onClick={handleLogout} className='btn-danger px-10 text-white'>Logout</button>
        </div>
      </header>

      <main id='content'
        className='bg-blue-500 flex flex-col items-center gap-16 justify-between w-full pt-40'>
        <PostForm onPostCreated={handlePostCreated} />
        <PostList updatePosts={updatePosts} />
      </main>

    </section>
  );
};

export default Home;
