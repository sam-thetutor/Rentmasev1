// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/Context';
import { UserUpdatePayload } from '../../../declarations/rentmase_backend/rentmase_backend.did';
import { toast } from 'react-toastify';

const ProfileContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  padding-left: 250px;
  padding-right: 250px;

  @media (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const ProfileForm = styled.form`
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
