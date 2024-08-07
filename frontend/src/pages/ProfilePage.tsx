import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import PostList from '@components/posts/List';
import arrowBack from '@utils/arrow-back.svg';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  profilePicture: string | null;
}

const ProfilePage: React.FC = () => {
  const { user: currentUser, signOut } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [followersCount, setFollowersCount] = useState<number>(0);

  const fetchUserDetails = async (userId: number) => {
    try {
      const response = await api.get(`/users/${userId}`);
      setUser(response.data.user);
      setFollowersCount(response.data.followersCount);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserDetails(Number(id));
    } else if (currentUser) {
      fetchUserDetails(currentUser.id);
    }
  }, [id, currentUser]);

  const handleLogout = async () => {
    try {
      await api.delete('/auth/logout');
      signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const formattedBirthDate = new Date(user.birthDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  });

  return (
    <div className='flex flex-col gap-2'>
      <header className='p-10 shadow-m flex gap-3 items-center bg-lightGreen'>
        <button
          className="mb-auto size-10"
          onClick={() => navigate(-1)}
        >
          <img src={arrowBack} alt="Voltar" />
        </button>
        <div className='flex items-center gap-8 ml-5'>
          <img
            src={user.profilePicture ? `http://localhost:3333${user.profilePicture}` : 'default-avatar.png'}
            alt="Profile"
            className="h-40 w-40 rounded-full object-cover"
          />
          <div id='infos' className='flex flex-col gap-3 '>
            <h2 className='font-bold text-4xl'>{user.firstName} {user.lastName}</h2>
            <small>Aniversário: {formattedBirthDate}</small>
            <p className='font-medium'>{followersCount} Seguidores</p>
          </div>
        </div>
        {currentUser?.id === user.id && (
          <div className='ml-auto flex flex-col gap-5 items-center'>
            <div className='space-x-5'>
              <button className='btn-edit px-5' onClick={() => navigate('/profile/edit')}>Editar Perfil</button>
              <button className='btn-danger px-5' onClick={handleLogout}>Sair</button>
            </div>
          </div>
        )}
      </header>
      <div id='content' className='px-10 flex flex-col items-center gap-5'>
        <h2 className="mt-8 text-lg font-semibold">Postagens</h2>
        <PostList userId={user.id} />
      </div>
    </div>
  );
};

export default ProfilePage;
