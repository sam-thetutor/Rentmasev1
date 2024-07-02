import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

const Container = styled.div`
  padding: 20px;
  padding-left: 250px; /* Adjust this value to change the left padding */
  padding-right: 250px; /* Adjust this value to change the right padding */
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #00B5E2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 10px;
`;

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {}; // Default to an empty object if state is undefined
  const { startDate, endDate, guests, place, total } = state;
  const userLocation = 'india'; // Replace with actual location logic
  const currencySymbol = getCurrencySymbol(userLocation);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  if (!place) {
    return <Container>Booking details are missing. Please go back and try again.</Container>;
  }

  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const tax = total * 0.18;
  const grandTotal = total + tax;

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingId = Math.floor(Math.random() * 1000000); // Generate a random booking ID
    const newBooking = {
      bookingId,
      fullName,
      email,
      phone,
      startDate,
      endDate,
      guests,
      place,
      total: grandTotal,
    };

    // Save booking to local storage
    const bookings = JSON.parse(localStorage.getItem('travelBookings')) || [];
    bookings.push(newBooking);
    localStorage.setItem('travelBookings', JSON.stringify(bookings));

    // alert('Booking confirmed successfully!');
    navigate('/travel-bookings');
  };

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
          <PriceDetail>Subtotal: {currencySymbol}{convertPrice(total, userLocation)}</PriceDetail>
          <PriceDetail>Tax (18%): {currencySymbol}{convertPrice(tax, userLocation)}</PriceDetail>
          <TotalPrice>Total: {currencySymbol}{convertPrice(grandTotal, userLocation)}</TotalPrice>
        </Summary>
      </Section>
      <Section>
        <h2>Continue with Mobile Number</h2>
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="fullName">Full Name</Label>
          <Input type="text" id="fullName" name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Label htmlFor="phone">Phone Number</Label>
          <Input type="tel" id="phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Button type="submit">Confirm Booking</Button>
        </Form>
      </Section>
    </Container>
  );
};

export default BookingConfirmation;
