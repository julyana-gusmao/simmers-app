import React, { useState } from 'react';
import api from '../../services/api';

interface CommentFormProps {
  postId: number;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await api.post('/comments', {
        postId,
        content,
      });

      setContent('');
      setIsCommenting(false);
      onCommentAdded();
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  return (
    <div>
      {isCommenting ? (
        <form onSubmit={handleSubmit} className='flex flex-col gap-2 my-3'>
          <textarea
            value={content}
            className='min-h-[10vh] min-w-[20vw] text-sm text-black p-3'
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <div className='flex justify-between px-5 py-2'>
          <button className='text-red-500' type="button" onClick={() => setIsCommenting(false)}>X</button>
          <button className='bg-green-700 rounded-md px-5' type="submit"><small>Comentar</small></button>
          </div>
        </form>
      ) : (
        <button className='btn-secondary hover:scale-100 px-5 text-xs text-white' onClick={() => setIsCommenting(true)}>Adicionar comentário</button>
      )}
    </div>
  );
};

export default CommentForm;
