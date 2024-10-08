import React, { useState } from 'react';
import api from '../../services/api';
import deleteButton from '@utils/delete.svg';

interface CommentFormProps {
  postId: number;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await api.post('/comments', {
        postId,
        content,
      });

      setContent('');
      setIsCommenting(false);
      setSuccessMessage('Comentado com sucesso!');
      onCommentAdded();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  return (
    <div className='flex flex-col items-center'>
      {successMessage && <small className='text-green-500 font-medium'>{successMessage}</small>}
      {isCommenting ? (
        <form onSubmit={handleSubmit} className='flex flex-col gap-2 my-3 bg-gray-100 rounded-md p-3'>
          <textarea
            value={content}
            className='min-h-[10vh] min-w-[20vw] text-sm text-black p-3 border border-black rounded-md'
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <div className='flex justify-between gap-4 p-2'>
            <button type="button" onClick={() => setIsCommenting(false)}>
            <img src={deleteButton} alt="Deletar" width={30} />
            </button>
            <button className='bg-green-700 rounded-md px-3 text-white' type="submit"><small>Comentar</small></button>
          </div>
        </form>
      ) : (
        <button className='btn-secondary w-[200px] hover:scale-100 text-xs text-white' onClick={() => setIsCommenting(true)}>Adicionar comentário</button>
      )}
    </div>
  );
};

export default CommentForm;
