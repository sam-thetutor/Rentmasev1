import { useEffect, useRef } from 'react'
import { useAuth } from '../hooks/Context';


import styled from 'styled-components';

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

const LoginModal = ({ openModal, setOpenModal }) => {
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
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold shadow-sm hover:bg-secondary ring-1 ring-inset ring-gray-300 hover:bg-secondary sm:mt-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:col-start-2"
            onClick={login}
          >
            Internet Identity
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-secondary sm:col-start-1 sm:mt-0"
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

export default LoginModal;