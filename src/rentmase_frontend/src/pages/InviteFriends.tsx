import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaEnvelope, FaLink } from 'react-icons/fa';
import { useAuth } from '../hooks/Context';
import { tokensPerReward } from '../constants';
import { Reward, UserUpdatePayload } from '../../../declarations/rentmase_backend/rentmase_backend.did';
import RedeemTokens from '../components/RedeemTokens';
import { toast } from 'react-toastify';

// Invite Container Styles
const InviteContainer = styled.div`
  font-family: 'Poppins', sans-serif;
  padding: 40px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
  margin-top: 100px;

  @media (max-width: 768px) {
    padding: 20px;
    max-width: 90%;
  }
`;

const SectionTitle = styled.h1`
  color: #008DD5;
  font-size: 26px;
  margin-bottom: 10px;
`;

const SubTitle = styled.p`
  color: #555;
  font-size: 16px;
  margin-bottom: 30px;
`;

const ReferralCodeContainer = styled.div`
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
`;

const ReferralTitle = styled.p`
  color: #555;
  font-size: 16px;
`;

const ReferralCode = styled.h3`
  font-size: 24px;
  color: #333;
  margin: 10px 0;
`;

const CopyButton = styled.button`
  padding: 10px 20px;
  background-color: #008DD5;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #006bb3;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }
`;

const SocialButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
`;

const SocialButton = styled.button`
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #008DD5;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #006bb3;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    width: 40px;
    height: 40px;
  }
`;

const StatsSection = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 20px;
  margin-top: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatTitle = styled.p`
  color: #555;
  font-size: 16px;
  margin-bottom: 5px;
`;

const StatValue = styled.h3`
  font-size: 24px;
  color: #333;
  margin: 0;
`;

const CustomizeReferral = styled.div`
  margin-top: 40px;
  text-align: center;
`;

const CustomizedInput = styled.input`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  max-width: 300px;
  margin-bottom: 10px;
  font-size: 16px;
`;

const SaveButton = styled(CopyButton)`
  background-color: #008DD5;
  margin: 10px auto 0 auto;

  &:hover {
    background-color: #008BB2;
  }
`;

const RedeemButton = styled(SaveButton)`
  background-color: #666;
  cursor: not-allowed;

  &:hover {
    background-color: #666;
  }
`;

// Task List Styles
const TaskSection = styled.div`
  margin-top: 40px;
  text-align: left;
`;

const TaskTable = styled.div`
  display: table;
  width: 100%;
  margin-top: 20px;
`;

const TaskRow = styled.div`
  display: table-row;
  margin-bottom: 10px;
`;

const TaskColumn = styled.div`
  display: table-cell;
  padding: 10px;
  border: 1px solid #ddd;
`;

const TaskButton = styled.button`
  background-color: #008DD5;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #008BB2;
  }
`;
// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
  text-align: center;
`;

