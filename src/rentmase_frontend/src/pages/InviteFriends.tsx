// src/pages/InviteFriends.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaEnvelope, FaLink } from 'react-icons/fa';
import { useAuth } from '../hooks/Context';
import { tokensPerReward } from '../constants';
import { Reward, UserUpdatePayload } from '../../../declarations/rentmase_backend/rentmase_backend.did';
import RedeemTokens from '../components/RedeemTokens';
import { toast } from 'react-toastify';

const InviteContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  padding-left: 250px;
  padding-right: 250px;
  text-align: center;

  @media (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const ReferralCode = styled.div`
  margin: 20px 0;
  padding: 50px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: inline-block;
  width: 100%;
  max-width: 400px;

  @media (max-width: 768px) {
    padding: 20px;
  }
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

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }
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

  @media (max-width: 768px) {
    font-size: 14px;
    width: 35px;
    height: 35px;
  }
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

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
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

  @media (max-width: 768px) {
    height: 1px;
    width: 80%;
    border-left: none;
    border-top: 1px solid #ccc;
    margin: 20px 0;
  }
`;

const ReferralLink = styled.div`
  margin: 20px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: inline-block;
  width: 100%;
  max-width: 400px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const RedeemButton = styled.button`
  padding: 10px;
  // background-color: #00B5E2;
  background-color: #ccc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 5px;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }
`;

const CustomizedInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  margin: 5px;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }
`;

const CustmiseCodeDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const SaveButton = styled.button`
  padding: 10px;
  background-color: #00B5E2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 5px;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }
`;

const InviteFriends = () => {
  const { user, setUser,isAuthenticated, backendActor } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [unclaimedRewards, setUnclaimedRewards] = useState<Reward[]>([]);
  const [customCode, setCustomCode] = useState<string>("");
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    if (isAuthenticated && backendActor) {
      (async () => {
        const rewards = await backendActor.getUnclaimedRewards();
        if ("ok" in rewards) {
          setUnclaimedRewards(rewards.ok);
        }
      })();
    }
  }, [isAuthenticated, backendActor]);

  useEffect(() => {
    if (user) {
      setCustomCode(user.referralCode);
    }
  }, [user]);


  const handleSaveCustomCode = async () => {
    if (isAuthenticated && backendActor && user) {
      if (saving) return
      if (customCode === user.referralCode) {
        return;
      }
      if (customCode.length < 4) {
        toast.error("Custom code must be at least 4 characters");
        return;
      }
      setSaving(true);
      const isUnque = await backendActor.isReferralCodeUnique(customCode);
      if (!isUnque) {
        setSaving(false);
        toast.error("Custom code is already taken, please choose another");
        return;
      }
      const updatedUser: UserUpdatePayload = {
        firstName : user.firstName,
        lastName : user.lastName,
        dob : user.dob,
        gender: user.gender,
        email : user.email,
        refferalCode : customCode,
      };
      const result = await backendActor.updateProfile(updatedUser);
      setSaving(false);
      if ("ok" in result) {
        setUser(result.ok);
       toast.success("Custom code saved successfully");
      } else {
        toast.error("Failed to save custom code");
      }
    } else {
      toast.error("You are not authenticated");
    }
  }


  return (
    <InviteContainer>
      <h1>Hello {user?.firstName}, Invite Friends</h1>
      <p>Invite your friends to RentMase & earn points</p>
      <ReferralCode>
        <p>Your referral code</p>
        <h3>{user?.referralCode}</h3>
        <CopyButton>Copy</CopyButton>
        <ReferralLink>
          <p>Your referral link</p>
          <h3>https://rentmase.com/signup?invite={user?.referralCode}</h3>
          <CopyButton>Copy</CopyButton>
        </ReferralLink>
        <h3>
          Customize your referral code
        </h3>
        <CustmiseCodeDiv>
          <CustomizedInput type="text" value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
           />
          <SaveButton
            onClick={handleSaveCustomCode}
          >
            {saving ? "Saving..." : "Save"}
          </SaveButton>
        </CustmiseCodeDiv>
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
          <h3>{user?.referrals.length}</h3>
        </StatItem>
        <VerticalLine />
        <StatItem>
          <p>Total Points Earned</p>
          <h3>{user?.rewards.length}</h3>
          <h5>Worth : {user?.rewards.length * tokensPerReward} REM</h5>
        </StatItem>
        <VerticalLine />
        <StatItem>
          <p>
            Available Points
          </p>
          <h3>
            {unclaimedRewards.length}
          </h3>
          <div className="">
            <h5>Worth : {unclaimedRewards.length * tokensPerReward} {" "}
               REM</h5>
            <RedeemButton
              disabled
              onClick={() => setOpenModal(true)}
            >Redeem</RedeemButton>

          </div>
        </StatItem>
      </StatsSection>
      {openModal && <RedeemTokens {...{openModal, setOpenModal, unclaimedRewards}}/>}
    </InviteContainer>
  );
};

export default InviteFriends;
