import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import CheckOperators from './CheckOperators';
import { useLazyGetNumberOperatorsQuery, useTopUpAirtimeMutation } from '../../redux/api/servicesSlice';
import { CountryData } from './types';
import { useAuth } from '../../hooks/Context';
import { toast } from 'react-toastify';
import { ApproveArgs } from '../../../../declarations/token/token.did';
import { backendCanisterId, tokenDecimas, tokenFee } from '../../constants';
import { Principal } from '@dfinity/principal';
import { TxnPayload } from '../../../../declarations/rentmase_backend/rentmase_backend.did';

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
`;

const OperatorSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  justify-content: center;
`;

const OperatorLogo = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const OperatorName = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const AirtimeInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 5px;

  &:hover {
    background-color: #45a049;
  }
`;

type Props = {
    phoneNumber: string;
    selectedCountry: CountryData | null;
    setComponent: (component: string) => void;
};

const Operators: FC<Props> = ({ phoneNumber, selectedCountry, setComponent }) => {
    const { user, isAuthenticated, tokenCanister, identity, backendActor } = useAuth();
    const [fetchNumberOperators] = useLazyGetNumberOperatorsQuery();
    const [amount, setAmount] = useState('');
    const [showOperators, setShowOperators] = useState(false);
    const [operator, setOperator] = useState<any | null>(null);
    const [selectedOperator, setSelectedOperator] = useState<any | null>(null);
    const [noOperator, setNoOperator] = useState(false);
    const [topUp] = useTopUpAirtimeMutation();
    const [buyingAirtime, setBuyingAirtime] = useState(false);


    useEffect(() => {
        if (selectedCountry && phoneNumber) {
            fetchNumberOperators({ countryCode: selectedCountry.isoName, phoneNumber, iso: selectedCountry.isoName }).then((res) => {
                if (res.data) {
                    setOperator(res.data);
                } else {
                    setNoOperator(true);
                }
            });

        }
    }, [selectedCountry, phoneNumber]);

    useEffect(() => {
        if (selectedOperator) {
            setOperator(selectedOperator);
            setShowOperators(false);
            setSelectedOperator(null);
        }
    }, [selectedOperator]);



    const handleCheckOtherOperators = () => {
        setShowOperators(true);
    };

    const handleBack = () => {
        setComponent('phone-number');
    };

    const handleTopUp = async () => {
        if (!amount) {
            toast.error('Please enter an amount');
            return;
        }
        if (!isAuthenticated && !identity) {
            toast.error('Please login to continue');
            return;
        }
        if (isAuthenticated && !user) {
            toast.error("Please sign up to continue");
            return;
        }

        setBuyingAirtime(true);

        const arg: ApproveArgs = {
            fee: [BigInt(10_000)],
            memo: [],
            from_subaccount: [],
            created_at_time: [],
            amount: BigInt(parseFloat(amount) * tokenDecimas + tokenFee),
            expected_allowance: [],
            expires_at: [],
            spender: {
                owner: Principal.fromText(backendCanisterId),
                subaccount: []
            },
        }

        const res = await tokenCanister.icrc2_approve(arg);

        if ("Ok" in res) {
            const arg2: TxnPayload = {
                userEmail: user.email,
                transferAmount: BigInt((parseFloat(amount))  * tokenDecimas),
                txnType: { 'AirtimeTopup': { operator: operator.name, countryCode: selectedCountry.isoName, operaterId: String(operator.id), phoneNumber, amount } }
            }

            const res2 = await backendActor.intiateTxn(arg2);

            if ("ok" in res2) {
                const data = {
                    txnId : res2.ok.id.toString(),
                    operatorId: operator.id,
                    amount: amount,
                    useLocalAmount: false,
                    customIdentifier: "airtime-top-up",
                    recipientEmail: user.email,
                    countryCode: selectedCountry.isoName,
                    phoneNumber: phoneNumber,
                }
                topUp(data).then((res) => {
                    setBuyingAirtime(false);
                    if (res.data) {
                        console.log(res.data);
                        toast.success('Airtime top up successful');
                    } else {
                        console.log(res.error);
                        toast.error('Airtime top up failed');
                    }
                });
            } else {
                console.log("Error", res2);
                toast.error('Airtime top up failed');
                return
            }
        } else {
            console.log("Error", res);
            toast.error('Airtime top up failed');
            return
        }
    };

    return (
        <Container>
            <h3>
                Principal : {identity?.getPrincipal().toText()}
            </h3>
            <OperatorSection>
                {showOperators || noOperator ? <CheckOperators {...{ setSelectedOperator, selectedOperator, selectedCountry }} /> : <><div className="">
                    <h4>
                        Operator detected
                    </h4>
                    {
                        operator ? <> <OperatorLogo src={operator.logoUrls[0]} alt={`${operator.name} Logo`} />
                            <OperatorName>{operator.name}</OperatorName>
                        </> : <h5>
                            Loading
                        </h5>

                    }</div></>}
            </OperatorSection>

            {showOperators ? null : <Button onClick={handleCheckOtherOperators}>Check other operators</Button>}

            <AirtimeInput
                type="number"
                placeholder="Enter airtime amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <div>
                <Button onClick={handleBack} style={{ backgroundColor: '#f44336' }}>Back</Button>
                <Button onClick={handleTopUp}>
                    {buyingAirtime ? 'Processing...' : 'Top up'}
                </Button>
            </div>
        </Container>
    );
};

export default Operators;
