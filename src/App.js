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
import BookingConfirmation from './components/BookingConfirmation';
import { CartProvider } from './hooks/useCart';
import { OrderHistoryProvider } from './hooks/useOrderHistory';
import FoodOrders from './components/FoodOrders';

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
            <Route path="/food-orders" element={<FoodOrders />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          </Routes>
        </Router>
      </OrderHistoryProvider>
    </CartProvider>
  );
}

export default App;
