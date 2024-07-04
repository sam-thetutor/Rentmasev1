const shopData = {
  categories: [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Makeup/Beauty' },
    { id: 3, name: 'Grocery' },
    { id: 4, name: 'Other Online Products' },
  ],
  products: [
    {
      id: 1,
      name: 'Laptop',
      brand: 'Brand A',
      category: 'Electronics',
      price: 800,
      imageUrl: "https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200",
      description: 'A powerful laptop with high performance and sleek design.',
      images: [
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
      ],
      reviews: [
        { id: 1, name: 'Alice', comment: 'Excellent laptop!', rating: 5 },
        { id: 2, name: 'Bob', comment: 'Very fast and reliable.', rating: 4 },
      ],
    },
    {
      id: 2,
      name: 'Smartphone',
      brand: 'Brand B',
      category: 'Electronics',
      price: 600,
    imageUrl: "https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200",
      description: 'A sleek smartphone with a stunning display and great features.',
      images: [
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
      ],
      reviews: [
        { id: 1, name: 'Charlie', comment: 'Love the camera quality!', rating: 5 },
        { id: 2, name: 'David', comment: 'Battery life could be better.', rating: 3 },
      ],
    },
    {
      id: 3,
      name: 'Foundation',
      brand: 'Brand C',
      category: 'Makeup/Beauty',
      price: 25,
    imageUrl: "https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200",
      description: 'A long-lasting foundation with a flawless finish.',
      images: [
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
      ],
      reviews: [
        { id: 1, name: 'Eve', comment: 'Perfect for my skin tone!', rating: 5 },
        { id: 2, name: 'Fiona', comment: 'Blends well and stays all day.', rating: 4 },
      ],
    },
    {
      id: 4,
      name: 'Lipstick',
      brand: 'Brand D',
      category: 'Makeup/Beauty',
      price: 15,
    imageUrl: "https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200",
      description: 'A vibrant lipstick with long-lasting color.',
      images: [
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
      ],
      reviews: [
        { id: 1, name: 'Grace', comment: 'Beautiful color!', rating: 5 },
        { id: 2, name: 'Hannah', comment: 'Moisturizes my lips.', rating: 4 },
      ],
    },
    {
      id: 5,
      name: 'Organic Apples',
      brand: 'Brand E',
      category: 'Grocery',
      price: 5,
    imageUrl: "https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200",
      description: 'Fresh organic apples with a crisp taste.',
      images: [
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
      ],
      reviews: [
        { id: 1, name: 'Isaac', comment: 'Very fresh and tasty!', rating: 5 },
        { id: 2, name: 'Jack', comment: 'Great for making pies.', rating: 4 },
      ],
    },
    {
      id: 6,
      name: 'Cereal',
      brand: 'Brand F',
      category: 'Grocery',
      price: 4,
    imageUrl: "https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200",
      description: 'A healthy cereal to start your day right.',
      images: [
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
      ],
      reviews: [
        { id: 1, name: 'Kate', comment: 'Very nutritious!', rating: 5 },
        { id: 2, name: 'Liam', comment: 'My kids love it.', rating: 4 },
      ],
    },
    {
      id: 7,
      name: 'Yoga Mat',
      brand: 'Brand G',
      category: 'Other Online Products',
      price: 20,
    imageUrl: "https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200",
      description: 'A comfortable yoga mat for your daily practice.',
      images: [
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
      ],
      reviews: [
        { id: 1, name: 'Mia', comment: 'Great quality and non-slip!', rating: 5 },
        { id: 2, name: 'Noah', comment: 'Perfect for my workouts.', rating: 4 },
      ],
    },
    {
      id: 8,
      name: 'Water Bottle',
      brand: 'Brand H',
      category: 'Other Online Products',
      price: 10,
      imageUrl: "https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200",

      description: 'A durable water bottle to keep you hydrated.',
      images: [
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
        'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=300x200',
      ],
      reviews: [
        { id: 1, name: 'Olivia', comment: 'Keeps my water cold all day!', rating: 5 },
        { id: 2, name: 'Paul', comment: 'Very sturdy and leak-proof.', rating: 4 },
      ],
    },
  ],
};

export default shopData;
