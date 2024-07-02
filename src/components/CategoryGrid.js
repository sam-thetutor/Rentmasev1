import React from 'react';
import styled from 'styled-components';
import { FaUtensils, FaShoppingCart, FaBed } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Define the styled-components
const GridContainer = styled.div`
  display: flex;
  justify-content: center; /* Center the grid */
  gap: 10px; /* Reduce the spacing between the boxes */
  padding: 20px;
`;

const CategoryCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color:;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100px; /* Fixed width */
  height: 150px; /* Fixed height */
  text-decoration: none; /* Remove default link styling */

  &:hover {
    transform: scale(1.05);
    outline: 2px solid #00B5E2;
  }
`;

const IconContainer = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #00B5E2;
  margin-bottom: 10px;
`;

const StyledIcon = styled.div`
  color: white;
  font-size: 24px;
`;

const CategoryTitle = styled.h3`
  font-size: 1rem;
  color: #333;
`;

const categories = [
  { id: 1, icon: <FaUtensils />, title: 'EAT', link: '/food-delivery' },
  { id: 2, icon: <FaShoppingCart />, title: 'RETAIL', link: '/shopping' },
  { id: 3, icon: <FaBed />, title: 'STAY', link: '/stay-booking' },
];

const CategoryGrid = () => {
  return (
    <GridContainer>
      {categories.map(({ id, icon, title, link }) => (
        <CategoryCard key={id} to={link}>
          <IconContainer>
            <StyledIcon>{icon}</StyledIcon>
          </IconContainer>
          <CategoryTitle>{title}</CategoryTitle>
        </CategoryCard>
      ))}
    </GridContainer>
  );
};

export default CategoryGrid;
