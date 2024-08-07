import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

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
    <div>
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <div className="comment-header flex items-center">
            <img
              src={comment.user.profilePicture ? `http://localhost:3333${comment.user.profilePicture}` : 'default-avatar.png'}
              alt={`${comment.user.firstName} ${comment.user.lastName}`}
              className="h-8 w-8 rounded-full object-cover flex-shrink-0"
            />
            <p className="ml-2">{comment.user.firstName} {comment.user.lastName}</p>
          </div>
          <small>{new Date(comment.createdAt).toLocaleString()}</small>
          {editingCommentId === comment.id ? (
            <div>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <button onClick={() => handleEditComment(comment.id)}>Salvar</button>
              <button onClick={() => setEditingCommentId(null)}>Cancelar</button>
            </div>
          ) : (
            <p>{comment.content}</p>
          )}
          {(comment.user.id === user?.id || postAuthorId === user?.id) && (
            <>
              <button onClick={() => handleDelete(comment.id)}>Excluir</button>
              <button onClick={() => {
                setEditingCommentId(comment.id);
                setEditedContent(comment.content);
              }}>Editar</button>
            </>
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
