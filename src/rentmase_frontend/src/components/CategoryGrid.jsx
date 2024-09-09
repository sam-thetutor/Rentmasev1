import React from 'react';
import styled from 'styled-components';
import { FaUtensils, FaShoppingCart,FaMoneyBillWave, FaTags,FaBed } from 'react-icons/fa';
import { GiBuyCard } from "react-icons/gi";
import { Link } from 'react-router-dom';

// Define the styled-components
// Define the styled-components
const GridContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 10px 15px;
  border: 2px solid #008DD5; /* Outline around the entire container */
  border-radius: 50px; /* Full pill-shaped border */
  background-color: transparent;
`;

const CategoryCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px; /* Space between icon and text */
  background-color: transparent;
  border-radius: 30px;
  padding: 10px 20px; /* Padding inside the link */
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none; /* Remove default link styling */
  color: #333;

  &:hover {
    background-color: #E8F8FF; /* Light blue background on hover */
    transform: scale(1.05);
    outline: 2px solid #008DD5;
  }
`;

const IconContainer = styled.div`
  width: 30px; /* Smaller width */
  height: 30px; /* Smaller height */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #008DD5;
`;

const StyledIcon = styled.div`
  color: white;
  font-size: 16px; /* Icon size */
`;

const CategoryTitle = styled.h3`
  font-size: 1rem;
  color: #333;
  margin: 0;
  font-family: 'Poppins', sans-serif; /* Apply Poppins */
`;




const categories = [
  // { id: 1, icon: <FaUtensils />, title: 'EAT', link: '/food-delivery' },
  // { id: 2, icon: <FaShoppingCart />, title: 'RETAIL', link: '/shop' },
  // { id: 3, icon: <FaBed />, title: 'STAY', link: '/stay-booking' },
  // { id: 4, icon: <GiBuyCard />, title: 'Buy', link: '/payments' },
  { id: 5, icon: <FaMoneyBillWave />, title: 'CashBacks', link: '/' },  // New icon for CashBacks
  { id: 6, icon: <FaTags />, title: 'Discounted', link: '/payments' },
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
