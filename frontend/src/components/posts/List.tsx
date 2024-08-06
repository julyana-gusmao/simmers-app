// PostList.tsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import CommentsList from '../comments/List';
import CommentForm from '../comments/Form';
import { useAuth } from '../../contexts/AuthContext';

interface Post {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

const PostList: React.FC<{ updatePosts: boolean }> = ({ updatePosts }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const [updateComments, setUpdateComments] = useState<boolean>(false);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await api.delete(`/posts/${postId}`);
      fetchPosts();
    } catch (error) {
      console.error('Erro ao deletar post:', error);
    }
  };

  const handleCommentAdded = () => {
    setUpdateComments(!updateComments); // Alternar o estado para atualizar a lista de comentários
  };

  useEffect(() => {
    fetchPosts();
  }, [updatePosts]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id}>
            <h2>{post.user.firstName} {post.user.lastName}</h2>
            <p>{post.content}</p>
            <small>{new Date(post.createdAt).toLocaleString()}</small>
            {user?.id === post.user.id && (
              <button onClick={() => handleDeletePost(post.id)}>Deletar</button>
            )}
            <CommentsList postId={post.id} updateComments={updateComments} postAuthorId={post.user.id} />
            <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
          </div>
        ))
      ) : (
        <p>Não há posts para exibir.</p>
      )}
    </div>
  );
};

export default PostList;
