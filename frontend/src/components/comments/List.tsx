import defaultAvatar from '@utils/default-avatar.png';
import plumbob from '@utils/plumbob.png';
import { useAuth } from 'contexts/AuthContext';
import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: User;
}

interface CommentsListProps {
  postId: number;
  updateComments: boolean;
  postAuthorId: number;
}

const CommentsList: React.FC<CommentsListProps> = ({ postId, updateComments, postAuthorId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const { user } = useAuth();

  const fetchComments = async (pageNumber = 1, reset = false) => {
    try {
      const response = await api.get(`/comments/${postId}?page=${pageNumber}&limit=5`);
      if (response.data.data.length < 5) {
        setHasMoreComments(false);
      } else {
        setHasMoreComments(true);
      }
      setComments((prevComments) => reset ? response.data.data : [...prevComments, ...response.data.data]);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    }
  };

  useEffect(() => {
    setComments([]);
    setPage(1);
    setHasMoreComments(true);
    fetchComments(1, true);
  }, [postId, updateComments]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage);
  };

  const handleDelete = async (commentId: number) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
    }
  };

  const handleEditComment = async (commentId: number) => {
    try {
      await api.put(`/comments/${commentId}`, { content: editedContent });
      setComments(comments.map((comment) => (comment.id === commentId ? { ...comment, content: editedContent } : comment)));
      setEditingCommentId(null);
    } catch (error) {
      console.error('Erro ao editar comentário:', error);
    }
  };

  if (!comments.length) {
    return <p>Não há comentários para este post.</p>;
  }

  return (
    <div className='space-y-5'>
      {comments.length ? (<h4 className='text-lg font-medium ml-2'>Comentários</h4>) : null}
      {comments.map((comment) => (
        <div key={comment.id} id="comment-container" className="bg-gray-100 p-4 gap-3 rounded-md flex flex-col">
          <div id="comment-header" className="flex gap-3 items-center">
            <img
              src={comment.user.profilePicture ? `http://localhost:3333${comment.user.profilePicture}` : defaultAvatar}
              alt={`${comment.user.firstName} ${comment.user.lastName}`}
              className="h-9 w-9 rounded-full object-cover flex-shrink-0"
            />
            <div className='flex flex-col gap-1'>
              <div className='flex gap-2'>
                <img src={plumbob} alt='plumbob' width={10} />
                <p className="text-sm font-medium">{comment.user.firstName} {comment.user.lastName}</p>
              </div>
              <small className='text-xs'>{new Date(comment.createdAt).toLocaleString()}</small>
            </div>
          </div>
          {editingCommentId === comment.id ? (
            <div className='space-y-2 mt-3'>
              <textarea
                className='w-full min-h-[10vh]'
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className='space-x-2'>
              <button className='btn-primary hover:scale-100 text-white px-5 text-xs' onClick={() => handleEditComment(comment.id)}>Salvar</button>
              <button className='bg-red-700 text-white rounded-md text-xs py-2 px-3' onClick={() => setEditingCommentId(null)}>Cancelar</button>
              </div>
            </div>
          ) : (
            <p>{comment.content}</p>
          )}
          {(comment.user.id === user?.id || postAuthorId === user?.id) && (
            <div className='space-x-2'>
              <button className='btn-danger px-2 text-xs' onClick={() => handleDelete(comment.id)}>Excluir</button>
              <button className='btn-edit px-2 text-xs' onClick={() => {
                setEditingCommentId(comment.id);
                setEditedContent(comment.content);
              }}>Editar</button>
            </div>
          )}
        </div>
      ))}
      {hasMoreComments && comments.length % 5 === 0 && (
        <div className="flex justify-center">
          <button onClick={handleLoadMore} className="p-2 bg-blue-500 text-white rounded">Carregar mais</button>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
