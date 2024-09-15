import React from 'react';
import styled from 'styled-components';
import { FaUtensils, FaShoppingCart, FaMoneyBillWave, FaTags, FaBed } from 'react-icons/fa';
import { GiBuyCard } from 'react-icons/gi';
import { Link } from 'react-router-dom';

const GridContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px 15px;
  border: 2px solid #008DD5;
  border-radius: 50px;
  background-color: transparent;
  max-width: 1200px; /* Limit the width */
  margin: 0 auto; /* Center it horizontally */

  @media (max-width: 768px) {
    padding: 10px; /* Adjust padding for smaller screens */
  }
`;


const CategoryCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: transparent;
  border-radius: 30px;
  padding: 10px 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: #333;

  &:hover {
    background-color: #E8F8FF;
    transform: scale(1.05);
    outline: 2px solid #008DD5;
  }

  @media (max-width: 768px) {
    padding: 8px 15px; /* Adjust padding for smaller screens */
  }
`;

const IconContainer = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #008DD5;
`;

const StyledIcon = styled.div`
  color: white;
  font-size: 16px;
`;

const CategoryTitle = styled.h3`
  font-size: 1rem;
  color: #333;
  margin: 0;
  font-family: 'Poppins', sans-serif;
`;

// Define the categories data
const categories = [
  { id: 1, icon: <FaUtensils />, title: 'EAT', link: '/food-delivery' },
  { id: 2, icon: <FaShoppingCart />, title: 'RETAIL', link: '/shop' },
  { id: 3, icon: <FaBed />, title: 'STAY', link: '/stay-booking' },

  { id: 5, icon: <FaMoneyBillWave />, title: 'CASBACKS', link: '/' },
  { id: 6, icon: <FaTags />, title: 'DISCOUNTED', link: '/payments' },
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
