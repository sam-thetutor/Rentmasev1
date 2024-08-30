// src/data/shopData.js

const shopData = {
  categories: [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Makeup/Beauty' },
    { id: 3, name: 'Grocery' },
    { id: 4, name: 'Other Online Products' },
  ],
  products: [
    // Electronics
    {
      id: 1,
      name: 'Dell XPS 13',
      brand: 'Dell',
      category: 'Electronics',
      price: 1200,
      imageUrl: '../images/PRODUCTS/dellxps13b.png',
      description: 'A powerful laptop with high performance and sleek design.',
      images: [
        '../images/PRODUCTS/dellxps13b.png',
        '../images/PRODUCTS/dellxps13a.png',
        '../images/PRODUCTS/dellxps13c.png',
        
      ],
      reviews: [
        { id: 1, name: 'Alice', comment: 'Excellent laptop!', rating: 5 },
        { id: 2, name: 'Bob', comment: 'Very fast and reliable.', rating: 4 },
      ],
    },
    {
      id: 2,
      name: 'Samsung Galaxy S21',
      brand: 'Samsung',
      category: 'Electronics',
      price: 999,
      imageUrl: '../images/PRODUCTS/s21a.png',
      description: 'A sleek smartphone with a stunning display and great features.',
      images: [
        '../images/PRODUCTS/s21b.png',
        '../images/PRODUCTS/s21c.png',
        '../images/PRODUCTS/s21d.png'
      ],
      reviews: [
        { id: 1, name: 'Charlie', comment: 'Love the camera quality!', rating: 5 },
        { id: 2, name: 'David', comment: 'Battery life could be better.', rating: 3 },
      ],
    },
    {
      id: 9,
      name: 'iPad Pro',
      brand: 'Apple',
      category: 'Electronics',
      price: 799,
      imageUrl: "../images/PRODUCTS/ipada.png",
      description: 'A versatile tablet with a stunning display.',
      images: [
        '../images/PRODUCTS/ipada.png',
        '../images/PRODUCTS/ipadb.png',
        '../images/PRODUCTS/ipadc.png',
      ],
      reviews: [
        { id: 1, name: 'Ethan', comment: 'Perfect for reading and browsing.', rating: 4 },
        { id: 2, name: 'Sophia', comment: 'Lightweight and fast.', rating: 5 },
      ],
    },
    {
      id: 10,
      name: 'Sony WH-1000XM4',
      brand: 'Sony',
      category: 'Electronics',
      price: 350,
      imageUrl: "../images/PRODUCTS/sonya.png",
      description: 'Noise-canceling headphones with great sound quality.',
      images: [
        '../images/PRODUCTS/sonya.png',
        '../images/PRODUCTS/sonyb.png',
        
      ],
      reviews: [
        { id: 1, name: 'Oliver', comment: 'Amazing sound quality!', rating: 5 },
        { id: 2, name: 'Isabella', comment: 'Very comfortable to wear.', rating: 4 },
      ],
    },
    // Makeup/Beauty
    {
      id: 3,
      name: 'Maybelline Fit Me Foundation',
      brand: 'Maybelline',
      category: 'Makeup/Beauty',
      price: 8,
      imageUrl: "../images/PRODUCTS/foundation.png",
      description: 'A long-lasting foundation with a flawless finish.',
      images: [
        '../images/PRODUCTS/foundation.png',
       
      ],
      reviews: [
        { id: 1, name: 'Eve', comment: 'Perfect for my skin tone!', rating: 5 },
        { id: 2, name: 'Fiona', comment: 'Blends well and stays all day.', rating: 4 },
      ],
    },
    {
      id: 4,
      name: 'MAC Lipstick',
      brand: 'MAC',
      category: 'Makeup/Beauty',
      price: 18,
      imageUrl: "../images/PRODUCTS/lipstick.png",
      description: 'A vibrant lipstick with long-lasting color.',
      images: [
        '../images/PRODUCTS/lipstick.png',
       
      ],
      reviews: [
        { id: 1, name: 'Grace', comment: 'Beautiful color!', rating: 5 },
        { id: 2, name: 'Hannah', comment: 'Moisturizes my lips.', rating: 4 },
      ],
    },
    {
      id: 11,
      name: 'L\'Oreal Paris Voluminous Mascara',
      brand: 'L\'Oreal',
      category: 'Makeup/Beauty',
      price: 9,
      imageUrl: "../images/PRODUCTS/loreal.png",
      description: 'A waterproof mascara that adds volume to your lashes.',
      images: [
        '../images/PRODUCTS/loreal.png',
       
      ],
      reviews: [
        { id: 1, name: 'Amelia', comment: 'Makes my lashes look amazing!', rating: 5 },
        { id: 2, name: 'Elijah', comment: 'Lasts all day without smudging.', rating: 4 },
      ],
    },
    // Grocery
    {
      id: 5,
      name: 'Organic Fuji Apples',
      brand: 'Organic Farms',
      category: 'Grocery',
      price: 4,
      imageUrl: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
      description: 'Fresh organic apples with a crisp taste.',
      images: [
        'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce',
        'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce',
        'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce',
      ],
      reviews: [
        { id: 1, name: 'Isaac', comment: 'Very fresh and tasty!', rating: 5 },
        { id: 2, name: 'Jack', comment: 'Great for making pies.', rating: 4 },
      ],
    },
    {
      id: 6,
      name: 'Quaker Oats Cereal',
      brand: 'Quaker',
      category: 'Grocery',
      price: 3,
      imageUrl: "../images/PRODUCTS/oats.png",
      description: 'A healthy cereal to start your day right.',
      images: [
        '../images/PRODUCTS/oats.png',
       
      ],
      reviews: [
        { id: 1, name: 'Kate', comment: 'Very nutritious!', rating: 5 },
        { id: 2, name: 'Liam', comment: 'My kids love it.', rating: 4 },
      ],
    },
    {
      id: 12,
      name: 'Tropicana Orange Juice',
      brand: 'Tropicana',
      category: 'Grocery',
      price: 5,
      imageUrl: "../images/PRODUCTS/tropicana.png",
      description: 'Freshly squeezed orange juice with no added sugar.',
      images: [
        '../images/PRODUCTS/tropicana.png',
        
      ],
      reviews: [
        { id: 1, name: 'Nora', comment: 'So refreshing!', rating: 5 },
        { id: 2, name: 'Mason', comment: 'Tastes like real oranges.', rating: 4 },
      ],
    },
    // Other Online Products
    {
      id: 7,
      name: 'Gaiam Yoga Mat',
      brand: 'Gaiam',
      category: 'Other Online Products',
      price: 22,
      imageUrl: "../images/PRODUCTS/yogamat.png",
      description: 'A comfortable yoga mat for your daily practice.',
      images: [
        '../images/PRODUCTS/yogamat.png',
       
      ],
      reviews: [
        { id: 1, name: 'Mia', comment: 'Great quality and non-slip!', rating: 5 },
        { id: 2, name: 'Noah', comment: 'Perfect for my workouts.', rating: 4 },
      ],
    },
    {
      id: 8,
      name: 'Hydro Flask Water Bottle',
      brand: 'Hydro Flask',
      category: 'Other Online Products',
      price: 30,
      imageUrl: "../images/PRODUCTS/hydroflask.png",
      description: 'A durable water bottle to keep you hydrated.',
      images: [
        '../images/PRODUCTS/hydroflask.png',
      ],
      reviews: [
        { id: 1, name: 'Olivia', comment: 'Keeps my water cold all day!', rating: 5 },
        { id: 2, name: 'Paul', comment: 'Very sturdy and leak-proof.', rating: 4 },
      ],
    },
    {
      id: 13,
      name: 'Moleskine Notebook',
      brand: 'Moleskine',
      category: 'Other Online Products',
      price: 15,
      imageUrl: "../images/PRODUCTS/notebook.png",
      description: 'A stylish notebook for your daily notes.',
      images: [
        '../images/PRODUCTS/notebook.png',
        
      ],
      reviews: [
        { id: 1, name: 'Sophia', comment: 'Very good quality paper.', rating: 5 },
        { id: 2, name: 'Liam', comment: 'Perfect for jotting down notes.', rating: 4 },
      ],
    },
  ],
};

export default shopData;
