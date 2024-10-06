import { FormEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../hooks/Context";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserPayload } from "../../../declarations/rentmase_backend/rentmase_backend.did";


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

const SignUpModal = ({ openSignUpModal, setOpenSignUpModal }) => {
    const { isAuthenticated, backendActor, user, setUser, logout } = useAuth();
    const [inviteCode, setInviteCode] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [inputInviteCode, setInputInviteCode] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const handleClose = () => setOpenSignUpModal(false);

    if (!openSignUpModal) return null;


    useEffect(() => {
        if (isAuthenticated && user) {
            setOpenSignUpModal(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const invite = params.get('invite');
        if (invite) {
            setInviteCode(invite);
        }
    }, [location]);

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !username) {
            toast.error('Please fill in all fields');
            return;
        }
        setSaving(true);
        const isUNameUnique = await backendActor.isUserNameUnique(username);
        if (!isUNameUnique) {
            setSaving(false);
            toast.error('Username already taken, please choose another');
            return;
        }
        let referralCode: string;
        let isUnique = false;

        do {
            referralCode = generateReferralCode(firstName);
            isUnique = await backendActor.isReferralCodeUnique(referralCode);
        } while (!isUnique);

        const dobInNanoSeconds = new Date(dob).getTime() * 1000000;

        const user: UserPayload = {
            username,
            firstName,
            lastName,
            email,
            referralCode,
            dob: dob ? [BigInt(dobInNanoSeconds)] : [],
            gender: gender ? [gender] : [],
            referrerCode: inputInviteCode ? [inputInviteCode] : inviteCode ? [inviteCode] : []
        };
        const result = await backendActor.registerUser(user);
        if ("ok" in result) {
            toast.success('Registered successfully');
            setSaving(false);
            setUser(result.ok);
            setOpenSignUpModal(false);
            navigate('/profile');
        } else {
            setSaving(false);
            toast.error('Failed to register user');
        }
    };

    const generateReferralCode = (userId: string): string => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const codeLength = 7;
        let randomPart = '';

        for (let i = 0; i < codeLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomPart += characters[randomIndex];
        }
        return randomPart;
    }

    const handleLogout = async () => {
        logout();
        setOpenSignUpModal(false);
    }
    return (
        <ModalBackdrop onClick={handleClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={handleClose}>&times;</CloseButton>
                <RegisterContainer>
                    <h1>
                        <Title>Sign Up</Title>
                    </h1>
                    <RegisterForm>
                        <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        <Input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        <Input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastname(e.target.value)} required />
                        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                        <Select value={gender} onChange={(e) => setGender(e.target.value)} required>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </Select>
                        <Input type="date" placeholder="Birthday" value={dob} onChange={(e) => setDob(e.target.value)} required />
                        {!inviteCode && <Input type="text" placeholder="Invite Code (optional)" value={inputInviteCode}
                            onChange={(e) => setInputInviteCode(e.target.value)}
                        />}
                        <Button type="button" onClick={handleRegister}>
                            {saving ? 'Saving...' : 'Register'}
                        </Button>
                        <LogoutButton onClick={handleLogout}
                        >Logout</LogoutButton>
                    </RegisterForm>

                    {/* <NavigationButton onClick={() => navigate('/deliveries')}>Orders</NavigationButton>
                <NavigationButton onClick={() => navigate('/travel-bookings')}>Bookings</NavigationButton>
                <NavigationButton onClick={() => navigate('/manage-addresses')}>Manage Addresses</NavigationButton> */}
                </RegisterContainer>
            </ModalContent>
        </ModalBackdrop>
    )
}

export default SignUpModal