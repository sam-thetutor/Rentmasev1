import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Rentals from './pages/Rentals';
import FoodDelivery from './pages/FoodDelivery';
import RestaurantDetail from './pages/RestaurantDetail';
import Restaurants from './pages/Restaurants';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Navbar from './components/Navbar';
import PlaceDetail from './pages/PlaceDetail';
import BookingConfirmation from './pages/BookingConfirmation';
import FoodOrders from './components/FoodOrders';
import ManageAddresses from './pages/ManageAddresses';
import TravelBookings from './components/TravelBookings';
import Profile from './pages/Profile';
import InviteFriends from './pages/InviteFriends';
import StayBooking from './pages/StayBooking';
import { CartProvider } from './hooks/useCart';
import { OrderHistoryProvider } from './hooks/useOrderHistory';

function App() {
  return (
    <CartProvider>
      <OrderHistoryProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/food-delivery" element={<FoodDelivery />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/place/:id" element={<PlaceDetail />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/food-orders" element={<FoodOrders />} />
            <Route path="/manage-addresses" element={<ManageAddresses />} />
            <Route path="/travel-bookings" element={<TravelBookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/invite-friends" element={<InviteFriends />} />
            <Route path="/stay-booking" element={<StayBooking />} />
          </Routes>
        </Router>
      </OrderHistoryProvider>
    </CartProvider>
  );
}

export default App;
