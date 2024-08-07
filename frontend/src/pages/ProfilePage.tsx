import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  profilePicture: string | null;
}

interface Post {
  id: number;
  content: string;
  createdAt: string;
  user: User;
  commentsCount: number;
}

const ProfilePage: React.FC = () => {
  const { user: currentUser, signOut } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followersCount, setFollowersCount] = useState<number>(0);

  const fetchUserDetails = async (userId: number) => {
    try {
      const response = await api.get(`/users/${userId}`);
      setUser(response.data.user);
      setPosts(response.data.user.posts);
      setFollowersCount(response.data.followersCount);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserDetails(Number(id));
    } else if (currentUser) {
      fetchUserDetails(currentUser.id);
    }
  }, [id, currentUser]);

  const handleLogout = async () => {
    try {
      await api.delete('/auth/logout');
      signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        await api.delete(`/users/${currentUser?.id}`);
        signOut();
        navigate('/login');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error deleting account');
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <img
        src={user.profilePicture ? `http://localhost:3333${user.profilePicture}` : 'default-avatar.png'}
        alt="Profile"
        className="h-40 w-40 border-2 border-white rounded-full object-cover"
      />
      <h2>{user.firstName} {user.lastName}</h2>
      <p>Birth Date: {user.birthDate}</p>
      <p>Followers: {followersCount}</p>
      {currentUser?.id === user.id && (
        <>
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/profile/edit')}>Edit Profile</button>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleDeleteAccount}>Delete Account</button>
        </>
      )}
      <h2 className="mt-8 text-lg font-semibold">Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="mb-4 p-4 border border-gray-300 rounded shadow">
          <div className="post-header flex gap-3 items-center">
            <img
              src={post.user.profilePicture ? `http://localhost:3333${post.user.profilePicture}` : 'default-avatar.png'}
              alt={`${post.user.firstName} ${post.user.lastName}`}
              className="h-16 w-16 rounded-full object-cover flex-shrink-0"
            />
            <div className='flex flex-col'>
              <h5 className="text-xl font-medium">{post.user.firstName} {post.user.lastName}</h5>
              <small className='font-medium'>{new Date(post.createdAt).toLocaleString()}</small>
            </div>
          </div>
          <p>{post.content}</p>
          <p className='bg-blue-500'>{post.commentsCount} comentários</p>
          <div className='flex justify-center text-center m-auto min-w-[150px] btn-edit px-5 rounded-xl'>
            <button onClick={() => navigate(`/posts/${post.id}`)}>Ver Post</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfilePage;
