import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/Context';
import { toast } from 'react-toastify';
import { Rewards, RewardType } from '../../../../declarations/rentmase_backend/rentmase_backend.did';
import RedeemTokens from '../../components/RedeemTokens';



const calculateRewardTotals = (rewards: Array<RewardType>) => {
    let totals = {
        SocialShare: BigInt(0),
        ReviewReward: BigInt(0),
        Signup: BigInt(0),
        Referral: BigInt(0),
    };

    rewards.forEach(reward => {
        if ('SocialShare' in reward) {
            totals.SocialShare += reward.SocialShare.amount;
        } else if ('ReviewReward' in reward) {
            totals.ReviewReward += reward.ReviewReward.amount;
        } else if ('Signup' in reward) {
            totals.Signup += reward.Signup.amount;
        } else if ('Referral' in reward) {
            totals.Referral += reward.Referral.amount;
        }
    });

    return totals;
};

const RewardsPage = () => {
    const { backendActor } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const [rewards, setRewards] = useState<Rewards | null>(null);
    const [loading, setLoading] = useState(false);
    const [totals, setTotals] = useState({
        SocialShare: BigInt(0),
        ReviewReward: BigInt(0),
        Signup: BigInt(0),
        Referral: BigInt(0),
    });

    useEffect(() => {
        if (backendActor) {
            getRewards();
        }
    }, [backendActor]);

    const getRewards = async () => {
        setLoading(true);
        const res = await backendActor.getUserRewards();
        if ("ok" in res) {
            setLoading(false);
            setRewards(res.ok);
            setTotals(calculateRewardTotals(res.ok.rewards));
        } else {
            console.error("Error fetching rewards: ", res.err);
            toast.error("Error fetching rewards");
        }

    }

    return (
        <>
            {loading && (
                <LoadingContainer>
                    <p>Loading...</p>
                </LoadingContainer>
            )}
            {rewards && <RewardsContainer>
                <RewardsTitle>
                    Your Rewards, {rewards.username}
                </RewardsTitle>
                <StatsSection>
                    <StatBox>
                        <StatLabel>Total Rewards Earned</StatLabel>
                        <StatValue>{Number(rewards.totalAmountEarned)} $Rent</StatValue>
                    </StatBox>
                    <StatBox>
                        <StatLabel>Current Balance</StatLabel>
                        <StatValue>{Number(rewards.balance)} $Rent</StatValue>
                    </StatBox>
                </StatsSection>

                <RewardCategoriesTitle>Reward Categories</RewardCategoriesTitle>
                <RewardsTable>
                    <TableHead>
                        <tr>
                            <TableHeader>Reward Type</TableHeader>
                            <TableHeader>Total Earned</TableHeader>
                        </tr>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableData>Social Share</TableData>
                            <TableData>{Number(totals.SocialShare)} $Rent</TableData>
                        </TableRow>
                        <TableRow>
                            <TableData>Review Reward</TableData>
                            <TableData>{Number(totals.ReviewReward)} $Rent</TableData>
                        </TableRow>
                        <TableRow>
                            <TableData>Signup Bonus</TableData>
                            <TableData>{Number(totals.Signup)} $Rent</TableData>
                        </TableRow>
                        <TableRow>
                            <TableData>Referral Reward</TableData>
                            <TableData>{Number(totals.Referral)} $Rent</TableData>
                        </TableRow>
                    </TableBody>
                </RewardsTable>

                <RedeemButton
                    disabled
                    onClick={() => setOpenModal(true)}
                >Redeem Your Rewards</RedeemButton>
            </RewardsContainer>}
            {openModal && <RedeemTokens {...{ openModal, setOpenModal, rewards }} />}
        </>
    );
};

export default RewardsPage;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  p {
    font-size: 20px;
    color: #333;
  }
`;

const RewardsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const RewardsTitle = styled.h2`
  color: #008DD5;
  font-size: 28px;
  margin-bottom: 20px;
`;

const StatsSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
`;

const StatBox = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  width: 45%;
`;

const StatLabel = styled.p`
  color: #555;
  font-size: 16px;
  margin-bottom: 5px;
`;

const StatValue = styled.p`
  font-size: 22px;
  font-weight: bold;
  color: #333;
`;

const RewardCategoriesTitle = styled.h3`
  color: #008DD5;
  font-size: 24px;
  margin-bottom: 20px;
`;

const RewardsTable = styled.table`
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

const RedeemButton = styled.button`
  background-color: #008DD5;
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 30px;
  
  &:hover {
    background-color: #006fa1;
  }
`;
