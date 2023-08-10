import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import colors from 'styles/colors';
import Button from 'components/Form/Button';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  closeModal: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.5s;
  
  @keyframes fadeIn {
    0% {opacity: 0;}
    100% {opacity: 1;}
  }
`;

const ModalWindow = styled.div`
  width: 80%;
  max-width: 500px;
  background: ${colors.backgroundLighter};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  animation: appear 0.5s;
  color: ${colors.textColor};
  box-shadow: 4px 4px 0px ${colors.bgShadowColor};
  max-height: 80%;
  overflow-y: auto;
  @keyframes appear {
    0% {opacity: 0; transform: scale(0.9);}
    100% {opacity: 1; transform: scale(1);}
  }
  pre {
    white-space: break-spaces;
  }
`;

const Modal: React.FC<ModalProps> = ({ children, isOpen, closeModal }) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  React.useEffect(() => {
    const handleEscPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscPress);
    }

    return () => {
      window.removeEventListener('keydown', handleEscPress);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <Overlay onClick={handleOverlayClick}>
      <ModalWindow>
        {children}
        <Button onClick={closeModal} styles="width: fit-content;float: right;">Close</Button>
      </ModalWindow>
    </Overlay>,
    document.body,
  );
};

export default Modal;
