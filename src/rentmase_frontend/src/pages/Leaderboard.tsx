import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PublicUser, User } from '../../../declarations/rentmase_backend/rentmase_backend.did';
import { useAuth } from '../hooks/Context';
import { tokensPerReward } from '../constants';

// Container for the Leaderboard
const LeaderboardContainer = styled.div`
  width: 80%;
  margin: 50px auto;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

// Table styling
const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

// Table Head styling
const TableHead = styled.thead`
  background-color: #00B5E2;
  color: white;
`;

// Table Header Cell styling
const TableHeader = styled.th`
  padding: 15px;
  font-size: 1rem;
  border-bottom: 2px solid #ddd;
`;

// Table Body styling
const TableBody = styled.tbody`
  background-color: #f9f9f9;
`;

// Table Row styling
const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
  &:hover {
    background-color: #e0f7fa;
  }
`;

// Table Data Cell styling
const TableData = styled.td`
  padding: 15px;
  border-bottom: 1px solid #ddd;
  font-size: 0.9rem;
`;

// Sample Button styling (optional, if you want actions on the leaderboard)
const Button = styled.button`
  background-color: #00B5E2;
  border: 1px solid #00B5E2;
  color: white;
  padding: 10px 15px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 15px;
  font-size: 0.8rem;

  &:hover {
    background-color: white;
    color: black;
  }
`;

const Leaderboard = () => {
  const { backendActor } = useAuth();
  const [users, setUsers] = useState<PublicUser[]>([]);

  useEffect(() => {
if (backendActor) {
      getUsers();
    }
  }, [backendActor]);

  const getUsers = async () => {
    if (backendActor) {
      const users = await backendActor.getPublicUsers();
      //sort users by rewards
      users.sort((a, b) => b.rewards.length - a.rewards.length);
      setUsers(users);
    }
  };

  return (
    <LeaderboardContainer>
      <h2>Leaderboard</h2>
      <LeaderboardTable>
        <TableHead>
          <tr>
            <TableHeader>Rank</TableHeader>
            <TableHeader>User</TableHeader>
            <TableHeader>Tokens Earned</TableHeader>
            <TableHeader>Invited Users</TableHeader>
          </tr>
        </TableHead>
        <TableBody>
          {users?.map((user, index) => (
            <TableRow key={index}>
              <TableData>{index + 1}</TableData>
              <TableData>{user.firstName}</TableData>
              <TableData>{user.rewards.length * tokensPerReward}</TableData>
              <TableData>{user.referrals.length}</TableData>
            </TableRow>
          ))}
        </TableBody>
      </LeaderboardTable>
    </LeaderboardContainer> 
  );
};

export default Leaderboard;
