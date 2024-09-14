import { useState, useEffect, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/Context';
import RegisterLoginModal from './RegisterLoginModal';
import { toast } from 'react-toastify';
import { UserPayload } from '../../../../declarations/rentmase_backend/rentmase_backend.did';
import styled from 'styled-components';

// Styled components
const RegisterContainer = styled.div`
  font-family: 'Poppins', sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    margin-bottom:100px;
    margin-top:100px;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const RegisterForm = styled.form`
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

const NavigationButton = styled(Button)`
  background-color: transparent;
  color: #008DD5;
  border: 2px solid #008DD5;
  margin-right: 10px;

  &:hover {
    background-color: #008DD5;
    color: white;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: #008DD5; /* Change to blue */
  margin-bottom: 30px;
`;

const Register = () => {
    const { isAuthenticated, backendActor, user , setUser} = useAuth();
    const [inviteCode, setInviteCode] = useState('');
    const location = useLocation();
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [inputInviteCode, setInputInviteCode] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate('/profile');
        }
    }, [user, isAuthenticated]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const invite = params.get('invite');
        if (invite) {
            setInviteCode(invite);
        }
    }, [location]);

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        if (!firstName || !lastName || !email) {
            toast.error('Please fill in all fields');
            return;
        }
        setSaving(true);
        let referralCode: string;
        let isUnique = false;

        do {
            referralCode = generateReferralCode(firstName);
            isUnique = await backendActor.isReferralCodeUnique(referralCode);
        } while (!isUnique);

        const dobInNanoSeconds = new Date(dob).getTime() * 1000000;

        const user: UserPayload = {
            firstName,
            lastName,
            email,
            referralCode,
            dob: dob ? [BigInt(dobInNanoSeconds)] : [],
            gender : gender ? [gender] : [],
            referrerCode: inputInviteCode ? [inputInviteCode] : inviteCode ? [inviteCode] : []
        };

        const result = await backendActor.registerUser(user);
        if ("ok" in result) {
            toast.success('Registered successfully');
            setSaving(false);
            setUser(result.ok);
            navigate('/profile');
        } else {
            setSaving(false);
            toast.error('Failed to register user');
        }

    };

    useEffect(() => {
        if (isAuthenticated) {
            setOpenModal(false);
        } else {
            setOpenModal(true);
        }
    }, [isAuthenticated]);
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



    return (
        <div>
            <RegisterContainer>
                <h1>
                <Title>Sign Up</Title>
                </h1>
                <RegisterForm>
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
                </RegisterForm>

                {/* <NavigationButton onClick={() => navigate('/deliveries')}>Orders</NavigationButton>
                <NavigationButton onClick={() => navigate('/travel-bookings')}>Bookings</NavigationButton>
                <NavigationButton onClick={() => navigate('/manage-addresses')}>Manage Addresses</NavigationButton> */}
            </RegisterContainer>
            <RegisterLoginModal {...{ openModal, setOpenModal }} />
        </div>
    )
}

export default Register