import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FollowButton from '../components/followers/FollowButton';
import { useAuth } from '../contexts/AuthContext';
import PostList from '../components/posts/List';
import api from '../services/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [following, setFollowing] = useState<number[]>([]);
  const [loadingFollowing, setLoadingFollowing] = useState<boolean>(true);
  const [searchUser, setSearchUser] = useState<string>('');
  const { user } = useAuth();

  const fetchUsers = async (searchTerm: string) => {
    try {
      const response = await api.get(`/users?search=${searchTerm}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
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
    fetchFollowing();
  }, []);

  useEffect(() => {
    if (searchUser.length > 0) {
      fetchUsers(searchUser);
    } else {
      setUsers([]);
    }
  }, [searchUser]);

  const handleFollowChange = () => {
    fetchFollowing();
  };

  const filteredUsers = users.filter((userItem) =>
    `${userItem.firstName} ${userItem.lastName}`.toLowerCase().includes(searchUser.toLowerCase())
  );

  if (loadingFollowing) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex">
      <div className="w-1/2 p-4">
        <Link to="/">Voltar para a página principal</Link>
        <input
          type="text"
          placeholder="Buscar usuário..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="mb-4 p-2 border border-gray-400 rounded"
        />
        {filteredUsers.map((userItem) => (
          <div key={userItem.id} className="mb-4 p-4 border border-gray-300 rounded shadow">
            <h2 className="text-lg font-semibold">
              <Link to={`/users/${userItem.id}`}>{userItem.firstName} {userItem.lastName}</Link>
            </h2>
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

      <div className="w-1/2 p-4">
        <h2 className="text-lg font-semibold">Posts</h2>
        <PostList />
      </div>
    </div>
  );
};

export default UsersPage;
