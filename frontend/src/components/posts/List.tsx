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
    profilePicture: string | null;
  };
}

const PostList: React.FC<{ updatePosts: boolean }> = ({ updatePosts }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const [updateComments, setUpdateComments] = useState<boolean>(false);
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

  const handleCommentAdded = () => {
    setUpdateComments(!updateComments);
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
                <h5 className="text-xl font-medium">{post.user.firstName} {post.user.lastName}</h5>
              </div>


              {editingPostId === post.id ? (
                <div>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <button onClick={() => handleEditPost(post.id)}>Salvar</button>
                  <button onClick={() => setEditingPostId(null)}>Cancelar</button>
                </div>
              ) : (
                <div className='bg-[#ecffee] rounded-md py-5 px-3'>
                  <p>{post.content}</p>
                </div>
              )}


              <div className='flex justify-between items-center'>
                <small className='font-medium'>{new Date(post.createdAt).toLocaleString()}</small>
                {user?.id === post.user.id && (
                  <div className='space-x-3'>
                    <button className="btn-edit px-3" onClick={() => {
                      setEditingPostId(post.id);
                      setEditedContent(post.content);
                    }}><small>Editar</small></button>
                    <button className='btn-danger px-3' onClick={() => handleDeletePost(post.id)}><small>Deletar</small></button>
                  </div>
                )}
              </div>
            </div>
            <div className='flex justify-center text-center m-auto min-w-[150px] btn-edit px-5 rounded-xl'>
              <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
            </div>
            <CommentsList postId={post.id} updateComments={updateComments} postAuthorId={post.user.id} />
          </div>
        ))
      ) : (
        <p>Não há posts para exibir.</p>
      )}
    </div>
  );
};

export default PostList;
