import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Rentals from './pages/Rentals';
import FoodDelivery from './pages/FoodDelivery';
import RestaurantDetail from './pages/RestaurantDetail';
import Restaurants from './pages/Restaurants';
import Cart from './pages/Cart';
import OrderConfirmation from './pages/OrderConfirmation';
import PlaceDetail from './pages/PlaceDetail';
import BookingConfirmation from './pages/BookingConfirmation';
import FoodOrders from './components/FoodOrders';
import ManageAddresses from './pages/ManageAddresses';
import TravelBookings from './components/TravelBookings';
import Profile from './pages/Profile';
import InviteFriends from './pages/InviteFriends';
import StayBooking from './pages/StayBooking';
import Shop from './pages/Shop';
import ShopProductDetails from './pages/ShopProductDetails';
import OrderHistoryPage from './pages/OrderHistoryPage';
import { CartProvider } from './hooks/useCart';
import { OrderHistoryProvider } from './hooks/useOrderHistory';
import Checkout from './pages/Checkout';
import Footer from './components/Footer';
import { useAuth } from './hooks/Context';
import Register from './pages/register/Register';
import Leaderboard from './pages/Leaderboard';
import Payments from './pages/payments/Payments';
import Bills from './pages/bills/Bills';
import Airtime from './pages/airtime/Airtime';
import Gift from './pages/gift/Gift';
import { useAuthenticateMutation } from './redux/api/servicesSlice';
import { fetchTokens } from './hooks/tokens/tokens';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';


function App() {
  const [
    authenticate
  ] = useAuthenticateMutation();
  const { backendActor, isAuthenticated, setUser } = useAuth();
  const {audience} = useSelector((state : RootState) => state.app);

  // const getTokens = async () => {
  //   const tokens = await fetchTokens();
  //   console.log("Tokens: ", tokens);
  // }

  // useEffect(() => {
  //   getTokens();
  // }, []);


  useEffect(() => {
    if (isAuthenticated) {
      authenticate({audience: audience})
    }
  }, [isAuthenticated, authenticate, audience]);

  useEffect(() => {
    if (isAuthenticated && backendActor) {
      getUser();
    }
  }, [isAuthenticated, backendActor]);

  const getUser = async () => {
    const user = await backendActor.getUser();
    if ("ok" in user) {
      setUser(user.ok);
    }
  }

  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  const handleQuantityChange = (productId, quantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === productId ? { ...item, quantity: parseInt(quantity) } : item
      )
    );
  };

  const handleCheckout = (formData) => {
    setOrders([...orders, formData]);
    setCartItems([]);
  };

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
            <Route path="/checkout" element={<Checkout cartItems={cartItems} onRemove={handleRemoveFromCart} onQuantityChange={handleQuantityChange} onCheckout={handleCheckout} />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/place/:id" element={<PlaceDetail />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/deliveries" element={<FoodOrders />} />
            <Route path="/manage-addresses" element={<ManageAddresses />} />
            <Route path="/travel-bookings" element={<TravelBookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/invite-friends" element={<InviteFriends />} />
            <Route path="/stay-booking" element={<StayBooking />} />
            <Route path="/shop" element={<Shop addToCart={handleAddToCart} />} />
            <Route path="/product/:id" element={<ShopProductDetails addToCart={handleAddToCart} />} />
            <Route path="/order-history" element={<OrderHistoryPage orders={orders} />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/payments/bills" element={<Bills />} />
            <Route path="/payments/airtime" element={<Airtime />} />
            <Route path="/payments/gift-cards" element={<Gift />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
          <Footer />
        </Router>
      </OrderHistoryProvider>
    </CartProvider>
  );
}

export default App;
