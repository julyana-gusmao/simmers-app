import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommentForm from '../components/comments/Form';
import CommentsList from '../components/comments/List';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import plumbob from '@utils/plumbob.png';

interface Post {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
  };
}

const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updateComments, setUpdateComments] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>('');

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

  const handleEditPost = async () => {
    if (!post) return;
    try {
      await api.put(`/posts/${post.id}`, { content: editedContent });
      setPost((prevPost) => (prevPost ? { ...prevPost, content: editedContent, updatedAt: new Date().toISOString() } : prevPost));
      setEditing(false);
    } catch (error) {
      console.error('Erro ao editar o post:', error);
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;
    try {
      await api.delete(`/posts/${post.id}`);
      navigate('/');
    } catch (error) {
      console.error('Erro ao deletar o post:', error);
    }
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
    <section className='bg-custom-bg bg-cover bg-center min-h-screen flex flex-col items-center py-10'>
      <div className='w-[60vw] m-auto bg-white p-6 rounded-md'>
        <div className='border border-black/30 px-5 py-10 flex flex-col gap-5 rounded-md mb-6'>
          <div className="post-header flex gap-3 items-center">
            <img
              src={post.user.profilePicture ? `http://localhost:3333${post.user.profilePicture}` : 'default-avatar.png'}
              alt={`${post.user.firstName} ${post.user.lastName}`}
              className="h-16 w-16 rounded-full object-cover flex-shrink-0"
            />
            <div className='flex flex-col'>
              <div className='flex gap-2'>
                <h5 className="text-lg font-medium">{post.user.firstName} {post.user.lastName}</h5>
                <img src={plumbob} alt='plumbob' width={15} />
              </div>
              <small className='font-medium'>{new Date(post.createdAt).toLocaleString()}</small>
              {new Date(post.updatedAt).getTime() > new Date(post.createdAt).getTime() && (
                <small className='text-gray-400'>Post editado</small>
              )}
            </div>
          </div>
          <div className='bg-[#ecffee] rounded-md py-5 px-3'>
            {editing ? (
              <>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <button className="btn-edit px-3 mt-2" onClick={handleEditPost}>Salvar</button>
                <button className="btn-danger px-3 mt-2" onClick={() => setEditing(false)}>Cancelar</button>
              </>
            ) : (
              <p>{post.content}</p>
            )}
          </div>
          {currentUser?.id === post.user.id && !editing && (
            <div className='flex space-x-3'>
              <button className="btn-edit px-3" onClick={() => {
                setEditing(true);
                setEditedContent(post.content);
              }}>Editar</button>
              <button className="btn-danger px-3" onClick={handleDeletePost}>Deletar</button>
            </div>
          )}
        </div>
        <div className='flex flex-col gap-10'>
          <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
          <CommentsList postId={post.id} updateComments={updateComments} postAuthorId={post.user.id} />
        </div>
      </div>
      <button
        className="mb-2 mt-7 p-2 btn-secondary w-[200px] text-white rounded"
        onClick={() => navigate(-1)}
      >
        Voltar
      </button>
    </section>
  );
};

export default PostDetails;
