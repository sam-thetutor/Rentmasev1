import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import CheckOperators from './CheckOperators';
import { useLazyGetNumberOperatorsQuery, useLazyGetPairEchangeRateQuery, useTopUpAirtimeMutation } from '../../redux/api/servicesSlice';
import { CountryData } from './types';
import { useAuth } from '../../hooks/Context';
import { toast } from 'react-toastify';
import { ApproveArgs } from '../../../../declarations/token/token.did';
import { backendCanisterId, cashback, tokenDecimas, tokenFee } from '../../constants';
import { Principal } from '@dfinity/principal';
import { Cashback, TxnPayload } from '../../../../declarations/rentmase_backend/rentmase_backend.did';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import ClipLoader from 'react-spinners/ClipLoader';

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
  background-color: #008DD5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 5px;

  &:hover {
    background-color: #45a049;
  }
`;


const Label = styled.label`
  font-size: 14px;
  color: #555;
  margin-bottom: 4px;
`;

const AmountWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);  
  gap: 10px;
`;

type AmountProps = {
    active: boolean;
}

const AmountButton = styled.button<AmountProps>`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: ${props => props.active ? '#008DD5' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  
  &:hover {
    background-color: #008DD5;
    color: white;
  }
`;

const PriceSpan = styled.span`
  font-weight: bold;
  color: #333;
`;



type Props = {
    phoneNumber: string;
    selectedCountry: CountryData | null;
    setComponent: (component: string) => void;
};

