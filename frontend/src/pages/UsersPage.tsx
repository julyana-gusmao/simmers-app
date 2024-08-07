import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FollowButton from '../components/followers/FollowButton';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface Post {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
  };
  commentsCount: number;
}

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [following, setFollowing] = useState<number[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [loadingFollowing, setLoadingFollowing] = useState<boolean>(true);
  const [searchUser, setSearchUser] = useState<string>('');
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

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts/all');
      setPosts(response.data);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoadingPosts(false);
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
    fetchPosts();
    fetchFollowing();
  }, []);

  const handleFollowChange = () => {
    fetchFollowing();
  };

  const filteredUsers = users.filter((userItem) =>
    `${userItem.firstName} ${userItem.lastName}`.toLowerCase().includes(searchUser.toLowerCase())
  );

  if (loadingUsers || loadingFollowing || loadingPosts) {
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
        {posts.map((post) => (
          <div key={post.id} className="mb-4 p-4 border border-gray-300 rounded shadow">
            <div className="post-header flex gap-3 items-center">
              <img
                src={post.user.profilePicture ? `http://localhost:3333${post.user.profilePicture}` : 'default-avatar.png'}
                alt={`${post.user.firstName} ${post.user.lastName}`}
                className="h-16 w-16 rounded-full object-cover flex-shrink-0"
              />
              <div className='flex flex-col'>
                <h5 className="text-xl font-medium">{post.user.firstName} {post.user.lastName}</h5>
                <small className='font-medium'>{new Date(post.createdAt).toLocaleString()}</small>
              </div>
            </div>
            <p>{post.content}</p>
            <p className='bg-blue-500'>{post.commentsCount} comentários</p>
            <div className='flex justify-center text-center m-auto min-w-[150px] btn-edit px-5 rounded-xl'>
              <button onClick={() => navigate(`/posts/${post.id}`)}>Ver Post</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
