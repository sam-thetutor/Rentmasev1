import React from 'react';
import styled from 'styled-components';
import { FiSearch } from 'react-icons/fi'; // Import the search icon from react-icons

const SearchContainer = styled.div`
  display: flex;
  border: 1px solid lightgrey;
  align-items: center;
  background-color: white;
  border-radius: 25px;
  padding: 5px 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 600px; /* Set a fixed width */
`;

const Icon = styled(FiSearch)`
  width: 24px;
  height: 24px;
  margin-right: 10px;
  fill: none; /* Set the fill color to 00B5E2 */
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  padding: 10px;
  font-size: 1rem;
  border-radius: 25px;
  width: 100%; /* Make it take up available width within the container */
`;

const SearchBar = () => {
  return (
    <SearchContainer>
      <Icon />
      <SearchInput type="text" placeholder="Search..." />
    </SearchContainer>
  );
};

export default SearchBar;
