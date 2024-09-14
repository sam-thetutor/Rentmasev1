import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

// Container similar to OrdersContainer
const BookingsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: transparet;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

// Title styled similar to Orders
const Title = styled.h1`
  text-align: center;
  color: #008DD5;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
`;

// BookingItem styled similar to OrderItem
const BookingItem = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

// BookingDetail styled similar to OrderDetail
const BookingDetail = styled.p`
  margin: 5px 0;
  font-size: 16px;
  color: #555;
`;

const ItemsTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-top: 15px;
  margin-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 5px;
`;

// Total price styled similarly
const TotalPrice = styled.p`
  color: #333;
  font-weight: bold;
  font-size: 20px;
  margin-top: 10px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

// Empty bookings message similar to EmptyOrdersMessage
const EmptyBookingsMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #888;
  margin-top: 20px;
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
    <BookingsContainer>
      <Title>Rentals</Title>
      {bookings.length === 0 ? (
        <EmptyBookingsMessage>No travel bookings found.</EmptyBookingsMessage>
      ) : (
        bookings.map((booking, index) => (
          <BookingItem key={index}>
            <BookingDetail><strong>Booking ID:</strong> {booking.bookingId}</BookingDetail>
            <BookingDetail><strong>Name:</strong> {booking.fullName}</BookingDetail>
            <BookingDetail><strong>Email:</strong> {booking.email}</BookingDetail>
            <BookingDetail><strong>Phone:</strong> {booking.phone}</BookingDetail>
            <BookingDetail><strong>Place:</strong> {booking.place.name}</BookingDetail>
            <BookingDetail><strong>Description:</strong> {booking.place.details.description}</BookingDetail>
            <TotalPrice>Total: {currencySymbol}{convertPrice(booking.total, userLocation)}</TotalPrice>
          </BookingItem>
        ))
      )}
    </BookingsContainer>
  );
};

export default TravelBookings;
