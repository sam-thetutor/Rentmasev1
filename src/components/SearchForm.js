import React, { useState } from 'react';
import styled from 'styled-components';

const SearchFormContainer = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const Input = styled.input`
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

const SearchForm = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    onSearch({ location, startDate, endDate, guests });
  };

  return (
    <SearchFormContainer>
      <Input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <Input
        type="date"
        placeholder="Start Date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <Input
        type="date"
        placeholder="End Date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Guests"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
      />
      <Button onClick={handleSearch}>Search</Button>
    </SearchFormContainer>
  );
};

export default SearchForm;
