import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLazyGetCountryOperatersQuery } from '../../redux/api/servicesSlice';
import { CountryData } from './types';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-height: 600px;
  min-width : 500px;
  overflow-y: auto; 
  padding: 20px;
  box-sizing: border-box;
  background-color: #f9f9f9;
  border-radius: 12px;
  border: 2px solid #ddd;
`;

const OperatorCard = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 150px; /* Adjust to fit your design */
  background-color: ${props => (props.selected ? '#e0f7fa' : '#ffffff')};
  border: 2px solid ${props => (props.selected ? '#00acc1' : '#ddd')};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;

  &:hover {
    background-color: #f1f1f1;
  }

  img {
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
  }

  .operator-name {
    font-size: 10px;
    font-weight: bold;
    text-align: center;
  }

  .tick {
    display: ${props => (props.selected ? 'block' : 'none')};
    font-size: 24px;
    color: #00acc1;
  }
`;

type Props = {
    setSelectedOperator: (value: any) => void;
    selectedOperator: any;
    selectedCountry: CountryData | null;
    };

const CheckOperators : FC<Props> = ({ setSelectedOperator, selectedOperator, selectedCountry}) => {
    const [getOperators] = useLazyGetCountryOperatersQuery();
    const [operatorsData, setOperatorsData] = useState<any[]>([]);

    useEffect(() => {
      if (selectedCountry) {
        getOperators({ countryCode: selectedCountry.isoName }).unwrap().then((res) => {
            setOperatorsData(res);
        });
      }
    }, [selectedCountry, getOperators]);

  const handleSelectOperator = (args: any) => {
    setSelectedOperator(args);
  };



  return (
    <Container>
      {operatorsData.map(operator => (
        <OperatorCard
          key={operator.id}
          selected={operator.id === selectedOperator?.id}
          onClick={() => handleSelectOperator(operator)}
        >
          {operator.id === selectedOperator && <div className="tick">✔</div>}
          <img src={operator.logoUrls[0]} alt={`${operator.logoUrls[0]} Logo`} />
          <span className='operator-name'>{operator.name}</span>
        </OperatorCard>
      ))}
    </Container>
  );
};

export default CheckOperators;
