import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { useAuth } from '../hooks/Context';
import { toast } from 'react-toastify';

const Faucet = () => {
    const { tokenBalance } = useSelector((state: RootState) => state.app);
    const [balance, setBalance] = useState(tokenBalance);
    const { tokenCanister, backendActor, identity } = useAuth();
    const [claiming, setClaiming] = useState(false);
    // const [isEligible, setIsEligible] = useState(false);
    // const [timeRemaining, setTimeRemaining] = useState('');

    // useEffect(() => {
    //     const checkEligibility = () => {
    //         const now = new Date().getTime();
    //         const difference = now - lastClaimed;

    //         // 24 hours in milliseconds
    //         const twentyFourHours = 24 * 60 * 60 * 1000;

    //         if (difference >= twentyFourHours) {
    //             setIsEligible(true);
    //             setTimeRemaining('');
    //         } else {
    //             setIsEligible(false);

    //             // Calculate time remaining
    //             const timeLeft = twentyFourHours - difference;
    //             const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    //             const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    //             const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    //             setTimeRemaining(
    //                 `${hours}h ${minutes}m ${seconds}s until next claim`
    //             );
    //         }
    //     };

    //     // Run on component mount and every second to update the countdown
    //     checkEligibility();
    //     const interval = setInterval(checkEligibility, 1000);

    //     return () => clearInterval(interval); // Cleanup
    // }, [lastClaimed]);

    useEffect(() => {
        if (tokenCanister && backendActor) {
            getBalance();
        }
    }, [tokenCanister, backendActor]);

    const getBalance = async () => {
        const balance = await tokenCanister.icrc1_balance_of({
            owner: identity.getPrincipal(),
            subaccount: [],
        });

        setBalance({
            balance: Number(balance),
            principal: identity.getPrincipal().toString(),
        });
    };


    const handleClaim = async () => {
        setClaiming(true);
        const res = await backendActor.getTestTokens();
        if ("ok" in res) {
            setClaiming(false);
            getBalance();
            toast.success("Test tokens claimed successfully!");
        } else if ("err" in res) {
            setClaiming(false);
            toast.error(res.err);
        }
    };

    return (
        <FaucetContainer>
            <FaucetTitle>Faucet - Get Free Test Tokens</FaucetTitle>

            <BalanceSection>
                <BalanceLabel>Current Balance</BalanceLabel>
                <BalanceValue>
                    {balance ? <span>{(Number(balance.balance) / 1e8).toFixed(3)}</span> : 0} {" "}
                    $exRem</BalanceValue>
            </BalanceSection>

            {/* {!isEligible && <CountdownText>{timeRemaining}</CountdownText>} */}

            {/* <ClaimButton disabled={!isEligible} isEligible={isEligible}>
                {isEligible ? 'Claim Test Tokens' : 'Claim Not Available'}
            </ClaimButton> */}
            <ClaimButton
                onClick={handleClaim}
                isEligible={true}>
                {claiming ? 'Claiming...' : 'Claim Test Tokens'}
            </ClaimButton>
        </FaucetContainer>
    );
};

export default Faucet;

// Styled Components
const FaucetContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 40px 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const FaucetTitle = styled.h2`
  color: #008DD5;
  font-size: 28px;
  margin-bottom: 20px;
`;

const BalanceSection = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const BalanceLabel = styled.p`
  font-size: 16px;
  color: #555;
`;

const BalanceValue = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const CountdownText = styled.p`
  color: #FF6347; /* Tomato color for urgency */
  font-size: 18px;
  margin-bottom: 20px;
`;

const ClaimButton = styled.button<{ isEligible: boolean }>`
  background-color: ${({ isEligible }) => (isEligible ? '#28a745' : '#ccc')}; /* Green if eligible, gray if not */
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: ${({ isEligible }) => (isEligible ? 'pointer' : 'not-allowed')};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ isEligible }) => (isEligible ? '#218838' : '#ccc')}; /* Darker green on hover if eligible */
  }
`;
