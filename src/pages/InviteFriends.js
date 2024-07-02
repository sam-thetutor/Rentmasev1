// src/pages/InviteFriends.js
import React from 'react';
import styled from 'styled-components';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaEnvelope, FaLink } from 'react-icons/fa';

const InviteContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  padding-left: 250px;
  padding-right: 250px;
  text-align: center;
`;

const ReferralCode = styled.div`
  margin: 20px 0;
  padding: 50px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: inline-block;
`;

const CopyButton = styled.button`
  padding: 10px;
  background-color: #00B5E2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 5px;
`;

const SocialButton = styled.button`
  padding: 10px;
  background-color: #00B5E2;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  margin: 5px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SocialButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const StatsSection = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 60px;
  gap: 30px; /* Adjust the gap as needed */
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const VerticalLine = styled.div`
  border-left: 1px solid #ccc;
  height: 100px;
  margin: 0 20px; /* Adjust the margin as needed */
`;

const InviteFriends = () => {
  return (
    <InviteContainer>
      <h1>Invite Friends</h1>
      <p>Invite your friends to RentMase & earn tokens</p>
      <ReferralCode>
        <p>Your referral code</p>
        <h3>UNDER MAINTENANCE</h3>
        <CopyButton>Copy</CopyButton>
      </ReferralCode>
      <SocialButtons>
        <SocialButton><FaFacebookF /></SocialButton>
        <SocialButton><FaTwitter /></SocialButton>
        <SocialButton><FaWhatsapp /></SocialButton>
        <SocialButton><FaEnvelope /></SocialButton>
        <SocialButton><FaLink /></SocialButton>
      </SocialButtons>
      <StatsSection>
        <StatItem>
          <p>Friends Invited</p>
          <h3>0</h3>
        </StatItem>
        <VerticalLine />
        <StatItem>
          <p>Friends Joined</p>
          <h3>0</h3>
        </StatItem>
        <VerticalLine />
        <StatItem>
          <p>Tokens Earned</p>
          <h3>0</h3>
        </StatItem>
      </StatsSection>
    </InviteContainer>
  );
};

export default InviteFriends;
