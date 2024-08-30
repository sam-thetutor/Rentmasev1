// src/utils/currency.js

export const getCurrencySymbol = (location) => {
  switch (location) {
    case 'india':
      return '₹';
    case 'europe':
      return '€';
    case 'uk':
      return '£';
    default:
      return '$';
  }
};

export const convertPrice = (price, location) => {
  switch (location) {
    case 'india':
      return (price * 75).toFixed(2); // Example conversion rate
    case 'europe':
      return (price * 0.85).toFixed(2); // Example conversion rate
    case 'uk':
      return (price * 0.75).toFixed(2); // Example conversion rate
    default:
      return price.toFixed(2);
  }
};
