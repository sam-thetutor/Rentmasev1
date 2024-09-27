import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLazyGetCountryOperatersQuery } from '../../redux/api/servicesSlice';
import { CountryData } from './types';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  max-height: 600px;
  min-width: 100%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    padding: 15px;
  }
`;

const OperatorCard = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: ${(props) => (props.selected ? '#e0f7fa' : '#f9f9f9')};
  border: 2px solid ${(props) => (props.selected ? '#00acc1' : '#ddd')};
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
  
  &:hover {
    background-color: ${(props) => (props.selected ? '#d2f4f7' : '#f1f1f1')};
    transform: scale(1.05);
  }

  img {
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
  }

  .operator-name {
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    color: #333;
  }

  .tick {
    display: ${(props) => (props.selected ? 'block' : 'none')};
    font-size: 24px;
    color: #00acc1;
    position: absolute;
    top: 10px;
    right: 10px;
  }

  @media (max-width: 768px) {
    img {
      width: 50px;
      height: 50px;
    }

    .operator-name {
      font-size: 12px;
    }
  }
`;

type Props = {
  setSelectedOperator: (value: any) => void;
  selectedOperator: any;
  selectedCountry: CountryData | null;
};

const CheckOperators: FC<Props> = ({ setSelectedOperator, selectedOperator, selectedCountry }) => {
  const [getOperators] = useLazyGetCountryOperatersQuery();
  const [operatorsData, setOperatorsData] = useState<any[]>([]);

  useEffect(() => {
    if (selectedCountry) {
      getOperators({ countryCode: selectedCountry.isoName }).unwrap().then((res) => {
        setOperatorsData(res);
      });
    }
  }, [selectedCountry, getOperators]);

  const handleSelectOperator = (operator: any) => {
    setSelectedOperator(operator);
  };

  return (
    <Container>
      {operatorsData.map((operator) => (
        <OperatorCard
          key={operator.id}
          selected={operator.id === selectedOperator?.id}
          onClick={() => handleSelectOperator(operator)}
        >
          <img src={operator.logoUrls[0]} alt={`${operator.name} Logo`} />
          <span className="operator-name">{operator.name}</span>
          {operator.id === selectedOperator?.id && <div className="tick">✔</div>}
        </OperatorCard>
      ))}
    </Container>
  );
};

export default CheckOperators;
