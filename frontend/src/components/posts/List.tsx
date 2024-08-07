import comment from '@utils/comment.svg';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

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
  commentsCount: number;
}

const PostList: React.FC<{ updatePosts: boolean }> = ({ updatePosts }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');

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

  const handleEditPost = async (postId: number) => {
    try {
      await api.put(`/posts/${postId}`, { content: editedContent });
      fetchPosts();
      setEditingPostId(null);
    } catch (error) {
      console.error('Erro ao editar post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [updatePosts]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className='w-[60vw]'>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="flex flex-col gap-2 bg-white p-3 border border-black">
            <div className='border border-black/30 p-5 flex flex-col gap-5 rounded-md mb-6'>
              <div className="post-header flex gap-3 items-center">
                <img
                  src={post.user.profilePicture ? `http://localhost:3333${post.user.profilePicture}` : 'default-avatar.png'}
                  alt={`${post.user.firstName} ${post.user.lastName}`}
                  className="h-16 w-16 rounded-full object-cover flex-shrink-0"
                />

                <div className='flex flex-col'>
                  <h5 className="text-xl font-medium">{post.user.firstName} {post.user.lastName}</h5>
                  <small className='font-medium'>{new Date(post.createdAt).toLocaleString()}</small>
                  {new Date(post.updatedAt).getTime() > new Date(post.createdAt).getTime() && <small className='text-gray-400'>Post editado</small>}
                </div>

                {user?.id === post.user.id && (
                  <div className='ml-auto space-x-3'>
                    <button className="btn-edit px-3" onClick={() => {
                      setEditingPostId(post.id);
                      setEditedContent(post.content);
                    }}><small>Editar</small></button>
                    <button className='btn-danger px-3' onClick={() => handleDeletePost(post.id)}><small>Deletar</small></button>
                  </div>
                )}

              </div>

              {editingPostId === post.id ? (
                <div>
                  <textarea
                    className='bg-[#ecffee] border-2 border-black/70 rounded-md py-5 px-3 w-full'
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <div className='mr-auto space-x-2'>
                    <button className="btn-edit px-3" onClick={() => handleEditPost(post.id)}><small>Salvar</small></button>
                    <button className="btn-danger px-3" onClick={() => setEditingPostId(null)}><small>Cancelar</small></button>
                  </div>
                </div>
              ) : (
                <div className='bg-[#ecffee] rounded-md py-5 px-3'>
                  <p>{post.content}</p>
                </div>
              )}

              <div className='flex text-center justify-end gap-5 w-full px-5 rounded-xl'>
                
                <button id='comments' onClick={() => navigate(`/posts/${post.id}`)}>
                  <div className='flex gap-1 items-center'>
                    <p className='text-lg'>
                      {post.commentsCount}
                    </p>
                    <img src={comment} alt="comment button" />
                  </div>
                </button>

                <button className="btn-secondary" onClick={() => navigate(`/posts/${post.id}`)}>Ver Post</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Não há posts para exibir.</p>
      )}
    </div>
  );
};

export default PostList;
