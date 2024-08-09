import arrow from '@utils/arrow.svg';
import defaultAvatar from '@utils/default-avatar.png';
import logotype from '@utils/logotype.png';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PostForm from '../components/posts/Form';
import PostList from '../components/posts/List';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const [updatePosts, setUpdatePosts] = useState<boolean>(false);
  const { user } = useAuth();

  const handlePostCreated = () => {
    setUpdatePosts(!updatePosts);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className='flex flex-col min-h-screen items-center bg-cas-bg bg-cover bg-no-repeat bg-center'>
      <header className='bg-mediumGreen shadow-m fixed flex gap-5 items-center justify-between w-full h-[13vh] px-14 z-50'>
        <img src={logotype} alt='logotype' width="170" />
        <div id='navbar' className='flex gap-5 mr-5 items-center'>
          <Link to="/users">
            <button className='btn-secondary'>
              Explorar Simmers
            </button>
          </Link>
          <button onClick={handleScrollToTop} className='btn-primary'>
              <img src={arrow} alt="Subir ao topo" className='size-9 ml-2'/>
            </button>
          <div className='flex items-center gap-4'>
            <Link to="/profile">
              <img
                src={user?.profilePicture ? `http://localhost:3333${user.profilePicture}` : defaultAvatar}
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover cursor-pointer"
              />
            </Link>
          </div>
        </div>
      </header>

      <main id='content' className='mt-2 flex flex-col items-center gap-16 justify-between w-full pt-32'>
        <div className='space-y-5'>
          <h2 className='text-3xl font-bold'>Olá, Simmer {user?.firstName}!</h2>
          <PostForm onPostCreated={handlePostCreated} />
        </div>
        <PostList updatePosts={updatePosts} />
      </main>
    </section>
  );
};

export default Home;
