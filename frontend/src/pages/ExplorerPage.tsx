import searchIcon from '@utils/search.svg';
import { useAuth } from 'contexts/AuthContext';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FollowButton from '../components/followers/FollowButton';
import PostList from '../components/posts/List';
import api from '../services/api';
import arrowBack from '@utils/arrow-back.svg';

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

const ExplorerPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [following, setFollowing] = useState<number[]>([]);
  const [loadingFollowing, setLoadingFollowing] = useState<boolean>(true);
  const [searchUser, setSearchUser] = useState<string>('');
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

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
    <section className='bg-custom-bg bg-cover bg-no-repeat bg-center min-h-screen flex flex-col items-center gap-10'>
      <div className="flex flex-col items-center justify-center gap-10 w-full">
        <div className="flex justify-center items-center w-[60vw] gap-3 pt-14 pb-4 relative">
        <Link to="/">
            <img src={arrowBack} alt="Voltar" width={50} className='absolute top-14 left-5'/>
          </Link>
          <div className='flex items-center gap-3'>
            <img src={searchIcon} alt="Procurar" width={20} />
            <div className='relative'>
              <input
                type="text"
                placeholder="Buscar usuário..."
                value={searchUser}
                onChange={(e) => {
                  setSearchUser(e.target.value);
                  setShowDropdown(e.target.value.length > 0);
                }}
                className="min-w-[450px] p-2 border border-gray-500 rounded"
                onFocus={() => setShowDropdown(searchUser.length > 0)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
              {showDropdown && (
                <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((userItem) => (
                      <div key={userItem.id} className="p-4 flex gap-5 border-b border-gray-200">
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
                    ))
                  ) : searchUser.length > 0 && (
                    <div className="p-4 text-gray-500">Nenhum usuário encontrado</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-8 w-full flex flex-col items-center">
        <h2 className="text-lg font-semibold text-center">O que outros Simmers estão aprontando...</h2>
        <PostList />
      </div>
    </section>
  );
};

export default ExplorerPage;