const ModalTitle = styled.h3`
  font-size: 22px;
  margin-bottom: 20px;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  background-color: #008DD5;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: #008BB2;
  }
`;
const InviteFriends = () => {
  const { user, setUser, isAuthenticated, backendActor } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [unclaimedRewards, setUnclaimedRewards] = useState<Reward[]>([]);
  const [customCode, setCustomCode] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy'); // State to track the copy status
  const [copyLinkStatus, setCopyLinkStatus] = useState('Copy'); // State for the referral link copy
  const [modalTask, setModalTask] = useState(""); // Track the task for which the link is submitted
  const [link, setLink] = useState(""); // Input field for link submission
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

  const handleCopy = (text, setStatus) => {
    navigator.clipboard.writeText(text).then(() => {
      setStatus('Copied!');
      setTimeout(() => setStatus('Copy'), 2000); // Reset the status after 2 seconds
    });
  };

  const handleSaveCustomCode = async () => {
    if (isAuthenticated && backendActor && user) {
      if (saving) return;
      if (customCode === user.referralCode) return;
      if (customCode.length < 4) {
        toast.error("Custom code must be at least 4 characters");
        return;
      }
      setSaving(true);
      const isUnique = await backendActor.isReferralCodeUnique(customCode);
      if (!isUnique) {
        setSaving(false);
        toast.error("Custom code is already taken, please choose another");
        return;
      }
      const updatedUser: UserUpdatePayload = {
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob,
        gender: user.gender,
        email: user.email,
        refferalCode: customCode,
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
  };

  return (
    <InviteContainer>
      <SectionTitle>Hello {user?.firstName}, <br /> Invite Friends</SectionTitle>
      <SubTitle>Invite your friends to RentMase & earn $RENT</SubTitle>

      <ReferralCodeContainer>
        <ReferralTitle>Your referral code</ReferralTitle>
        <ReferralCode>{user?.referralCode}</ReferralCode>
        <CopyButton onClick={() => handleCopy(user?.referralCode, setCopyStatus)}>
          {copyStatus}
        </CopyButton>

        <ReferralTitle>Your referral link</ReferralTitle>
        <ReferralCode>https://rentmase.com/signup?invite={user?.referralCode}</ReferralCode>
        <CopyButton onClick={() => handleCopy(`https://rentmase.com/signup?invite=${user?.referralCode}`, setCopyLinkStatus)}>
          {copyLinkStatus}
        </CopyButton>

        <CustomizeReferral>
          <ReferralTitle>Customize your referral code</ReferralTitle>
          <CustomizedInput type="text" value={customCode} onChange={(e) => setCustomCode(e.target.value)} />
          <SaveButton onClick={handleSaveCustomCode}>
            {saving ? "Saving..." : "Save"}
          </SaveButton>
        </CustomizeReferral>
      </ReferralCodeContainer>

      <SocialButtons>
        <SocialButton><FaFacebookF /></SocialButton>
        <SocialButton><FaTwitter /></SocialButton>
        <SocialButton><FaWhatsapp /></SocialButton>
        <SocialButton><FaEnvelope /></SocialButton>
        <SocialButton><FaLink /></SocialButton>
      </SocialButtons>

      <StatsSection>
        <StatItem>
          <StatTitle>Friends Invited</StatTitle>
          <StatValue>{user?.referrals.length}</StatValue>
        </StatItem>
        <StatItem>
          <StatTitle>Total $RENT Earned</StatTitle>
          <StatValue>{user?.rewards.length}</StatValue>
          <p>Worth: *** $REM</p>
          <p>The $Rent earned will be converted to $REM at SNS at a yet to be determined ratio</p>
        </StatItem>
        <StatItem>
          <StatTitle>Available $RENT</StatTitle>
          <StatValue>{unclaimedRewards.length}</StatValue>
          <p>Worth: {unclaimedRewards.length * tokensPerReward} REM</p>
          <RedeemButton onClick={() => setOpenModal(true)} disabled>Redeem</RedeemButton>
        </StatItem>
      </StatsSection>

      <TaskSection>
        <SectionTitle>Complete Tasks & Earn More</SectionTitle>
        <TaskTable>
          <TaskRow>
            <TaskColumn><strong>Task</strong></TaskColumn>
            <TaskColumn><strong>Description & Reward</strong></TaskColumn>
            <TaskColumn><strong>Verify</strong></TaskColumn>
          </TaskRow>
          <TaskRow>
            <TaskColumn>Share on Social Media</TaskColumn>
            <TaskColumn>Share RentMase on any social platform and earn 50 $RENT</TaskColumn>
            <TaskColumn><TaskButton>Verify</TaskButton></TaskColumn>
          </TaskRow>
          <TaskRow>
            <TaskColumn>Leave a Review</TaskColumn>
            <TaskColumn>Submit a review of your experience and earn 30 $RENT</TaskColumn>
            <TaskColumn><TaskButton>Verify</TaskButton></TaskColumn>
          </TaskRow>
          <TaskRow>
            <TaskColumn>Invite a Friend</TaskColumn>
            <TaskColumn>Invite a friend who signs up and earns 100 $RENT</TaskColumn>
            <TaskColumn><TaskButton>Verify</TaskButton></TaskColumn>
          </TaskRow>
        </TaskTable>
      </TaskSection>

      {openModal && <RedeemTokens {...{ openModal, setOpenModal, unclaimedRewards }} />}
    </InviteContainer>
  );
};

export default InviteFriends;
