import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Rentals from './pages/Rentals';
import FoodDelivery from './pages/FoodDelivery';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/food-delivery" element={<FoodDelivery />} />
      </Routes>
    </Router>
  );
}

export default App;
