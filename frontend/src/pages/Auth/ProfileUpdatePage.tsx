import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileInfoUpdate from '../../components/users/ProfileInfoUpdate';
import PasswordUpdate from '../../components/users/PasswordUpdate';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const ProfileUpdatePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleDeleteAccount = async () => {
    if (window.confirm('Você tem certeza de que deseja deletar sua conta?')) {
      try {
        await api.delete(`/users/${user?.id}`);
        signOut();
        navigate('/login');
      } catch (error) {
        console.error('Erro ao deletar conta:', error);
        alert('Erro ao deletar conta');
      }
    }
  };

  return (
    <div>
      <h1>Atualizar Perfil</h1>
      <ProfileInfoUpdate />
      <PasswordUpdate />
      <button onClick={() => navigate('/profile')}>Voltar ao Perfil</button>
      <button onClick={handleDeleteAccount} className="p-2 bg-red-500 text-white rounded mt-4">
        Deletar Conta
      </button>
    </div>
  );
};

export default ProfileUpdatePage;