const Operators: FC<Props> = ({ phoneNumber, selectedCountry, setComponent }) => {
    const { tokenLiveData, tokenBalance, cashback } = useSelector((state: RootState) => state.app);
    const { user, isAuthenticated, tokenCanister, identity, newBackendActor } = useAuth();
    const [fetchNumberOperators] = useLazyGetNumberOperatorsQuery();
    const [amount, setAmount] = useState(0);
    const [showOperators, setShowOperators] = useState(false);
    const [operator, setOperator] = useState<any | null>(null);
    const [selectedOperator, setSelectedOperator] = useState<any | null>(null);
    const [noOperator, setNoOperator] = useState(false);
    const [topUp] = useTopUpAirtimeMutation();
    const [buyingAirtime, setBuyingAirtime] = useState(false);
    const [getpair] = useLazyGetPairEchangeRateQuery();
    const [sCountrySenderPairRate, setSenderCountryPairRate] = useState<any>(null);
    const [calcutatingPrice, setCalculatingPrice] = useState(true);
    const [senderUsdPairRate, setPairRate] = useState<any>(null);
    const [minAmount, setMinAmount] = useState(0);
    const [maxAmount, setMaxAmount] = useState(0);


    useEffect(() => {
        if (selectedCountry && phoneNumber) {
            fetchNumberOperators({ countryCode: selectedCountry.isoName, phoneNumber, iso: selectedCountry.isoName }).then((res) => {
                if (res.data) {
                    setOperator(res.data);
                } else {
                    setNoOperator(true);
                }
            }).catch((error) => {
                console.error("Error fetching operators: ", error);
                setNoOperator(true);
            })

        }
    }, [selectedCountry, phoneNumber]);

    useEffect(() => {
        if (selectedOperator) {
            setOperator(selectedOperator);
            setShowOperators(false);
            setNoOperator(false);
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
        if (!tokenLiveData || tokenLiveData.pair === null) {
            toast.error('Token data not available, please try again later');
            return;
        }
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
        let _amount = amount;
        let _cashback = null;
        let percentage = 0;
        let isCashback = false;

        if (cashback && cashback.length > 0) {
            for (const cashbackItem of cashback) {
                const hasGiftCardPurchase = cashbackItem.products.some(
                    (product) => 'GiftCardPurchase' in product
                );
                if (hasGiftCardPurchase) {
                    _cashback = cashbackItem.percentage;
                    percentage = cashbackItem.percentage
                    isCashback = true;
                    break;
                }
            }
        }


        if (!operator || !sCountrySenderPairRate) {
            toast.error('Please select an operator');
        }

        if (operator.denominationType === "RANGE") {
            const rate = sCountrySenderPairRate.conversion_rate;
            _amount = amount * rate;
            if (_amount < operator.minAmount || _amount > operator.maxAmount) {
                toast.error(`Please enter an amount between ${minAmount} and ${maxAmount}`);
                return;
            }

        }

        setBuyingAirtime(true);
                                          
        // const approveAmount = BigInt((calculateTokenPriceEquivalent(_amount) * tokenDecimas + tokenFee).toFixed(0));
        // const tokenAmnt = BigInt((calculateTokenPriceEquivalent(_amount) * tokenDecimas).toFixed(0));
        const approveAmount = BigInt(100 * tokenDecimas + tokenFee);
        const tokenAmnt = BigInt(100 * tokenDecimas);


        if (approveAmount > tokenBalance.balance) {
            toast.error('Insufficient balance, please top up');
            setBuyingAirtime(false);
            return;
        }

        const arg: ApproveArgs = {
            fee: [],
            memo: [],
            from_subaccount: [],
            created_at_time: [],
            amount: approveAmount,
            expected_allowance: [],
            expires_at: [],
            spender: {
                owner: Principal.fromText(backendCanisterId),
                subaccount: []
            },
        }

        const res = await tokenCanister.icrc2_approve(arg);

        const cashbackAmount = (Number(tokenAmnt) * percentage) / 100;

        const txncashback: Cashback = {
            amount: BigInt(cashbackAmount),
            percentage: percentage
        }

        // if ("Ok" in res) {
        //     const arg2: TxnPayload = {
        //         userEmail: user.email,
        //         transferAmount: tokenAmnt,
        //         txnType: {
        //             'AirtimeTopup': {
        //                 more : {
        //                     name : operator.name,
        //                     logoUrl: operator.logoUrls[0],
        //                     countryCode: selectedCountry.isoName,
        //                     phoneNumber,
        //                     amount: String(_amount)
        //                 },
        //                 operator: operator.name,
        //                 operaterId: String(operator.id),
                   
        //             }
        //         },
        //         quantity: BigInt(1),
        //         cashback: isCashback ? [txncashback] : []
        //     }

        //     const res2 = await newBackendActor.intiateTxn(arg2);

        //     if ("ok" in res2) {
                const data = {
                    txnId: 3,// res2.ok.id.toString(),
                    operatorId: operator.id,
                    amount: _amount,
                    useLocalAmount: false,
                    customIdentifier: "airtime-top-up",
                    recipientEmail: user.email,
                    cashback: _cashback,
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
        //     } else {
        //         console.log("Error", res2);
        //         toast.error('Airtime top up failed');
        //         return
        //     }
        // } else {
        //     setBuyingAirtime(false);
        //     console.log("Error", res);
        //     toast.error('Airtime top up failed');
        //     return
        // }
    };

    useEffect(() => {
        if (sCountrySenderPairRate && sCountrySenderPairRate.conversion_rate && operator) {
            const rate = sCountrySenderPairRate.conversion_rate;
            if (operator.minAmount && operator.maxAmount) {
                const _minAmount = operator.minAmount / rate;
                const _maxAmount = operator.maxAmount / rate;


                setMinAmount(parseFloat(_minAmount.toFixed(2)));
                setMaxAmount(parseFloat(_maxAmount.toFixed(2)));
                setAmount(parseFloat(_minAmount.toFixed(2)));
            }
        }
    }, [sCountrySenderPairRate, operator]);

    useEffect(() => {
        if (tokenLiveData && selectedCountry && operator) {
            getpair({ curr1: `${selectedCountry?.currencyCode}`, curr2: "USD" }).then((res) => {
                if (res.data) {
                    setPairRate(res.data);
                } else {
                    console.error(res.error);
                }
            }).catch((err) => {
                console.log(err);
            });
            getpair({ curr1: `${selectedCountry.currencyCode}`, curr2: `${operator.senderCurrencyCode}` }).then((res) => {
                if (res.data) {
                    setSenderCountryPairRate(res.data);
                    setCalculatingPrice(false);
                } else {
                    console.log(res.error);
                }
            }).catch((err) => {
                console.error(err);
            });
        }
    }, [tokenLiveData, getpair, selectedCountry, operator]);

    const getCountryCountryCurrency = (denomination) => {
        if (!sCountrySenderPairRate || !sCountrySenderPairRate.conversion_rate) {
            return denomination;
        }

        const rate = sCountrySenderPairRate.conversion_rate;
        const localAmount = denomination / rate;
        return parseFloat(localAmount.toFixed(2));
    };

    const calculateTokenPriceEquivalent = (zarAmount: number): number => {
        // if (!senderUsdPairRate || !tokenLiveData || tokenLiveData.pair === null) {
        //     return 0;
        // }
        // const usdAmount = zarAmount * senderUsdPairRate.conversion_rate;
        // const tokenAmount = usdAmount / tokenLiveData.pair.priceUsd;
        // return tokenAmount;
        return 0;
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

            {operator && tokenLiveData && operator.denominationType === "FIXED" && <AmountWrapper>
                {operator.fixedAmounts.map((denomination, index) => (
                    <AmountButton
                        key={index}
                        active={amount === denomination}
                        onClick={() => setAmount(denomination)}
                    >
                        <>{calcutatingPrice ?
                            <ClipLoader color={"#000"} loading={calcutatingPrice} size={15} />
                            : <>{selectedCountry?.currencyCode} {getCountryCountryCurrency(denomination)} </>
                        }</>
                        {" "} || <PriceSpan>{calculateTokenPriceEquivalent(denomination).toFixed(2)}</PriceSpan> xRem
                    </AmountButton>
                ))}
            </AmountWrapper>}

            {
                operator && tokenLiveData && operator.denominationType === "RANGE" && <>  {operator?.minAmount && operator?.maxAmount && <Label htmlFor="amount">
                    Select an amount between <PriceSpan>{selectedCountry?.currencyCode} {minAmount} </PriceSpan> and <PriceSpan>{selectedCountry?.currencyCode} {maxAmount}</PriceSpan>
                    {" "} || {" "}
                    {calculateTokenPriceEquivalent(operator.minAmount).toFixed(2)} and {calculateTokenPriceEquivalent(operator.maxAmount).toFixed(2)}
                    {" "} xRem
                </Label>}

                    <AirtimeInput
                        type="number"
                        placeholder="Enter airtime amount"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                    /></>
            }

            <div>
                <Button onClick={handleBack} style={{ backgroundColor: '#D50000' }}>Cancel</Button>
                <Button onClick={handleTopUp}>
                    {buyingAirtime ? 'Processing...' : 'Top up'}
                </Button>
            </div>
        </Container>
    );
};

export default Operators;
