import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../hooks/Context';
import { tokensPerReward } from '../constants';
import { Rewards } from '../../../declarations/rentmase_backend/rentmase_backend.did';

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

const Leaderboard = () => {
  const { backendActor, user } = useAuth();
  const [rewards, setRewards] = useState<Rewards[]>([]);
  const [currentReward, setCurrentReward] = useState<Rewards | null>(null);

  useEffect(() => {
    if (backendActor) {
      getUsers();
    }
  }, [backendActor]);

  const getUsers = async () => {
    if (backendActor) {
      const _rewards = await backendActor.getRewards();
      _rewards.sort((a, b) => b.rewards.length - a.rewards.length);
      setRewards(_rewards);

      // If the current user exists, find their rank
      const currentUserData = _rewards.find((u) => u.user.toString() === user?.id.toString());
      setCurrentReward(currentUserData);
    }
  };

  const getTrophy = (rank) => {
    if (rank === 1) return '🏆';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  const renderRows = () => {
    const top10Users = rewards.slice(0, 10);
    const userRank = rewards.findIndex((u) => u.user.toString() === user?.id.toString()) + 1;

    return (
      <>
        {/* Display Top 10 rewards */}
        {top10Users.map((userReward, index) => (
          <TableRow key={index}>
            <TableData>
              <TrophyWrapper>
                <TrophyContainer>{getTrophy(index + 1)}</TrophyContainer>
                {index + 1}
              </TrophyWrapper>
            </TableData>
            <TableData>{userReward.userName}</TableData>
            <TableData>{Number(userReward.totalAmount)}</TableData>
            <TableData>{userReward.rewards.length}</TableData>
          </TableRow>
        ))}

        {/* Add ellipses row if there are more than 10 rewards */}
        {rewards.length > 10 && (
          <TableRow>
            <TableData colSpan={4} style={{ textAlign: 'center', fontSize: '18px' }}>
              ...
            </TableData>
          </TableRow>
        )}

        {/* Display current user row if not in top 10 */}
        {userRank > 10 && currentReward && (
          <TableRow>
            <TableData>
              <TrophyWrapper>
                <TrophyContainer>{getTrophy(userRank)}</TrophyContainer>
                {userRank}
              </TrophyWrapper>
            </TableData>
            <TableData>{currentReward.userName}</TableData>
            <TableData>{Number(currentReward.totalAmount)}</TableData>
            <TableData>{currentReward.rewards.length}</TableData>
          </TableRow>
        )}
      </>
    );
  };

  return (
    <LeaderboardContainer>
      <LeaderboardTitle>Leaderboard</LeaderboardTitle>
      <TotalUsersText>Total Users: {rewards.length}</TotalUsersText>
      <LeaderboardTable>
        <TableHead>
          <tr>
            <TableHeader>Rank</TableHeader>
            <TableHeader>User</TableHeader>
            <TableHeader>Tokens Earned</TableHeader>
            <TableHeader>Invited Users</TableHeader>
          </tr>
        </TableHead>
        <TableBody>{renderRows()}</TableBody>
      </LeaderboardTable>
    </LeaderboardContainer> 
  );
};

export default Leaderboard;
