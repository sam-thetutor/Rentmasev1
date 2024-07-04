import React from 'react';
import styled from 'styled-components';
import  SearchIcon  from '/images/search.svg'; // Adjust the path as necessary

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

const Icon = styled(SearchIcon)`
  width: 24px;
  height: 24px;
  margin-right: 10px;
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
