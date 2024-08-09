import React, { useState } from 'react';
import api from '../../services/api';

interface FollowButtonProps {
  userId: number;
  isFollowing: boolean;
  onFollowChange: () => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, isFollowing, onFollowChange }) => {
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await api.delete(`/followers/unfollow/${userId}`);
      } else {
        await api.post('/followers/follow', { userIdToFollow: userId });
      }
      onFollowChange();
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir o usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-2 text-white font-semibold rounded ${
        isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <p className='text-sm'>{isFollowing ? 'Deixar de Seguir' : 'Seguir'}</p>
    </button>
  );
};

export default FollowButton;
