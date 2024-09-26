import styled from "styled-components";
import { useEffect } from "react";
import BuyProductCard from "./BuyProductCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setCountries } from "../../redux/slices/app";

// Styled components
const Title = styled.h1`
  font-family: Arial, sans-serif;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  align-self: center;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 330px)); /* Responsive grid */
  gap: 40px; /* Space between grid items */
  padding: 20px;
  justify-content: center; /* Center the grid horizontally */
  align-items: center; /* Center the content vertically */
  max-width: 1000px; /* Limit the width */
  margin: 0 auto; /* Center the grid on the page */
`;

const services = [
  {
    id: 1,
    name: "Airtime Top Up",
    link: "/airtime",
    description: "Top up your airtime",
    image: "/images/topup.jpg", // Public folder path
    price: 0,
  },
  {
    id: 2,
    name: "Gift Cards",
    link: "/gift-cards",
    description: "Buy gift cards",
    image: "/images/gift-cards.jpg", // Public folder path
    price: 0,
  },
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
    <div>
      <Title>Top up airtime and data at discounted prices and buy gift cards and earn cashbacks</Title>
      <GridContainer>
        {services.map((product) => (
          <BuyProductCard key={product.id} product={product} />
        ))}
      </GridContainer>
    </div>
  );
};

export default Payments;
