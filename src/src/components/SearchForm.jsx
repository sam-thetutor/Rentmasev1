import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SearchFormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 50px;
  margin-bottom: 20px;
  max-width: 1000px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Input = styled.input`
  padding: 10px 20px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 50px;
  outline: none;
  font-size: 16px;
  flex: 1;
  min-width: 150px;

  &:focus {
    border-color: #00B5E2;
  }
`;

const SmallInput = styled(Input)`
  flex: 0.5;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
  background-color: #00B5E2;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  &:hover {
    background-color: #0096cc;
  }
`;

const CustomDateInput = ({ selected, onChange, placeholder }) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      placeholderText={placeholder}
      dateFormat="dd/MM/yyyy"
      customInput={<Input />}
    />
  );
};

const SearchForm = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    onSearch({ location, startDate, endDate, guests });
  };

  return (
    <SearchFormContainer>
      <Input
        type="text"
        placeholder="Where"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <CustomDateInput
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        placeholder="Check in"
      />
      <CustomDateInput
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        placeholder="Check out"
      />
      <SmallInput
        type="number"
        placeholder="Who"
        value={guests}
        min="1"
        onChange={(e) => setGuests(e.target.value)}
      />
      <Button onClick={handleSearch}>
        <FaSearch />
      </Button>
    </SearchFormContainer>
  );
};

export default SearchForm;
