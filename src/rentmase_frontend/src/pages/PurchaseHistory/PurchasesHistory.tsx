import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/Context';
import { InternalTxn} from '../../../../declarations/rentmase_backend/rentmase_backend.did';
import AllHistory from './AllHistory';
import Cashbacks from './Cashbacks';
import { EmptyPurchasesMessage } from './styles';

const PurchasesContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: transparet;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #008DD5;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
`;





const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 10px; /* Adds space between the buttons */

  @media (max-width: 768px) {
    flex-direction: column; /* Stack buttons on smaller screens */
    gap: 10px;
  }
`;

const StyledButton = styled.button`
  flex: 1; /* Makes the buttons take up equal width */
  padding: 15px 20px;
  font-size: 16px;
  color: white;
  background-color: #008DD5;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #0077b3;
    transform: translateY(-2px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 141, 213, 0.5);
  }

  &.active {
    background-color: #005f8a; /* Different color for the active button */
  }
`;

const PurchasesHistory = () => {
  const { newBackendActor } = useAuth();
  const [purchases, setPurchases] = useState<InternalTxn[] | null>(null);
  const [view, setView] = useState<'all' | 'cashbacks'>('all');
  const [cashbacks, setCashbacks] = useState<InternalTxn[] | null>(null);

  const filterCashbacks = (purchases: InternalTxn[]) => {
    return purchases.filter((purchase) => purchase.cashback.length > 0);
  };

  useEffect(() => {
    if (newBackendActor) {
      getPurchaseHistory();
    }
  }, [newBackendActor]);

  const getPurchaseHistory = async () => {
    try {
      const response = await newBackendActor.getUsersTxns();
      setPurchases(response);
      setCashbacks(filterCashbacks(response));
      console.log('Purchase history:', response);
    } catch (error) {
      console.error('Error fetching purchase history:', error);
    }
  };

  return (
    <PurchasesContainer>
      <Title>Purchase History</Title>
      {purchases?.length === 0 ? (
        <EmptyPurchasesMessage>No purchases made yet.</EmptyPurchasesMessage>
      ) : (
        <>
          <ButtonContainer>
            <StyledButton
              onClick={() => setView('all')}
              className={view === 'all' ? 'active' : ''}
            >
              All History
            </StyledButton>
            <StyledButton
              onClick={() => setView('cashbacks')}
              className={view === 'cashbacks' ? 'active' : ''}
            >
              Cashbacks
            </StyledButton>
          </ButtonContainer>

          {view === 'all' ? (
            <AllHistory purchases={purchases} />
          ) : (
            <Cashbacks purchases={cashbacks} />
          )}
        </>
      )}
    </PurchasesContainer>
  );
};

export default PurchasesHistory;
