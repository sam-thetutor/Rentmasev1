import React from 'react';
import styled from 'styled-components';
import { FaUtensils, FaShoppingCart, FaMoneyBillWave, FaTags, FaBed } from 'react-icons/fa';
import { GiBuyCard } from "react-icons/gi";
import { Link } from 'react-router-dom';

const GridContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  border: 2px solid #008DD5;
  border-radius: 50px;
  background-color: transparent;
  max-width: 1200px; /* Limit the width */
  margin: 0 auto; /* Center it horizontally */
  flex-wrap: nowrap; /* Prevent wrapping */
  overflow: hidden; /* Hide any overflow to prevent scrollbars */

  @media (max-width: 768px) {
    flex-wrap: nowrap; /* Prevent wrapping on small screens */
    justify-content: space-between; /* Distribute space equally */
    padding: 1px; /* Adjust padding for smaller screens */
    gap: 0px; /* Reduce gap between elements */
  }
`;

const CategoryCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 2px;
  background-color: transparent;
  border-radius: 30px;
  padding: 10px 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: #333;
  white-space: nowrap; /* Prevent text from breaking */
  flex-shrink: 1; /* Allow shrinking on small screens */

  &:hover {
    background-color: #E8F8FF;
    transform: scale(1.05);
    outline: 2px solid #008DD5;
  }

  @media (max-width: 768px) {
    padding: 5px 8px; /* Smaller padding on small screens */
    gap: px; /* Reduce gap between icon and text */
  }
`;

const IconContainer = styled.div`
  width: 25px; /* Smaller size for icons */
  height: 25px; /* Smaller size for icons */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #008DD5;

  @media (max-width: 768px) {
    width: 16px; /* Even smaller on small screens */
    height: 16px;
  }
`;

const StyledIcon = styled.div`
  color: white;
  font-size: 12px;
  MARGIN-TOP:1PX;

  @media (max-width: 768px) {
    font-size: 10px; /* Smaller icon size on small screens */
  }
`;

const CategoryTitle = styled.h3`
  font-size: 0.9rem; /* Smaller text size */
  color: #333;
  margin: 0;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) {
    font-size: 0.6rem; /* Further reduce font size on small screens */
  }
`;

// Define the categories data
const categories = [
  { id: 1, icon: <FaMoneyBillWave />, title: 'Cashbacks', link: '/payments/gift-cards' },
  { id: 2, icon: <FaTags />, title: 'Discounts', link: '/payments' },
  { id: 3, icon: <FaUtensils />, title: 'Eat', link: '/food-delivery' },
  { id: 4, icon: <FaShoppingCart />, title: 'Retail', link: '/shop' },
  { id: 5, icon: <FaBed />, title: 'Stay', link: '/stay-booking' },
  // { id: 6, icon: <GiBuyCard />, title: 'Buy', link: '/payments' },
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
