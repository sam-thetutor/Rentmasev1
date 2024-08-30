import { useEffect, useRef } from 'react'


import styled from 'styled-components';
import { useAuth } from '../../hooks/Context';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensures modal is on top */
`;


const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 15px; /* Rounded corners */
  width: 500px; /* Fixed width */
  max-width: 90%; /* Responsive width */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  position: relative; /* Positioning for close button */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: transparent;
  border: none;
  color: #00B5E2;
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    color: black;
  }
`;

const RegisterLoginModal = ({ openModal, setOpenModal }) => {
  const handleClose = () => setOpenModal(false);

  if (!openModal) return null;

  const { login, nfidlogin, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setOpenModal(false)
    }
  }, [isAuthenticated])

  const cancelButtonRef = useRef(null)

  return (
    <ModalBackdrop onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>&times;</CloseButton>
        <div className="">
          Login with one of the following methods to continue with registration:
        </div>
        <div className="">
          <button
            type="button"
            className=""
            onClick={login}
          >
            Internet Identity
          </button>
          <button
            type="button"
            className=""
            onClick={nfidlogin}
            ref={cancelButtonRef}
          > 
            NFID
          </button>
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default RegisterLoginModal;