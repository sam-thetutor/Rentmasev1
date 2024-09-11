
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CountryData } from '../airtime/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
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
  grid-template-columns: repeat(3, 1fr);  // Creates 3 columns
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
  background-color: ${props => props.active ? '#00FF00' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  
  &:hover {
    background-color: #00FF00;
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
  background-color: #6200ea;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #5300d1;
  }
`;

const BackButton = styled(Button)`
  background-color: #ddd;
  color: #333;
  margin-bottom: 20px;

  &:hover {
    background-color: #ccc;
  }
`;

const RedeemLink = styled.a`
  font-size: 14px;
  color: #6200ea;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const QuantitySelect = styled.select`
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const PreOrderCheckbox = styled.input`
  margin-right: 8px;
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


const BuyGift = ({ card, setOpenModal }) => {
  const handleClose = () => setOpenModal(false);
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const { location , countries } = useSelector((state: RootState) => state.app);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [fromnName, setFromName] = useState('');
  

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
    if (card.minRecipientDenomination) {
      setAmount(card.minRecipientDenomination);
    }

  }, [card]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const country = countries.find((country) => country.callingCodes[0] === selectedCode);
    setSelectedCountry(country);
};




  console.log("Card: ", card);

  return (
    <ModalBackdrop onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>&times;</CloseButton>
        <Container>
          <BackButton onClick={() => navigate(-1)}>Back</BackButton>
          <ImageContainer>
            <Image src={card.logoUrls[0]} alt={card.productName} />
          </ImageContainer>
          <Title>
            {card.productName}
          </Title>

          <Form>
            {hasFixedDenominations ?
              <AmountWrapper>
                {card.fixedRecipientDenominations.map((denomination, index) => (
                  <AmountButton key={index} active={amount === denomination} onClick={() => setAmount(denomination)}>${denomination.toFixed(2)}</AmountButton>
                ))
                }
              </AmountWrapper>
              :
              <InputGroup>
              {card.minRecipientDenomination && card.maxRecipientDenomination && <Label htmlFor="amount">
                Select an amount between ${card.minRecipientDenomination} and ${card.maxRecipientDenomination}
                </Label>}
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
              <Input type="email" id="email" placeholder="Recipient email" />
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
              <Input type="text" id="from" placeholder="Your name" />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="quantity">Quantity</Label>
              <QuantitySelect id="quantity">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </QuantitySelect>
            </InputGroup>

            <CheckboxLabel>
              <Input type="checkbox" /> By clicking the 'Buy Now' button, you agree to our Terms and conditions.
            </CheckboxLabel>

            <Button type="submit">Buy Now</Button>
          </Form>

          <RedeemLink href="#">See Redeem Instructions</RedeemLink>
        </Container>
      </ModalContent>
    </ModalBackdrop>
  )
}

export default BuyGift