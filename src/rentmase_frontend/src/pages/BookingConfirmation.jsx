import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

const Container = styled.div`
  padding: 20px;
  padding-left: 250px;
  padding-right: 250px;
  background-color: transparent;

  @media (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }
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
  margin-bottom: 20px;
  font-family: 'Poppins', sans-serif;
`;

const Section = styled.section`
  margin: 20px 0;
`;

const PriceDetail = styled.p`
  color: #333;
  font-size: 18px;
  font-family: 'Poppins', sans-serif;
`;

const StyledImage = styled.img`
  width: 100%;
  max-width: 600px;
  height: auto;
  display: block;
  margin: 0 auto 20px;
  border-radius: 10px;
  object-fit: cover;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: 'Poppins', sans-serif;
`;

const Button = styled.button`
  padding: 10px;
  background-color: ${({ disabled }) => (disabled ? '#ccc' : '#008DD5')};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#ccc' : '#008dd5')};
  }
`;

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {}; // Default to an empty object if state is undefined
  const { place } = state;
  const userLocation = ''; // Replace with actual location logic
  const currencySymbol = getCurrencySymbol(userLocation);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const isFormValid = fullName && email && phone;

  if (!place) {
    return <Container>Booking details are missing. Please go back and try again.</Container>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingId = Math.floor(Math.random() * 1000000); // Generate a random booking ID
    const newBooking = {
      bookingId,
      fullName,
      email,
      phone,
      place,
      total: place.price, // Assuming price is per month
    };

    // Save booking to local storage
    const bookings = JSON.parse(localStorage.getItem('travelBookings')) || [];
    bookings.push(newBooking);
    localStorage.setItem('travelBookings', JSON.stringify(bookings));

    navigate('/travel-bookings');
  };

  return (
    <Container>
      <Title>Request to Book</Title>
      <Section>
        <Summary>
          <h2>{place.name}</h2>
          <p>{place.details.description}</p>
          <StyledImage src={place.imageUrl} alt={place.name} />
          <PriceDetail>
            Price: {currencySymbol}
            {convertPrice(place.price, userLocation)} per month
          </PriceDetail>
        </Summary>
      </Section>
      <Section>
        <h2>Continue with Mobile Number</h2>
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            type="text"
            id="fullName"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Button type="submit" disabled={!isFormValid}>
            Confirm Booking
          </Button>
        </Form>
      </Section>
    </Container>
  );
};

export default BookingConfirmation;
