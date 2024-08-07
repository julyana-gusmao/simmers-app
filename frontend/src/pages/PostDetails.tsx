import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CommentForm from '../components/comments/Form';
import CommentsList from '../components/comments/List';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

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
}

const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [updateComments, setUpdateComments] = useState<boolean>(false);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Erro ao buscar o post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = () => {
    setUpdateComments(!updateComments);
  };

  useEffect(() => {
    fetchPost();
  }, [id, updateComments]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!post) {
    return <div>Post não encontrado.</div>;
  }

  return (
    <div className='w-[60vw] m-auto bg-white p-3 border border-black rounded-md'>
      <div className='border border-black/30 p-5 flex flex-col gap-5 rounded-md mb-6'>
        <div className="post-header flex gap-3 items-center">
          <img
            src={post.user.profilePicture ? `http://localhost:3333${post.user.profilePicture}` : 'default-avatar.png'}
            alt={`${post.user.firstName} ${post.user.lastName}`}
            className="h-16 w-16 rounded-full object-cover flex-shrink-0"
          />
          <h5 className="text-xl font-medium">{post.user.firstName} {post.user.lastName}</h5>
        </div>
        <div className='bg-[#ecffee] rounded-md py-5 px-3'>
          <p>{post.content}</p>
        </div>
        <small className='font-medium'>{new Date(post.createdAt).toLocaleString()}</small>
      </div>
      <CommentsList postId={post.id} updateComments={updateComments} postAuthorId={post.user.id} />
      <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
    </div>
  );
};

export default PostDetails;
