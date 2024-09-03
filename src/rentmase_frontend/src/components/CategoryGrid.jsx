import React from 'react';
import styled from 'styled-components';
import { FaUtensils, FaShoppingCart, FaBed } from 'react-icons/fa';
import { GiBuyCard } from "react-icons/gi";
import { Link } from 'react-router-dom';

// Define the styled-components
const GridContainer = styled.div`
  display: flex;
  justify-content: center; /* Center the grid */
  gap: 10px; /* Reduce the spacing between the boxes */
  padding: px; /* Reduced padding */
`;

const CategoryCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ;
  border-radius: 15px;
  padding: px; /* Reduced padding */
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 60px; /* Smaller fixed width */
  height: 60px; /* Smaller fixed height */
  text-decoration: none; /* Remove default link styling */

  &:hover {
    transform: scale(1.05);
    outline: 2px solid #00B5E2;
  }
`;

const IconContainer = styled.div`
  width: 30px; /* Smaller width */
  height: 30px; /* Smaller height */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #00B5E2;
  margin-bottom: 5px; /* Reduced margin */
`;

const StyledIcon = styled.div`
  color: white;
  font-size: 16px; /* Smaller icon size */
`;

const CategoryTitle = styled.h3`
  font-size: 0.75rem; /* Smaller font size */
  color: #333;
  margin: 0; /* Removed margin */
  padding: 0; /* Removed padding */
`;

const categories = [
  { id: 1, icon: <FaUtensils />, title: 'EAT', link: '/food-delivery' },
  { id: 2, icon: <FaShoppingCart />, title: 'RETAIL', link: '/shop' },
  { id: 3, icon: <FaBed />, title: 'STAY', link: '/stay-booking' },
  { id: 4, icon: <GiBuyCard />, title: 'Buy', link: '/payments' },
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
