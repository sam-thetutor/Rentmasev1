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
  gap: 12px;
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

const VerifyNowButton = styled.button`
  background-color: white;
  color: #008DD5;
  border: none;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const VerifiedBadge = styled.span`
  background-color: #4caf50;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
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

// Add interface for the props
interface VerificationStatusProps {
  $isVerified: boolean;
}

// Update the styled component with the interface
const VerificationStatus = styled.div<VerificationStatusProps>`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
  padding: 10px;
  border-radius: 8px;
  background: ${props => props.$isVerified ? '#e8f5e9' : '#fff3e0'};
`;

const VerifyButton = styled.button`
  background-color: #008DD5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #0070a8;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const StepDot = styled.div<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#008DD5' : '#ddd'};
  margin: 0 5px;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const NavButton = styled.button`
  padding: 8px 16px;
  background-color: #008DD5;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
`;

const ModalTitle = styled.h2`
  color: #008DD5;
  text-align: center;
  margin-bottom: 20px;
`;

const ModalText = styled.p`
  margin: 10px 0;
  color: #333;
  font-size: 16px;
`;

const ModalLink = styled.a`
  color: #008DD5;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ModalButton = styled.button`
  background-color: #008DD5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin-top: 20px;
  width: 100%;
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const VerificationMessage = styled.div<{ success: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: ${props => props.success ? '#e8f5e9' : '#ffebee'};
  color: ${props => props.success ? '#2e7d32' : '#c62828'};
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
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [verificationLoading, setVerificationLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<null | { success: boolean; message: string }>(null);

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
   
    fetchPOHScore();
    checkVerification();
  }, [user]);


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
          setPohScore(0);
          return;
        }
        const res = await response.json();
      
        if (res.message === "success") {
          setPohScore(Number(res?.data));
        } else {
          setPohScore(0);
        }
      } catch (error) {
        setPohScore(0);
        if (error instanceof TypeError) {
          toast.error('Network error while fetching POH score');
        }
      }
    }
  };

  const checkVerification = async () => {
    console.log(newBackendActor && user)
    if (newBackendActor && user) {
      try {
        setVerificationLoading(true);
        const status = await newBackendActor.checkUserVerification(user.id);
        setIsVerified(status);
      } catch (error) {
        console.error('Error checking verification:', error);
      } finally {
        setVerificationLoading(false);
      }
    }
  };


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

  const handleVerify = async () => {
    if (!user || !newBackendActor) return;
    if(!pohScore) await fetchPOHScore()
    

    try {
      setVerifying(true);
      setVerificationResult(null);
      
      // Get latest POH score
      console.log("User poh verify status :",pohScore)
      if (pohScore >= 90) {
        // Update backend verification status
        await newBackendActor.verifyUser();
        setIsVerified(true);
        setVerificationResult({
          success: true,
          message: "🎉 Verification successful! You are now verified."
        });
        setTimeout(() => setIsModalOpen(false), 2000);
      } else {
        setVerificationResult({
          success: false,
          message: "😔 Your POH score is too low. Please complete more quests to increase your score."
        });
      }
    } catch (error) {
      console.error('Error during verification:', error);
      setVerificationResult({
        success: false,
        message: "❌ Verification failed. Please try again."
      });
    } finally {
      setVerifying(false);
    }
  };

  const renderModalContent = () => {
    if (currentStep === 1) {
      return (
        <>
          <ModalTitle>Step 1: Connect Wallet</ModalTitle>
          <ModalText>
            To verify your humanity, you'll need to:
          </ModalText>
          <ModalText>
            1. Connect your wallet if you haven't already
          </ModalText>
          <ModalText>
            2. Ensure you have enough balance for verification
          </ModalText>
          <ModalText>
            3. Approve the transaction when prompted
          </ModalText>
        </>
      );
    } else if (currentStep === 2) {
      return (
        <>
          <ModalTitle>Step 2: Verify Email</ModalTitle>
          <ModalText>
            Next, we'll need to verify your email:
          </ModalText>
          <ModalText>
            1. Check your email for a verification link
          </ModalText>
          <ModalText>
            2. Click the link to verify your email
          </ModalText>
          <ModalText>
            3. Return to this page once verified
          </ModalText>
        </>
      );
    } else if (currentStep === 3) {
      return (
        <>
          <ModalTitle>Step 3: Complete Quest</ModalTitle>
          <ModalText>
            Complete the quest to earn extra rewards and increase your POH score:
          </ModalText>
          <ModalText>
            1. Visit the quest {' '}
            <ModalLink href="https://persona.intract.io/proof-of-humanity" target="_blank">
              page 
            </ModalLink>
          </ModalText>
          <ModalText>
            2. Complete the quests and score atleast 30 human points
          </ModalText>
          <ModalText>
            3. Mint the POH NFT from the quest page to qualify as human
          </ModalText>
        </>
      );
    } else {
      return (
        <>
          <ModalTitle>Step 4: Complete Verification</ModalTitle>
          <ModalText>
            Final steps to complete your verification:
          </ModalText>
          <ModalText>
            1. Return to your Rentmase profile
          </ModalText>
          <ModalText>
            2. Click on "Verify with Intract"
          </ModalText>
          <ModalText>
            3. Your verification status will be updated automatically
          </ModalText>
          
          {verificationResult && (
            <VerificationMessage success={verificationResult.success}>
              {verificationResult.message}
            </VerificationMessage>
          )}
          
          <ModalButton 
            onClick={handleVerify} 
            disabled={verifying}
          >
            {verifying ? 'Verifying...' : 'Verify Now'}
          </ModalButton>
        </>
      );
    }
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
            {isVerified ? (
              <VerifiedBadge>
                ✓ Verified
              </VerifiedBadge>
            ) : (
              <VerifyNowButton onClick={() => setIsModalOpen(true)}>
                Verify Now
              </VerifyNowButton>
            )}
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
        {/* <VerificationStatus $isVerified={isVerified}>
          {verificationLoading ? (
            'Loading verification status...'
          ) : isVerified ? (
            <>
              <span>✅ Verified</span>
            </>
          ) : (
            <>
              <span>Not verified</span>
              <VerifyButton onClick={handleVerify}>
                Verify Now
              </VerifyButton>
            </>
          )}
        </VerificationStatus> */}
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

      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setIsModalOpen(false)}>&times;</CloseButton>
            
            <StepIndicator>
              <StepDot active={currentStep === 1} />
              <StepDot active={currentStep === 2} />
              <StepDot active={currentStep === 3} />
              <StepDot active={currentStep === 4} />
            </StepIndicator>

            {renderModalContent()}

            <NavigationButtons>
              {currentStep > 1 && (
                <NavButton onClick={() => setCurrentStep(prev => prev - 1)}>
                  Previous
                </NavButton>
              )}
              {currentStep < 4 ? (
                <NavButton 
                  onClick={() => setCurrentStep(prev => prev + 1)} 
                  style={{ marginLeft: currentStep === 1 ? 'auto' : '0' }}
                >
                  Next
                </NavButton>
              ) : (
                <NavButton 
                  onClick={() => setIsModalOpen(false)}
                  style={{ marginLeft: 'auto' }}
                >
                  Finish
                </NavButton>
              )}
            </NavigationButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default Profile;
