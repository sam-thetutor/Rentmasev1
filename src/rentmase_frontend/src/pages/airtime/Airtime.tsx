import styled from "styled-components";
import Select from "react-select";
import { useEffect, useState } from "react";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
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

const AmountInput = styled(Input).attrs({ type: "number" })`
  width: 100%;
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

// Define operator options
const operatorOptions = [
  { value: "operator1", label: "Operator 1" },
  { value: "operator2", label: "Operator 2" },
  { value: "operator3", label: "Operator 3" },
];

const AirtimeForm = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryData | undefined>(undefined);

  useEffect(() => {}, [selectedCountry]);

  useEffect(() => {
    getCountries();
  }, []);

  const getCountries = async () => {
    const response = await fetch("https://topups.reloadly.com/countries");
    const data = await response.json();
    setSelectedCountry(data[0]);
    setCountries(data);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const country = countries.find((country) => country.callingCodes[0] === selectedCode);
    setSelectedCountry(country);
  };

  return (
    <FormContainer>
      <FormField>
        <Label htmlFor="phone">Phone Number</Label>
        <CountryCodeInput>
          <img src={selectedCountry?.flag}
           alt="Flag" />
          <select onChange={handleCountryChange}>
            {countries.map((country, index) => (
              <option key={index} value={country.callingCodes[0]}>
                {country.isoName} ({country.callingCodes[0]})
              </option>
            ))}
          </select>
          <Input type="tel" id="phone" placeholder="Enter phone number" />
        </CountryCodeInput>
      </FormField>

      <FormField>
        <Label htmlFor="operator">Operator</Label>
        <Select id="operator" options={operatorOptions} />
      </FormField>

      <FormField>
        <Label htmlFor="amount">Amount</Label>
        <AmountInput id="amount" placeholder="Enter amount" />
      </FormField>

      <SubmitButton>Top Up</SubmitButton>
    </FormContainer>
  );
};

export default AirtimeForm;
