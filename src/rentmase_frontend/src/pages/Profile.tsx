// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/Context';
import { UserUpdatePayload } from '../../../declarations/rentmase_backend/rentmase_backend.did';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { BEARER_TOKEN } from '../constants';

// Styled components
const ProfileContainer = styled.div`
  font-family: 'Poppins', sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 100px;
  margin-top: 100px;
  position: relative;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ProfileForm = styled.form`
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

const WalletBalanceDiv = styled.div`
  font-size: 18px;
  color: #008DD5;
  margin: 20px;
`;

const POHBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #008DD5;
  color: white;
  padding: 10px 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: help;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const POHScore = styled.span`
  font-weight: 600;
  font-size: 16px;
`;

const POHTooltip = styled.div<{ visible: boolean }>`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  width: 200px;
  font-size: 14px;
  color: #333;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 100;
`;

const Profile = () => {
  const {tokenBalance} = useSelector((state : RootState) => state.app);
  const { user, isAuthenticated, newBackendActor } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const [pohScore, setPohScore] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated && !user) {
      navigate('/signup');
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setUsername(user.username);
      setEmail(user.email);
      setGender(user.gender[0]);
    }
  }, [user]);

  useEffect(() => {
    const fetchPOHScore = async () => {
      if (user && user.email) {
        try {
          console.log('Fetching POH score for email:', user.email);
          const url = `https://publicapi.intract.io/api/pv1/proof-of-humanity/check-identity-score?identityType=Email&identity=${user.email}`;
          
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${BEARER_TOKEN}`,
            'Accept': 'application/json'
          };

          const response = await fetch(url, { 
            headers,
          });

          console.log('POH Response:', response);
          if (!response.ok) {
            const errorText = await response.json();
            console.error('POH API Error:', response.status, errorText);
            setPohScore(0);
            return;
          }

          const res = await response.json();
          console.log('POH Response data:', res);
          
          if (res.message === "success") {
            setPohScore(Number(res?.data));
          } else {
            console.warn('POH API returned non-success:', res);
            setPohScore(0);
          }
        } catch (error) {
          console.error('Error fetching POH score:', error);
          setPohScore(0);
          if (error instanceof TypeError) {
            toast.error('Network error while fetching POH score');
          }
        }
      }
    };

    fetchPOHScore();
  }, [user]);

  const dobInNanoSeconds = new Date(birthday).getTime() * 1000000;

  const handleUpdate = async () => {
    setSaving(true);

    const isUNameUnique = await newBackendActor.isUserNameUnique(username);
    if (!isUNameUnique) {
      setSaving(false);
      toast.error('Username already taken, please choose another');
      return;
    }
    
    const userPayload: UserUpdatePayload = {
      firstName,
      lastName,
      username,
      email,
      dob: birthday ? [BigInt(dobInNanoSeconds)] : user.dob,
      refferalCode: user.referralCode,
      gender: gender ? [gender] : user.gender,
    };
    await newBackendActor.updateProfile(userPayload);
    toast.success('Profile updated successfully');
    setSaving(false);
  };

  return (
    <div>
      <ProfileContainer>
        <Title>My Profile</Title>
        {pohScore !== null && (
          <POHBadge 
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <POHScore>{pohScore}</POHScore>
            <POHTooltip visible={showTooltip}>
              Your Proof of Humanity score from Intract. This score reflects your verified human status and platform activity.
            </POHTooltip>
          </POHBadge>
        )}
        <ProfileForm>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
          <Input
            type="date"
            placeholder="Birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
          <Button type="button" onClick={handleUpdate}>
            {saving ? 'Saving...' : 'Update'}
          </Button>
        </ProfileForm>
        <NavigationButton onClick={() => navigate('/deliveries')}>Orders</NavigationButton>
        <NavigationButton onClick={() => navigate('/travel-bookings')}>Bookings</NavigationButton>
        <NavigationButton onClick={() => navigate('/manage-addresses')}>Manage Addresses</NavigationButton>
        <div className="">
          <WalletBalanceDiv>Wallet Balance: { }
            {tokenBalance?.balance / 100_000_000} $xRem
          </WalletBalanceDiv>
          <h5>
            Principal  : {user?.id.toString()}
          </h5>
        </div>
      </ProfileContainer>

    </div>
  );
};

export default Profile;
