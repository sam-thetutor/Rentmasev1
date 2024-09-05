import styled from "styled-components";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAuth } from "../../hooks/Context";
import { toast } from "react-toastify";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 400px;
  max-width: 600px;
  margin: 0 auto;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  width: 100%;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
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

const SubmitButton = styled.button`
  padding: 12px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
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
}

const PhoneNumberForm: FC<Props> = ({ setComponent, selectedCountry, setPhoneNumber, phoneNumber, setSelectedCountry }) => {
    const {isAuthenticated} = useAuth();
    const { location } = useSelector((state: RootState) => state.app);
    const [countries, setCountries] = useState<CountryData[]>([]);

    useEffect(() => {
        if (location) {
            getCountries();
        }
    }, [location]);

    const getCountries = async () => {
        const response = await fetch("https://topups.reloadly.com/countries");
        const data = await response.json();
        setCountries(data);

        const country = data.find((country: CountryData) => country.name === location.country);
        if (country) {
            setSelectedCountry(country);
        } else {
            setSelectedCountry(data[0]);
        }
    };


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
        setComponent("operator")
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
