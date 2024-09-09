// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/Context';
import { UserUpdatePayload } from '../../../declarations/rentmase_backend/rentmase_backend.did';
import { toast } from 'react-toastify';

const ProfileContainer = styled.div`
  font-family: 'Poppins', sans-serif;
  padding: 40px;
  background-color: #f5f5f5;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ProfileHeading = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-weight: 600;
`;

const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1rem;
  color: #333;
  outline: none;

  &:focus {
    border-color: #00b5e2;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1rem;
  color: #333;

  &:focus {
    border-color: #00b5e2;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #00b5e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #008bb2;
  }
`;

const NavigationButton = styled(Button)`
  background-color: transparent;
  color: #00b5e2;
  border: 1px solid #00b5e2;
  margin-top: 10px;

  &:hover {
    background-color: #00b5e2;
    color: white;
  }
`;

const Profile = () => {
  const { user, isAuthenticated, backendActor } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState( '');
  const [email, setEmail] = useState('');
  const [saving , setSaving] = useState(false);

  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !user) {
        navigate('/signup');
    }
}, [user, isAuthenticated]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setGender(user.gender[0]);  }
  }, [user]);

  const dobInNanoSeconds = new Date(birthday).getTime() * 1000000;

  const handleUpdate = async () => {
    setSaving(true);
    const userPayload : UserUpdatePayload = {
      firstName,
      lastName,
      email,
      dob: birthday ? [BigInt(dobInNanoSeconds)] : user.dob,
      refferalCode: user.referralCode,
      gender :gender ? [gender] : user.gender,
    };
    await backendActor.updateProfile(userPayload);
    toast.success('Profile updated successfully');
    setSaving(false);
  };

  return (
    <ProfileContainer>
      <h1>My Profile</h1>
      <ProfileForm>
        <Input type="text" placeholder="Full Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <Input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Select value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>
        <Input type="date" placeholder="Birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
        <Button type="button" onClick={handleUpdate}>
          {saving ? 'Saving...' : 'Update'}
        </Button>
      </ProfileForm>
     
      <NavigationButton onClick={() => navigate('/deliveries')}>Orders</NavigationButton>
      <NavigationButton onClick={() => navigate('/travel-bookings')}>Bookings</NavigationButton>
      <NavigationButton onClick={() => navigate('/manage-addresses')}>Manage Addresses</NavigationButton>
    </ProfileContainer>
  );
};

export default Profile;
