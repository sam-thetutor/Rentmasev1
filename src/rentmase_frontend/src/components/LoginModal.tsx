import { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/Context';
import styled from 'styled-components';
// Direct URL paths for images in the public folder
const internetIdentityIcon = "/images/InternetIdentity.svg";
const nfidIcon = "/images/NFID.svg";

interface StyledButtonProps {
  bgColor?: string;
  color?: string;
  hoverColor?: string;
  onClick: () => void;
}

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #1f2a48;
  padding: 30px;
  border-radius: 15px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0px;   /* Move it down a bit */
  right: 5px;  /* Move it inwards a bit */
  background-color: transparent;
  border: none;
  color: white;
  font-size: 1.8rem; /* Increased size for better visibility */
  cursor: pointer;
  padding: 5px; /* Add some padding to increase the clickable area */

  &:hover {
    color: #ccc;
  }
`;


const WalletOption = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background-color: #293b5f;
  border-radius: 8px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3d4e7b;
  }

  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin-right: 15px;
  }

  span {
    color: white;
    font-size: 16px;
    font-weight: 500;
  }
`;

const LoginModal = ({ openModal, setOpenModal }) => {
  const handleClose = () => setOpenModal(false);

  if (!openModal) return null;

  const { login, nfidlogin, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setOpenModal(false);
    }
  }, [isAuthenticated]);

  const cancelButtonRef = useRef(null);

  return (
    <ModalBackdrop onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>&times;</CloseButton>

        <WalletOption onClick={nfidlogin} ref={cancelButtonRef}>
          <img src={nfidIcon} alt="NFID" />
          <span>Email</span>
        </WalletOption>

        <WalletOption onClick={login}>
          <img src={internetIdentityIcon} alt="Internet Identity" />
          <span>Internet Identity</span>
        </WalletOption>

      </ModalContent>
    </ModalBackdrop>
  );
};

export default LoginModal;
