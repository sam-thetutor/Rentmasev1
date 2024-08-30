import { useState, useEffect, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/Context';
import RegisterLoginModal from './RegisterLoginModal';
import { toast } from 'react-toastify';
import { UserPayload } from '../../../../declarations/rentmase_backend/rentmase_backend.did';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  padding-left: 250px;
  padding-right: 250px;

  @media (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Select = styled.select`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #ccc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 10px;
  margin-right: 10px;
`;

const NavigationButton = styled(Button)`
  background-color: #00B5E2;
`;

const Register = () => {
    const { isAuthenticated, backendActor, user } = useAuth();
    const [inviteCode, setInviteCode] = useState('');
    const location = useLocation();
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

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
            referrerCode: inviteCode ? [inviteCode] : []
        };

        const result = await backendActor.registerUser(user);
        if ("ok" in result) {
            toast.success('Registered successfully');
            setSaving(false);
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
                    Registration
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
                    {inviteCode && <Input type="text" placeholder="Invite Code (optional)" value={inviteCode} disabled />}
                    <Button type="button" onClick={handleRegister}>
                        {saving ? 'Saving...' : 'Register'}
                    </Button>
                </RegisterForm>

                <NavigationButton onClick={() => navigate('/deliveries')}>Orders</NavigationButton>
                <NavigationButton onClick={() => navigate('/travel-bookings')}>Bookings</NavigationButton>
                <NavigationButton onClick={() => navigate('/manage-addresses')}>Manage Addresses</NavigationButton>
            </RegisterContainer>
            <RegisterLoginModal {...{ openModal, setOpenModal }} />
        </div>
    )
}

export default Register