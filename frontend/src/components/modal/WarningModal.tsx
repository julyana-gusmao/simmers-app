import spinner from '@utils/spinner.gif';
import React, { useState } from 'react';

interface WarningModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ message, onConfirm, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsConfirmed(true);
      setTimeout(() => {
        onConfirm();
        setIsConfirmed(false);
        onCancel();
      }, 600);
    }, 500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg text-center min-w-[25vw] space-y-4">
        {!isLoading && !isConfirmed && (
          <>
            <div className="text-xl font-semibold">{message}</div>
            <div className="flex justify-center gap-4">
              <button className="btn-danger px-4 py-2" onClick={handleConfirm}>Apagar</button>
              <button className="btn-secondary px-4 py-2" onClick={onCancel}>Cancelar</button>
            </div>
          </>
        )}
        {isLoading && (
          <img src={spinner} alt="Loading" className="w-16 h-16 mx-auto mt-4" />
        )}
        {isConfirmed && (
          <div className="text-xl font-semibold">Apagado com sucesso!</div>
        )}
      </div>
    </div>
  );
};

export default WarningModal;
