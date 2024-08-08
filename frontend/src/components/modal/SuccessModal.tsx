import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import successIcon from '@utils/success.svg';

interface SuccessModalProps {
  onClose: () => void;
  message: string;
  redirectPath: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose, message, redirectPath }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer1 = setTimeout(() => {
      document.getElementById('loading-text')!.innerText = message;
      document.getElementById('success-icon')!.style.display = 'block';
    }, 2000);

    const timer2 = setTimeout(() => {
      onClose();
      navigate(redirectPath);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate, onClose, message, redirectPath]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg text-center min-w-[25vw] max-w-md">
        <div id="loading-text" className="text-xl font-semibold mb-4">Carregando...</div>
        <img
          id="success-icon"
          src={successIcon}
          alt="Success"
          className="w-16 h-16 mx-auto mt-4"
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default SuccessModal;
