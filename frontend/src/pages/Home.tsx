import React, { useState } from 'react';
import PostForm from '../components/posts/Form';
import PostList from '../components/posts/List';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
    <div>
      <h1>Feed Pessoal</h1>
      <PostForm onPostCreated={handlePostCreated} />
      <PostList updatePosts={updatePosts} />
      <Link to="/users">Ver Todos os Usuários</Link>
      <Link to="/profile">Editar Perfil</Link>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
