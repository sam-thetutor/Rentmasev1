import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
`;

const Summary = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #333;
`;

const Section = styled.section`
  margin: 20px 0;
`;

const PriceDetail = styled.p`
  color: #333;
  font-size: 18px;
`;

const TotalPrice = styled.p`
  color: #333;
  font-weight: bold;
  font-size: 24px;
`;

const StyledImage = styled.img`
  width: 100%;
  max-width: 600px;
  height: auto;
  display: block;
  margin: 0 auto;
`;

const BookingConfirmation = () => {
  const location = useLocation();
  const state = location.state || {}; // Default to an empty object if state is undefined
  const { startDate, endDate, guests, place, total } = state;

  if (!place) {
    return <Container>Booking details are missing. Please go back and try again.</Container>;
  }

  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const tax = total * 0.18;
  const grandTotal = total + tax;

  return (
    <Container>
      <Title>Request to Book</Title>
      <Section>
        <h2>Your trip</h2>
        <p>Dates: {new Date(startDate).toDateString()} - {new Date(endDate).toDateString()}</p>
        <p>Guests: {guests}</p>
      </Section>
      <Section>
        <Summary>
          <h2>{place.name}</h2>
          <p>{place.details.description}</p>
          <StyledImage src={place.imageUrl} alt={place.name} />
          <PriceDetail>{days} nights</PriceDetail>
          <PriceDetail>Subtotal: ₹{total.toFixed(2)}</PriceDetail>
          <PriceDetail>Tax (18%): ₹{tax.toFixed(2)}</PriceDetail>
          <TotalPrice>Total (INR): ₹{grandTotal.toFixed(2)}</TotalPrice>
        </Summary>
      </Section>
      <Section>
        <h2>Log in or sign up to book</h2>
        <form>
          <label htmlFor="phone">Phone number</label>
          <input type="tel" id="phone" name="phone" required />
          <button type="submit">Continue</button>
        </form>
        <p>or</p>
        <button>Facebook</button>
        <button>Google</button>
        <button>Apple</button>
      </Section>
    </Container>
  );
};

export default BookingConfirmation;
