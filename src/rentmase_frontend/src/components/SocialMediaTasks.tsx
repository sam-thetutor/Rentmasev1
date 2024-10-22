import styled from "styled-components";
import { useAuth } from "../hooks/Context";
import { useState } from "react";
import { toast } from "react-toastify";

const SocialMediaTasks =({ setOpenTaskModal })=> {
    const { backendActor } = useAuth();
    const [url, setUrl] = useState('');
    const [platform, setPlatform] = useState('');
    const [saving, setSaving] = useState(false);
    const handleSave = async () => {
        if (!url) {
            toast.error('Please fill in all fields');
            return;
        }
        setSaving(true);
        await backendActor.addSocialShereRequest({
            postUrl: url,
            platform
        });
        toast.success('Task submitted successfully');
        setOpenTaskModal(false);
        setSaving(false);
    }

    const handleClose = () => setOpenTaskModal(false);


  return (
    <ModalBackdrop onClick={handleClose}>
    <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>&times;</CloseButton>
        <RegisterContainer>
            <h1>
                <Title>
                    Submit Social Media Task URL
                </Title>
            </h1>
            <RegisterForm>
                <Input type="text" placeholder="Post link"
                 value={url} onChange={(e) => setUrl(e.target.value)} required />
                <Select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    required
                >
                    <option value="">Select Platform</option>
                    <option value="x">X</option>
                    <option value="openchat">Open Chat</option>
                </Select>
              
                <Button type="button" onClick={handleSave}>
                    {saving ? 'Saving...' : 'Save'}
                </Button>
            </RegisterForm>
        </RegisterContainer>
    </ModalContent>
</ModalBackdrop>
  )
}

export default SocialMediaTasks


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
    min-width: 400px;
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


const RegisterContainer = styled.div`
  font-family: 'Poppins', sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    margin-bottom:10px;
    margin-top:10px;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const RegisterForm = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  outline: none;
  transition: border 0.2s ease-in-out;

  &:focus {
    border-color: #008DD5;
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  outline: none;
  transition: border 0.2s ease-in-out;

  &:focus {
    border-color: #008DD5;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #008DD5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
  transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;

  &:hover {
    background-color: #008bb3;
    transform: scale(1.05);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
// Should be just a simple worl like "Sign Up" or "Sign In" with text color #008DD5
const LogoutButton = styled.button`
    background-color: transparent;
    border: none;
    color: #008DD5;
    font-size: 1rem;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.3s ease;
    
    &:hover {
        color: #005f7f;
    }
    `;


const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: #008DD5; /* Change to blue */
  margin-bottom: 30px;
`;