import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PublicUser } from '../../../declarations/rentmase_backend/rentmase_backend.did';
import { useAuth } from '../hooks/Context';
import { tokensPerReward } from '../constants';

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
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (backendActor) {
      getUsers();
    }
  }, [backendActor]);

  const getUsers = async () => {
    if (backendActor) {
      const publicUsers = await backendActor.getPublicUsers();
      publicUsers.sort((a, b) => b.rewards.length - a.rewards.length);
      setUsers(publicUsers);

      // If the current user exists, find their rank
      const currentUserData = publicUsers.find((u) => u.firstName === user?.firstName);
      setCurrentUser(currentUserData);
    }
  };

  const getTrophy = (rank) => {
    if (rank === 1) return '🏆';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  const renderRows = () => {
    const top10Users = users.slice(0, 10);
    const userRank = users.findIndex((u) => u.firstName === currentUser?.firstName) + 1;

    return (
      <>
        {/* Display Top 10 users */}
        {top10Users.map((user, index) => (
          <TableRow key={index}>
            <TableData>
              <TrophyWrapper>
                <TrophyContainer>{getTrophy(index + 1)}</TrophyContainer>
                {index + 1}
              </TrophyWrapper>
            </TableData>
            <TableData>{user.firstName}</TableData>
            <TableData>{user.rewards.length * tokensPerReward}</TableData>
            <TableData>{user.referrals.length}</TableData>
          </TableRow>
        ))}

        {/* Add ellipses row if there are more than 10 users */}
        {users.length > 10 && (
          <TableRow>
            <TableData colSpan={4} style={{ textAlign: 'center', fontSize: '18px' }}>
              ...
            </TableData>
          </TableRow>
        )}

        {/* Display current user row if not in top 10 */}
        {userRank > 10 && currentUser && (
          <TableRow>
            <TableData>
              <TrophyWrapper>
                <TrophyContainer>{getTrophy(userRank)}</TrophyContainer>
                {userRank}
              </TrophyWrapper>
            </TableData>
            <TableData>{currentUser.firstName}</TableData>
            <TableData>{currentUser.rewards.length * tokensPerReward}</TableData>
            <TableData>{currentUser.referrals.length}</TableData>
          </TableRow>
        )}
      </>
    );
  };

  return (
    <LeaderboardContainer>
      <LeaderboardTitle>Leaderboard</LeaderboardTitle>
      <TotalUsersText>Total Users: {users.length}</TotalUsersText>
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
