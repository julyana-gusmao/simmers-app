import React, { useState } from 'react';
import api from '../../services/api';

interface PostFormProps {
  onPostCreated: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/posts', { content });
      setContent('');
      setSuccessMessage('Postado com sucesso!');
      onPostCreated();
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (error) {
      console.error('Erro ao criar post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 min-h-[28vh] border-2 rounded-xl bg-mediumGreen items-center p-4 relative z-0'>
      <textarea
        className='w-[40vw] min-h-[12vh] p-3'
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Conte algo legal..."
        maxLength={500}
      />
      <button type="submit" className='btn-secondary w-[200px]'>Postar</button>
      {successMessage && <p className='text-gray-800 font-medium absolute top-[165px]'>{successMessage}</p>}
    </form>
  );
};

export default PostForm;
