import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import FollowButton from '../components/followers/FollowButton';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [following, setFollowing] = useState<number[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [loadingFollowing, setLoadingFollowing] = useState<boolean>(true);
  const { user } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchFollowing = async () => {
    try {
      const response = await api.get('/followers/following');
      const followingIds = response.data.map((follow: { userId: number }) => follow.userId);
      setFollowing(followingIds);
    } catch (error) {
      console.error('Erro ao buscar seguidores:', error);
    } finally {
      setLoadingFollowing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFollowing();
  }, []);

  const handleFollowChange = () => {
    fetchFollowing();
  };

  if (loadingUsers || loadingFollowing) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <Link to="/">Voltar para a página principal</Link>
      {users.map((userItem) => (
        <div key={userItem.id}>
          <h2>{userItem.firstName} {userItem.lastName}</h2>
          {userItem.id !== user?.id && (
            <FollowButton
              userId={userItem.id}
              isFollowing={following.includes(userItem.id)}
              onFollowChange={handleFollowChange}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default UsersPage;
