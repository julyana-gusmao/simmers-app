import React, { useState } from 'react';
import api from '../../services/api';

interface PostFormProps {
  onPostCreated: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/posts', { content });
      setContent('');
      onPostCreated();
    } catch (error) {
      console.error('Erro ao criar post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-5 border-2 border-lightGreen items-center p-4'>
      <textarea
        className='w-[40vw] min-h-[12vh] p-3'
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Conte algo legal..."
        maxLength={500}
      />
      <button type="submit" className='btn-primary w-[200px]'>Postar</button>
    </form>
  );
};

export default PostForm;
