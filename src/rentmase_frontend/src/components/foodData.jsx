// src/data/foodData.js
const foodData = {
  restaurants: [
    {
      id: 1,
      name: 'McDonald\'s',
      imageUrl: '/images/RESTAURANTS/McDonalds/logo.png',
      details: 'Burgers, Fast Food, Beverages',
      location: 'JM Road, Pune',
      rating: 4.2,
      reviews: 120,
      time: '29 min',
      priceRange: [3, 10],  // More realistic price range in USD
      menu: [
        { id: 1, name: 'Big Mac', imageUrl: '/images/RESTAURANTS/McDonalds/big_mac.png', price: 5.99 },
        { id: 2, name: 'McChicken', imageUrl: '/images/RESTAURANTS/McDonalds/mcchicken.png', price: 4.49 },
        { id: 3, name: 'French Fries', imageUrl: '/images/RESTAURANTS/McDonalds/french_fries.png', price: 2.79 },
        { id: 4, name: 'Coke', imageUrl: '/images/RESTAURANTS/McDonalds/coke.png', price: 1.99 },
      ],
    },
    {
      id: 2,
      name: 'Burger King',
      imageUrl: '/images/RESTAURANTS/BurgerKing/logo.png',
      details: 'Burger, Fast Food, Beverages',
      location: 'MG Road, Pune',
      rating: 4.0,
      reviews: 200,
      time: '39 min',
      priceRange: [3, 10],  // More realistic price range in USD
      menu: [
        { id: 1, name: 'Whopper', imageUrl: '/images/RESTAURANTS/BurgerKing/whopper.png', price: 6.49 },
        { id: 2, name: 'Chicken Fries', imageUrl: '/images/RESTAURANTS/BurgerKing/chicken_fries.png', price: 3.99 },
        { id: 3, name: 'Veggie Burger', imageUrl: '/images/RESTAURANTS/BurgerKing/veggie_burger.png', price: 5.29 },
        { id: 4, name: 'Coke', imageUrl: '/images/RESTAURANTS/BurgerKing/coke.png', price: 1.99 },
      ],
    },
    {
      id: 3,
      name: 'KFC',
      imageUrl: '/images/RESTAURANTS/KFC/logo.png',
      details: 'Fast Food, Beverages',
      location: 'FC Road, Pune',
      rating: 4.1,
      reviews: 150,
      time: '33 min',
      priceRange: [4, 12],  // More realistic price range in USD
      menu: [
        { id: 1, name: 'Zinger Burger', imageUrl: '/images/RESTAURANTS/KFC/zinger_burger.png', price: 5.99 },
        { id: 2, name: 'Chicken Popcorn', imageUrl: '/images/RESTAURANTS/KFC/chicken_popcorn.png', price: 4.99 },
        { id: 3, name: 'French Fries', imageUrl: '/images/RESTAURANTS/KFC/french_fries.png', price: 2.49 },
        { id: 4, name: 'Pepsi', imageUrl: '/images/RESTAURANTS/KFC/pepsi.png', price: 1.99 },
      ],
    },
    {
      id: 4,
      name: 'Subway',
      imageUrl: '/images/RESTAURANTS/Subway/logo.png',
      details: 'Healthy Food, Beverages',
      location: 'KP Road, Pune',
      rating: 4.3,
      reviews: 100,
      time: '25 min',
      priceRange: [5, 10],  // More realistic price range in USD
      menu: [
        { id: 1, name: 'Veggie Delight', imageUrl: '/images/RESTAURANTS/Subway/veggie_delight.png', price: 6.49 },
        { id: 2, name: 'Chicken Teriyaki', imageUrl: '/images/RESTAURANTS/Subway/chicken_teriyaki.png', price: 7.49 },
        { id: 3, name: 'Tuna Sandwich', imageUrl: '/images/RESTAURANTS/Subway/tuna_sandwich.png', price: 6.99 },
        { id: 4, name: 'Iced Tea', imageUrl: '/images/RESTAURANTS/Subway/iced_tea.png', price: 1.99 },
      ],
    },
    {
      id: 5,
      name: 'Starbucks',
      imageUrl: '/images/RESTAURANTS/Starbucks/logo.png',
      details: 'Coffee, Beverages, Snacks',
      location: 'Camp, Pune',
      rating: 4.5,
      reviews: 300,
      time: '45 min',
      priceRange: [3, 7],  // More realistic price range in USD
      menu: [
        { id: 1, name: 'Cappuccino', imageUrl: '/images/RESTAURANTS/Starbucks/cappuccino.png', price: 4.25 },
        { id: 2, name: 'Espresso', imageUrl: '/images/RESTAURANTS/Starbucks/espresso.png', price: 2.95 },
        { id: 3, name: 'Chocolate Croissant', imageUrl: '/images/RESTAURANTS/Starbucks/chocolate_croissant.png', price: 3.45 },
        { id: 4, name: 'Blueberry Muffin', imageUrl: '/images/RESTAURANTS/Starbucks/blueberry_muffin.png', price: 2.95 },
      ],
    },
  ],
};

export default foodData;
