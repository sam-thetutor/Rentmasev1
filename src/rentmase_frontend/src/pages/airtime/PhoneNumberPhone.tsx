import styled from "styled-components";
import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAuth } from "../../hooks/Context";
import { toast } from "react-toastify";

// Styled Components to Match Profile Page
const FormContainer = styled.div`
  font-family: 'Poppins', sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 100px;
  margin-top: 100px;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  width: 100%;
`;

const Label = styled.label`
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #008DD5;
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
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    margin-right: 10px;
    color: #333;
    outline: none;
    transition: border 0.2s ease-in-out;

    &:focus {
      border-color: #008DD5;
    }
  }
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  outline: none;
  transition: border 0.2s ease-in-out;
  width: 100%;

  &:focus {
    border-color: #008DD5;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 20px;
  font-size: 18px;
  background-color: #008DD5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;

  &:hover {
    background-color: #008bb3;
    transform: scale(1.05);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

interface CountryData {
  isoName: string;
  name: string;
  continent: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  flag: string;
  callingCodes: string[];
}

type Props = {
  selectedCountry: CountryData | null;
  setSelectedCountry: (country: CountryData) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  setComponent: (component: string) => void;
};

const PhoneNumberForm: FC<Props> = ({ setComponent, selectedCountry, setPhoneNumber, phoneNumber, setSelectedCountry }) => {
  const { isAuthenticated } = useAuth();
  const { location, countries } = useSelector((state: RootState) => state.app);

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

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const country = countries.find((country) => country.callingCodes[0] === selectedCode);
    setSelectedCountry(country);
  };

  const handleNextClick = () => {
    if (!phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      return;
    }
    setComponent("operator");
  };

  return (
    <FormContainer>
      <FormField>
        <Label htmlFor="phone">Phone Number</Label>
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
      </FormField>

      <SubmitButton onClick={handleNextClick}>Next</SubmitButton>
    </FormContainer>
  );
};

export default PhoneNumberForm;
