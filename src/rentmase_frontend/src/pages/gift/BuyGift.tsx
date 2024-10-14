
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CountryData } from '../airtime/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import { useBuyGiftCardMutation, useLazyGetPairEchangeRateQuery } from '../../redux/api/servicesSlice';
import { useAuth } from '../../hooks/Context';
import { backendCanisterId, tokenDecimas, tokenFee } from '../../constants';
import { Principal } from '@dfinity/principal';
import { ApproveArgs } from '../../../../declarations/token/token.did';
import { Cashback, TxnPayload } from '../../../../declarations/rentmase_backend/rentmase_backend.did';
import ClipLoader from "react-spinners/ClipLoader";;
const Container = styled.div`
  background-color: white;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  text-align: center;
  color: #333;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  color: #555;
  margin-bottom: 4px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
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


const ImageContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Image = styled.img`
  max-width: 100%;
  border-radius: 8px;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #555;
`;

const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  background-color: #008DD5;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0072B0;
  }
`;

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

const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 15px; /* Rounded corners */
  width: 600px; /* Fixed width */
  max-width: 90%; /* Responsive width */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  position: relative; /* Positioning for close button */
`;

const CountryCodeInput = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  img {
    width: 24px;
    height: 16px;
    margin-right: 8px;
  }

  select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    margin-right: 10px;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
`;

const QuantityButton = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius: 4px;
  margin: 0 5px;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  text-align: center;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const PriceSpan = styled.span`
  font-weight: bold;
  color: #333;
`;


