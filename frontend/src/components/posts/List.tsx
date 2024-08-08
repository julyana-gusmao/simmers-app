import comment from '@utils/comment.svg';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
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
  commentsCount: number;
}

const PostList: React.FC<{ userId?: number; updatePosts?: boolean }> = ({ userId, updatePosts }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');

  const fetchPosts = async (page: number, append: boolean = false) => {
    try {
      const url = userId
        ? `/users/${userId}/posts?page=${page}&limit=5`
        : `/posts/all?page=${page}&limit=5`;

      const response = await api.get(url);
      const fetchedPosts = response.data;

      setPosts((prevPosts) => append ? [...prevPosts, ...fetchedPosts] : fetchedPosts);
      if (fetchedPosts.length < 5) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Erro ao deletar post:', error);
    }
  };

  const handleEditPost = async (postId: number) => {
    try {
      await api.put(`/posts/${postId}`, { content: editedContent });
      setPosts(posts.map(post => (post.id === postId ? { ...post, content: editedContent, updatedAt: new Date().toISOString() } : post)));
      setEditingPostId(null);
    } catch (error) {
      console.error('Erro ao editar post:', error);
    }
  };

  const loadMorePosts = () => {
    setLoadingMore(true);
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    setPage(1);
    fetchPosts(1);
  }, [userId, updatePosts]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page, true);
    }
  }, [page]);

  if (loading && page === 1) {
    return <div>Carregando...</div>;
  }

  return (
    <div className='w-[60vw]'>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="mb-5 flex flex-col gap-2 bg-white p-3 border border-black/20 rounded-xl">
            <div className='p-2 flex flex-col gap-5 rounded-md mb-6'>
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
                <div className='space-y-3'>
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
                    <p className='text-lg'>{post.commentsCount}</p>
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
      {hasMore && (
        <div className="text-center">
          <button onClick={loadMorePosts} className="btn-secondary mb-5" disabled={loadingMore}>
            {loadingMore ? 'Carregando...' : 'Carregar Mais'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;
