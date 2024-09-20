import styled from 'styled-components';
import {  Rewards } from '../../../declarations/rentmase_backend/rentmase_backend.did';
import { FC, useEffect, useState } from 'react';
import { tokensPerReward } from '../constants';
import { toast } from 'react-toastify';
import { Principal } from '@dfinity/principal';
import { useAuth } from '../hooks/Context';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensures modal is on top */
`;


const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 15px; /* Rounded corners */
  width: 600px; /* Fixed width */
  max-width: 90%; /* Responsive width */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  position: relative; /* Positioning for close button */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: transparent;
  border: none;
  color: #00B5E2;
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    color: black;
  }
`;

const RewardAmountInput = styled.input`
    padding: 10px;
    margin: 20px 0;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
    `;

const RecivingAddressInput = styled.input`
    padding: 10px;
    margin-right: 20px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
    `;

const Button = styled.button`
    margin-top : 20px;
    width: 100%;
  padding: 10px;
  background-color: #00B5E2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 10px;
  margin-right: 10px;
`;


type Props = {
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
    rewards: Rewards | null;
}


const RedeemTokens: FC<Props> = ({ openModal, setOpenModal, rewards }) => {
    const handleClose = () => setOpenModal(false);
    const { backendActor, isAuthenticated } = useAuth();
    const [rewardAmount, setRewardAmount] = useState("")
    const [recivingAddress, setRecivingAddress] = useState<string | null>(null);
    const [redeemLoading, setRedeemLoading] = useState(false);

    if (!openModal) return null;

    const redeemTokens = async () => {
        if (rewardAmount === null || recivingAddress === null) {
            toast.error("Please fill all fields");
            return;
        }
        if (parseInt(rewardAmount) > rewards.rewards.length) {
            toast.error("You don't have enough rewards to redeem, Please enter a valid amount");
            return;
        }
        let principal: Principal;
        try {
            principal = Principal.fromText(recivingAddress);
        } catch (error) {
            toast.error("Invalid Principal Address");
            return;
        }
        try {
            setRedeemLoading(true);
            // const result = await backendActor.redeemRewards(principal, BigInt(rewardAmount));
            // if ("ok" in result) {
            //     toast.success("Tokens Redeemed Successfully");
            //     setRedeemLoading(false);
            //     handleClose();
            //     return;
            // } else {
            //     toast.error("Error Redeeming Tokens");
            //     setRedeemLoading(false);
            //     return;
            // }
        } catch (error) {
            toast.error("Error Redeeming Tokens");
            setRedeemLoading(false);
            return;
        }

    }

    const rewardText = rewardAmount
        ? `${rewardAmount} Rewards, Worth ${parseInt(rewardAmount) * tokensPerReward} REM Tokens`
        : '';

    const buttonText = redeemLoading ? 'Redeeming...' : `Redeem ${rewardText}`;
    return (
        <ModalBackdrop onClick={handleClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={handleClose}>&times;</CloseButton>
                <div className="">
                    <h2>Redeem Tokens</h2>
                    <h4>
                        Rewards Worth {Number(rewards.totalAmount)} REM Tokens
                    </h4>
                    <RewardAmountInput type="number"
                        value={rewardAmount}
                        onChange={(e) => setRewardAmount(e.target.value)}
                        placeholder="Enter Rewards Amount" />
                    <RecivingAddressInput type="text"
                        value={recivingAddress}
                        onChange={(e) => setRecivingAddress(e.target.value)}
                        placeholder="Enter Reciving Principal Address" />
                    <Button
                        onClick={redeemTokens}
                    >
                        {buttonText}
                    </Button>
                </div>
            </ModalContent>
        </ModalBackdrop>
    )
}

export default RedeemTokens