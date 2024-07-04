import React from 'react';
import styled from 'styled-components';
import PlaceCard from './PlaceCard';

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const PlaceGrid = ({ places }) => (
  <List>
    {places.map((place) => (
      <PlaceCard key={place.id} place={place} />
    ))}
  </List>
);

export default PlaceGrid;
