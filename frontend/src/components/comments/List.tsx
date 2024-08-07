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
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/${postId}`);
      setComments(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await api.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
    }
  };

  const handleEditComment = async (commentId: number) => {
    try {
      await api.put(`/comments/${commentId}`, { content: editedContent });
      fetchComments();
      setEditingCommentId(null);
    } catch (error) {
      console.error('Erro ao editar comentário:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId, updateComments]);

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
    </div>
  );
};

export default CommentsList;
