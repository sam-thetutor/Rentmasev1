// src/pages/Profile.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const navigate = useNavigate();

  const handleUpdate = () => {
    // Implement the update logic here
    alert('Profile updated successfully!');
  };

  return (
    <ProfileContainer>
      <h1>My Profile</h1>
      <ProfileForm>
        <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Select value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>
        <Input type="date" placeholder="Birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
        <Button type="button" onClick={handleUpdate}>Update</Button>
      </ProfileForm>
     
      <NavigationButton onClick={() => navigate('/deliveries')}>Orders</NavigationButton>
      <NavigationButton onClick={() => navigate('/travel-bookings')}>Bookings</NavigationButton>
      <NavigationButton onClick={() => navigate('/manage-addresses')}>Manage Addresses</NavigationButton>
    </ProfileContainer>
  );
};

export default Profile;
