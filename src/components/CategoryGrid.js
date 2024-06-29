import React from 'react';
import styled from 'styled-components';
import { ReactComponent as EatIcon } from '../images/eat.svg';
import { ReactComponent as RetailIcon } from '../images/Retail.svg';
import { ReactComponent as StayIcon } from '../images/Travel.svg';
// import { ReactComponent as ServicesIcon } from '../images/Services.svg';
// import { ReactComponent as BeautyIcon } from '../images/beauty.svg';
// import { ReactComponent as ActivitiesIcon } from '../images/activities.svg';

// Define the styled-components
const GridContainer = styled.div`
  display: flex;
  justify-content: center; /* Center the grid */
  gap: 10px; /* Reduce the spacing between the boxes */
  padding: 20px;
`;

const CategoryCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ;
  border-radius: 15px;
  padding: 20px;
  
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 50px; /* Fixed width */
  height: 150px; /* Fixed height */

  &:hover {
    transform: scale(1.05);
    
  }
`;

const IconContainer = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #e0e0e0;
  margin-bottom: 10px;
`;

const StyledIcon = styled.div`
  width: 40px;
  height: 40px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const CategoryTitle = styled.h3`
  font-size: 1rem;
  color: #333;
`;

const categories = [
  { id: 1, icon: <EatIcon />, title: 'EAT' },
  { id: 2, icon: <RetailIcon />, title: 'RETAIL' },
  { id: 3, icon: <StayIcon />, title: 'STAY' },
//   { id: 4, icon: <ServicesIcon />, title: 'SERVICES' },
//   { id: 5, icon: <BeautyIcon />, title: 'BEAUTY' },
//   { id: 6, icon: <ActivitiesIcon />, title: 'ACTIVITIES' },
];

const CategoryGrid = () => {
  return (
    <GridContainer>
      {categories.map(({ id, icon, title }) => (
        <CategoryCard key={id}>
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
