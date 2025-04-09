import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../hooks/Context';
import { BEARER_TOKEN, tokensPerReward } from '../constants';
import { Rewards, RewardsExtended, RewardType } from '../../../declarations/rentmase_backend/rentmase_backend.did';
import { Principal } from '@dfinity/principal';

const LeaderboardContainer = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 40px 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
   margin-top: 100px;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const LeaderboardTitle = styled.h2`
  color: #008DD5;
  font-size: 28px;
  margin-bottom: 10px;
`;

const TotalUsersText = styled.p`
  color: #555;
  font-size: 16px;
  margin-bottom: 30px;
`;

const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const TableHead = styled.thead`
  background-color: #008DD5;
  color: white;
`;

const TableHeader = styled.th`
  padding: 15px;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
`;

const TableBody = styled.tbody`
  tr:nth-child(even) {
    background-color: #f3f8fb;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #e1f3f8;
  }
`;

const TableData = styled.td`
  padding: 15px;
  border-bottom: 1px solid #eee;
  font-size: 15px;
  color: #333;
  text-align: left;
`;

const TrophyContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 32px;
  margin-right: 15px;
`;

const TrophyWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Trophy = styled.span`
  font-size: 32px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 8px 15px;
  border: 1px solid #008DD5;
  background-color: ${props => props.active ? '#008DD5' : 'white'};
  color: ${props => props.active ? 'white' : '#008DD5'};
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#008DD5' : '#E8F8FF'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: #555;
  font-size: 14px;
`;

const VerifyWidget = styled.div`
  width: 95%;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const VerifyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const VerifyTitle = styled.h3`
  color: #333;
  font-size: 18px;
  margin: 0 0 8px 0;
`;

const VerifyDescription = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0;
  text-align: left;
`;

const VerifyButton = styled.button`
  background-color: #008DD5;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0077b3;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  position: relative;
`;

const ModalTitle = styled.h3`
  color: #008DD5;
  margin-bottom: 20px;
  font-size: 24px;
`;

const ModalText = styled.p`
  color: #555;
  margin-bottom: 15px;
  line-height: 1.6;
`;

const ModalLink = styled.a`
  color: #008DD5;
  text-decoration: none;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const StepDot = styled.div<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#008DD5' : '#D1D1D1'};
  transition: background-color 0.3s;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const NavButton = styled.button`
  padding: 10px 20px;
  background-color: #008DD5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0077b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

// Update RewardsExtendedWithPOH interface
interface RewardsExtendedWithPOH extends RewardsExtended {
  pohScore?: number;
  email: string;
  username: string;
  totalAmountEarned: bigint;
  referrals: bigint;
  user: Principal;
}

// Add these styled components
const ScoreTooltip = styled.span`
  visibility: hidden;
  background-color: #333;
  color: white;
  text-align: center;
  padding: 5px 10px;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 12px;
  white-space: nowrap;
`;

const ScoreContainer = styled.div`
  position: relative;
  cursor: help;

  &:hover ${ScoreTooltip} {
    visibility: visible;
    opacity: 1;
  }