const BuyGift = ({ card, setOpenModal }) => {
  const [buyCard] = useBuyGiftCardMutation();
  const [getpair] = useLazyGetPairEchangeRateQuery();
  const { isAuthenticated, user, tokenCanister, backendActor } = useAuth();
  const handleClose = () => setOpenModal(false);
  const [amount, setAmount] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const { location, countries, tokenLiveData, tokenBalance, cashback } = useSelector((state: RootState) => state.app);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [toEmail, setToEmail] = useState<string | null>(null);
  const [fromnName, setFromName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [senderUsdPairRate, setPairRate] = useState<any>(null);
  const [sCountrySenderPairRate, setSenderCountryPairRate] = useState<any>(null);
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  const [calcutatingPrice, setCalculatingPrice] = useState(true);

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  }


  const calculateTokenPriceEquivalent = (zarAmount: number): number => {
    if (!senderUsdPairRate || !tokenLiveData || tokenLiveData.pair === null) {
      return 0;
    }
    const usdAmount = zarAmount * senderUsdPairRate.conversion_rate;
    const tokenAmount = usdAmount / tokenLiveData.pair.priceUsd;
    return tokenAmount;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  useEffect(() => {
    if (countries) {
      const country = countries.find((country: CountryData) => country.name === location.country);
      if (country) {
        setSelectedCountry(country);
      } else {
        setSelectedCountry(countries[0]);
      }
    }
  }, [countries]);

  const hasFixedDenominations = card.fixedRecipientDenominations.length > 0;

  useEffect(() => {
    if (card.minSenderDenomination) {
      setAmount(card.minSenderDenomination);
    }

  }, [card]);

  useEffect(() => {
    if (tokenLiveData && card && selectedCountry) {
      getpair({ curr1: `${selectedCountry?.currencyCode}`, curr2: "USD" }).then((res) => {
        if (res.data) {
          setPairRate(res.data);
        } else {
          console.log(res.error);
        }
      }).catch((err) => {
        console.log(err);
      });
      getpair({ curr1: `${selectedCountry.currencyCode}`, curr2: `${card.senderCurrencyCode}` }).then((res) => {
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
  }, [tokenLiveData, card, getpair, selectedCountry]);

  useEffect(() => {
    if (sCountrySenderPairRate && sCountrySenderPairRate.conversion_rate) {
      const rate = sCountrySenderPairRate.conversion_rate;
      if (card.minSenderDenomination && card.maxSenderDenomination) {
        const _minAmount = card.minSenderDenomination / rate;
        const _maxAmount = card.maxSenderDenomination / rate;


        setMinAmount(parseFloat(_minAmount.toFixed(2)));
        setMaxAmount(parseFloat(_maxAmount.toFixed(2)));
        setAmount(parseFloat(_minAmount.toFixed(2)));
      }
    }
  }, [sCountrySenderPairRate, card.minSenderDenomination, card.maxSenderDenomination]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const country = countries.find((country) => country.callingCodes[0] === selectedCode);
    setSelectedCountry(country);
  };

  const lookUpKeyAmount = (map: { [key: number]: number }, value: number): number | null => {
    for (const [key, val] of Object.entries(map)) {
        if (val === value) {
            return Number(key); 
        }
    }
    return null; 
}

const amountInUSD = (amount: number) => {
  if (!senderUsdPairRate) {
    return 0;
  }
  return amount * senderUsdPairRate.conversion_rate;
}

  const handleBuy = async () => {
    // if (!tokenLiveData || tokenLiveData.pair === null) {
    //   toast.error('Token data not available, please try again later');
    //   return;
    // }

    if (!isAuthenticated) {
      toast.error('Please login to continue');
      return;
    }
    if (isAuthenticated && !user) {
      toast.error("Please sign up to continue");
      return;
    }

    if (!toEmail || !phoneNumber || !fromnName || !amount || !quantity || !card) {
      toast("Please fill in all fields");
      return;
    }

    setLoading(true);

    let _amount = amount;
    let _cashback = null;
    let percentage = 0;
    let isCashback = false;
    const isFixedDenomination = card.denominationType === "FIXED";

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

    if (!card || !sCountrySenderPairRate) {
      toast.error('Please select an card');
    }

    if (card.denominationType === "RANGE") {
      const rate = sCountrySenderPairRate.conversion_rate;
      _amount = amount * rate;
      if (_amount < card.minSenderDenomination || _amount > card.minSenderDenomination) {
        toast.error(`Please enter an amount between ${minAmount} and ${maxAmount}`);
        return;
      }

    }

    // const approveAmount = BigInt((calculateTokenPriceEquivalent(_amount) * tokenDecimas + tokenFee).toFixed(0));
    // const tokenAmnt = BigInt((calculateTokenPriceEquivalent(_amount) * tokenDecimas).toFixed(0));

    const approveAmount = BigInt(1000 * tokenDecimas + tokenFee);
    const tokenAmnt = BigInt(1000 * tokenDecimas);


    if (approveAmount > tokenBalance.balance) {
      toast.error('Insufficient balance, please top up');
      setLoading(false);
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

    try {
      const res = await tokenCanister.icrc2_approve(arg);

      const cashbackAmount = (Number(tokenAmnt) * percentage) / 100;

      const txncashback : Cashback = {
        amount: BigInt(cashbackAmount),
        percentage: percentage
      }


      if ("Ok" in res) {
        const arg2: TxnPayload = {
          userEmail: user.email,
          transferAmount: tokenAmnt,
          txnType: {
            'GiftCardPurchase': {
              more : {
                name : card.productName,
                logoUrl : card.logoUrls[0],
   
                countryCode: selectedCountry?.isoName,
                phoneNumber: phoneNumber,
                amount: amount.toString(),
              },
              quantity: BigInt(quantity),
              productId: String(card.productId),
              recipientEmail: toEmail
            }
          },
          quantity: BigInt(quantity),
          cashback: isCashback ?  [txncashback] :[],
        }
        const res2 = await backendActor.intiateTxn(arg2);

        if ("ok" in res2) {
          const data = {
            txnId: res2.ok.id.toString(),
            useLocalAmount: false,
            productId: card.productId,
            quantity: quantity,
            unitPrice: isFixedDenomination ? lookUpKeyAmount(card.fixedRecipientToSenderDenominationsMap, amount) : amountInUSD(_amount),
            customIdentifier: `Giftcard Purchase ${res2.ok.id.toString()} ${gnerateUniqueRandomString(5)}`,
            recipientPhone: phoneNumber,
            senderName: fromnName,
            recipientEmail: toEmail,
            cashback: _cashback,
            countryCode: selectedCountry.isoName,
            phoneNumber: phoneNumber,
          }

          buyCard(data).then((res) => {
            setLoading(false);
            if (res.data) {
              toast.success('Giftcard bought successfully');
            } else {
              toast.error('Failed to buy giftcard');
            }
          });
        } else {
          setLoading(false)
          console.log("Error", res2);
          toast.error('Failed to buy giftcard');
          return
        }
      } else {
        setLoading(false)
        console.log("Error", res);
        toast.error('Failed to buy giftcard');
        return
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
      console.log("Error", error);
    }
  };

  const getCountryCountryCurrency = (denomination) => {
    if (!sCountrySenderPairRate || !sCountrySenderPairRate.conversion_rate) {
      return denomination;
    }

    const rate = sCountrySenderPairRate.conversion_rate;
    const localAmount = denomination / rate;
    return parseFloat(localAmount.toFixed(2));
  };

  const gnerateUniqueRandomString = (length: number) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  return (
    <ModalBackdrop onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>&times;</CloseButton>
        <Container>
          {/* <BackButton onClick={() => navigate(-1)}>Back</BackButton> */}
          <ImageContainer>
            <Image src={card.logoUrls[0]} alt={card.productName} />
          </ImageContainer>
          <Title>
            {card.productName}
          </Title>
          <Form>
            {hasFixedDenominations ?
              <AmountWrapper>
                {card && tokenLiveData && card.fixedSenderDenominations.map((denomination, index) => (
                  <AmountButton
                    key={index}
                    active={amount === denomination}
                    onClick={() => setAmount(denomination)}
                  >
                    <>{calcutatingPrice ?
                      <ClipLoader color={"#000"} loading={calcutatingPrice} size={15} />
                      : <>{selectedCountry?.currencyCode} {getCountryCountryCurrency(denomination)} </>
                    }</>
                    {" "} || <PriceSpan>{calculateTokenPriceEquivalent(denomination).toFixed(2)}</PriceSpan> REM
                  </AmountButton>
                ))}
              </AmountWrapper>
              :
              <InputGroup>
                {card.minSenderDenomination && card.maxSenderDenomination && senderUsdPairRate && (
                  <Label htmlFor="amount">
                    Select an amount between {selectedCountry?.currencyCode} <PriceSpan> {minAmount} </PriceSpan> and <PriceSpan> {selectedCountry?.currencyCode} {maxAmount}</PriceSpan>
                    {" "} || {" "}
                    {calculateTokenPriceEquivalent(card.minSenderDenomination).toFixed(2)}and {calculateTokenPriceEquivalent(card.maxSenderDenomination).toFixed(2)}
                    {" "} REM
                  </Label>
                )}
                <Label htmlFor="amount">Amount</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  id="amount"
                  placeholder="Amount"
                />
              </InputGroup>
            }
            <InputGroup>
              <Label htmlFor="email">To</Label>
              <Input type="email"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                id="email" placeholder="Recipient email" />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="phone">Phone</Label>
              <CountryCodeInput>
                <img src={selectedCountry?.flag} alt="Flag" />
                <select
                  value={selectedCountry?.callingCodes[0] || ''}
                  onChange={handleCountryChange}
                >
                  {countries.map((country, index) => (
                    <option key={index} value={country.callingCodes[0]}>
                      {country.isoName} ({country.callingCodes[0]})
                    </option>
                  ))}
                </select>

                <Input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                />
              </CountryCodeInput>
            </InputGroup>

            <InputGroup>
              <Label htmlFor="from">From</Label>
              <Input type="text"
                id="from"
                value={fromnName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Your name" />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="quantity">Quantity</Label>
              <QuantityControl>
                <Button onClick={handleDecrease}>-</Button>
                <QuantityInput
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={handleInputChange}
                  min={1}
                />
                <QuantityButton onClick={handleIncrease}>+</QuantityButton>
              </QuantityControl>
            </InputGroup>

            <CheckboxLabel>
              <Input type="checkbox" /> By clicking the 'Buy Now' button, you agree to our Terms and conditions.
            </CheckboxLabel>

            <Button
              onClick={handleBuy}
            >
              {loading ? 'Loading...' : 'Buy Now'}
            </Button>
          </Form>

          {/* <RedeemLink href="#">See Redeem Instructions</RedeemLink> */}
        </Container>
      </ModalContent>
    </ModalBackdrop>
  )
}

export default BuyGift