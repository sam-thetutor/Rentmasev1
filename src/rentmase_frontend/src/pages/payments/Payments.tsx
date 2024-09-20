import styled from "styled-components";
import { useAuth } from "../../hooks/Context";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "../../components/ProductCard";
import { useEffect, useRef, useState } from "react";
import BuyProductCard from "./BuyProductCard";
import { link } from "fs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setCountries } from "../../redux/slices/app";
import { CountryData } from "../airtime/types";

const Title = styled.h1`
    font-family: Arial, sans-serif;
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
    align-self: center;
    `;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 20px 0;
`;

const List = styled.div`
  display: flex;
  overflow-x: hidden;
  scroll-behavior: smooth;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  padding: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
    outline: 2px solid #00B5E2;
  }

  &:first-of-type {
    left: 10px;
  }

  &:last-of-type {
    right: 10px;
  }
`;

const services = [
  {
    id: 1,
    name: "Airtime Top Up",
    link: "/airtime",
    description: "Top up your airtime",
    image: "https://via.placeholder.com/150",
    price: 0,
  },
  {
    id: 6,
    name: "Gift Cards",
    link: "/gift-cards",
    description: "Buy gift cards",
    image: "https://via.placeholder.com/150",
    price: 0,
  },
  // {
  //   id: 7,
  //   name: "Bills",
  //   link: "/bills",
  //   description: "Pay bills",
  //   image: "https://via.placeholder.com/150",
  //   price: 0,
  // }
];


const Payments = () => {
  const { location } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();

    useEffect(() => {
        if (location) {
            getCountries();
        }
    }, [location]);

    const getCountries = async () => {
        const response = await fetch("https://topups.reloadly.com/countries");
        const data = await response.json();
        dispatch(setCountries(data));
    };

  return (
    <div><Title>
      Top up airtime and data, pay bills, and buy gift cards
    </Title>
      <CarouselContainer>
        <ArrowButton
        //  onClick={scrollLeft } 
        >
          <FaChevronLeft />
        </ArrowButton>
        <List >
          {services.map((product) => (
            <BuyProductCard
              key={product.id}
              product={product}
            />
          ))}
        </List>
        <ArrowButton
        //   onClick={scrollRight}
        >
          <FaChevronRight />
        </ArrowButton>
      </CarouselContainer>
    </div>
  )
}

export default Payments