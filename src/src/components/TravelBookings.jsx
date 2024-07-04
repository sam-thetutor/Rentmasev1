import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

const Container = styled.div`
  padding: 20px;
  padding-left: 250px; /* Adjust this value to change the left padding */
  padding-right: 250px; /* Adjust this value to change the right padding */
  background-color: #f5f5f5;

  @media (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const BookingItem = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const BookingDetail = styled.p`
  color: #333;
  font-size: 16px;
  margin: 5px 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TotalPrice = styled.p`
  color: #333;
  font-weight: bold;
  font-size: 20px;
  margin-top: 10px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const TravelBookings = () => {
  const [bookings, setBookings] = useState([]);
  const userLocation = ''; // Replace with actual location logic
  const currencySymbol = getCurrencySymbol(userLocation);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('travelBookings')) || [];
    setBookings(storedBookings);
  }, []);

  return (
    <Container>
      <Title>Rentals</Title>
      {bookings.length === 0 ? (
        <p>No travel bookings found.</p>
      ) : (
        bookings.map((booking, index) => (
          <BookingItem key={index}>
            <BookingDetail><strong>Booking ID:</strong> {booking.bookingId}</BookingDetail>
            <BookingDetail><strong>Name:</strong> {booking.fullName}</BookingDetail>
            <BookingDetail><strong>Email:</strong> {booking.email}</BookingDetail>
            <BookingDetail><strong>Phone:</strong> {booking.phone}</BookingDetail>
            <BookingDetail><strong>Dates:</strong> {new Date(booking.startDate).toDateString()} - {new Date(booking.endDate).toDateString()}</BookingDetail>
            <BookingDetail><strong>Guests:</strong> {booking.guests}</BookingDetail>
            <BookingDetail><strong>Place:</strong> {booking.place.name}</BookingDetail>
            <BookingDetail><strong>Description:</strong> {booking.place.details.description}</BookingDetail>
            <TotalPrice>Total: {currencySymbol}{convertPrice(booking.total, userLocation)}</TotalPrice>
          </BookingItem>
        ))
      )}
    </Container>
  );
};

export default TravelBookings;
