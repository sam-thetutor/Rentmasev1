// src/components/SearchComponent.js
import React from 'react';
import styled from 'styled-components';
import foodData from './foodData';

const SearchContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

const SearchInput = styled.input`
  width: 80%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 16px;
`;

const SearchComponent = () => {
  return (
    <SearchContainer>
      <SearchInput type="text" placeholder={foodData.searchPlaceholder} />
    </SearchContainer>
  );
};

export default SearchComponent;