`;

const Leaderboard = () => {
  const { newBackendActor, user } = useAuth();
  const [rewards, setRewards] = useState<RewardsExtendedWithPOH[]>([]);
  const [currentReward, setCurrentReward] = useState<RewardsExtendedWithPOH | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoadingScores, setIsLoadingScores] = useState(false);

  // Update getPohScore function
  const getPohScore = async (userEmail: string) => {
    try {
      const url = `https://publicapi.intract.io/api/pv1/proof-of-humanity/check-identity-score?identityType=Email&identity=${userEmail}`;
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BEARER_TOKEN}`,
      };

    
      const response = await fetch(url, { 
        headers
      });

      if (!response.ok) {
        console.error('POH API Error:', response.status);
        return 0;
      }

      const res = await response.json();
      return res.data ? Number(res.data) : 0;
    } catch (error) {
      console.error('Error fetching POH score:', error);
      return 0;
    }
  };

  useEffect(() => {
    if (newBackendActor) {
       getUsers();
    }
  }, [newBackendActor]);


  // Modify getUsers function to fetch all scores at once
  const getUsers = async () => {
    if (newBackendActor) {
      const _rewardsExtended = await newBackendActor.getRewardsExtended();
      const users = _rewardsExtended[0];
      console.log("new users data :",users)
      setTotalUsers(Number(_rewardsExtended[1]));
       setRewards(users);

      // // Set current user data
      const currentUserData = users.find(
        (u) => u.user.toString() === user?.id.toString()
      );
      setCurrentReward(currentUserData || null);
    }
  };

  const getTrophy = (rank) => {
    if (rank === 1) return '🏆';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  console.log("dddd")

  // Calculate pagination values
  const totalPages = Math.ceil(rewards.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  // Modify renderRows function
  const renderRows = () => {
    const sortedRewards = [...rewards].sort((a, b) => 
      Number(b.totalAmountEarned) - Number(a.totalAmountEarned)
    );
    const paginatedRewards = sortedRewards.slice(startIndex, endIndex);
    const userRank = sortedRewards.findIndex((u) => u.user.toString() === user?.id.toString()) + 1;

    return (
      <>
        {paginatedRewards.map((userReward, index) => (
          <TableRow key={startIndex + index}>
            <TableData>
              <TrophyWrapper>
                <TrophyContainer>{getTrophy(startIndex + index + 1)}</TrophyContainer>
                {startIndex + index + 1}
              </TrophyWrapper>
            </TableData>
            <TableData>{userReward.username}</TableData>
            <TableData>{Number(userReward.totalAmountEarned)}</TableData>
            <TableData>{Number(userReward.referrals)}</TableData>
            <TableData>
              <ScoreContainer>
                {isLoadingScores ? (
                  "Loading..."
                ) : (
                  <>
                    {userReward.isverified ===true ? "👨‍💼" : "🤖"}
                    <ScoreTooltip>
                      POH Score: {userReward.pohScore}
                    </ScoreTooltip>
                  </>
                )}
              </ScoreContainer>
            </TableData>
          </TableRow>
        ))}

        {/* Show current user if not in current page */}
        {currentReward && userRank > startIndex + rowsPerPage && (
          <>
            <TableRow>
              <TableData colSpan={5} style={{ textAlign: 'center', fontSize: '18px' }}>
                ...
              </TableData>
            </TableRow>
            <TableRow>
              <TableData>
                <TrophyWrapper>
                  <TrophyContainer>{getTrophy(userRank)}</TrophyContainer>
                  {userRank}
                </TrophyWrapper>
              </TableData>
              <TableData>{currentReward.username}</TableData>
              <TableData>{Number(currentReward.totalAmountEarned)}</TableData>
              <TableData>{Number(currentReward.referrals)}</TableData>
              <TableData>
                <ScoreContainer>
                  {currentReward.isverified ? (
                    <>
                      👨‍💼
                      {/* <ScoreTooltip>
                        Human Score: {currentReward.pohScore}
                      </ScoreTooltip> */}
                    </>
                  ) : (
                    <>
                      🤖
                      {/* <ScoreTooltip>
                        Bot Score: {currentReward.pohScore}
                      </ScoreTooltip> */}
                    </>
                  )}
                </ScoreContainer>
              </TableData>
            </TableRow>
          </>
        )}
      </>
    );
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderModalContent = () => {
    if (currentStep === 1) {
      return (
        <>
          <ModalTitle>Step 1: Verify on Rentmase</ModalTitle>
          <ModalText>
            Follow these steps to verify your account on Rentmase:
          </ModalText>
          <ModalText>
            1. Sign up or log in to your Rentmase account
          </ModalText>
          <ModalText>
            2. Go to your Profile Settings
          </ModalText>
          <ModalText>
            3. Enter and verify your email address
          </ModalText>
        </>
      );

      
    } else if (currentStep === 2) {
      return (
        <>
          <ModalTitle>Step 2: Email verification on Intract Website</ModalTitle>
          <ModalText>
            Next, verify your email on Intract Website:
          </ModalText>
          <ModalText>
            1. Visit and login to the Intract POH {" "}
            <ModalLink href="https://persona.intract.io/proof-of-humanity" target="_blank">
              website
            </ModalLink>
          </ModalText>
          <ModalText>
            2. On the connected accounts, select the option to connect your email
          </ModalText>
          <ModalText>
            3. Enter your email address from rentmase and click "Connect"
          </ModalText>
          <ModalText>
            4. Enter the OTP to verify your email
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
            <ModalLink href="https://quest.intract.io/quest/67c7397d05b12fb575456313?utm_source=dashboard" target="_blank">
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
          <ModalTitle>Step 3: Complete Verification</ModalTitle>
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
        </>
      );
    }
  };

  return (
    <>
      <LeaderboardContainer>
        <LeaderboardTitle>Leaderboard</LeaderboardTitle>
        <TotalUsersText>Total Users: {totalUsers}</TotalUsersText>
        <LeaderboardTable>
          <TableHead>
            <tr>
              <TableHeader>Rank</TableHeader>
              <TableHeader>User</TableHeader>
              <TableHeader>Tokens Earned</TableHeader>
              <TableHeader>Invited Users</TableHeader>
              <TableHeader>POH</TableHeader>
            </tr>
          </TableHead>
          <TableBody>{renderRows()}</TableBody>
        </LeaderboardTable>

        {/* Pagination Controls */}
        <PaginationContainer>
          <PageButton 
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </PageButton>
          
          <PageInfo>
            Page {currentPage} of {totalPages}
          </PageInfo>
          
          <PageButton 
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </PageButton>
        </PaginationContainer>
      </LeaderboardContainer>

      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            
            <StepIndicator>
              <StepDot active={currentStep === 1} />
              <StepDot active={currentStep === 2} />
              <StepDot active={currentStep === 3} />
              <StepDot active={currentStep === 4} />
            </StepIndicator>

            {renderModalContent()}

            <NavigationButtons>
              {currentStep > 1 && (
                <NavButton onClick={prevStep}>
                  Previous
                </NavButton>
              )}
              {currentStep < 4 ? (
                <NavButton 
                  onClick={nextStep} 
                  style={{ marginLeft: currentStep === 1 ? 'auto' : '0' }}
                >
                  Next
                </NavButton>
              ) : (
                <NavButton 
                  onClick={closeModal}
                  style={{ marginLeft: 'auto' }}
                >
                  Finish
                </NavButton>
              )}
            </NavigationButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default Leaderboard;
