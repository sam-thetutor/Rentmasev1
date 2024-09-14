import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import shopData from '../data/shopData';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';
import { getCurrencySymbol, convertPrice } from '../utils/currency';
import { useCart } from '../hooks/useCart';

const Container = styled.div`
  padding: 20px;
  padding-left: 10%;
  padding-right: 10%;
  background-color: #f5f5f5;

  @media (max-width: 768px) {
    padding-left: 5%;
    padding-right: 5%;
  }
`;

const ImageGridContainer = styled.div`
  margin-bottom: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-right: 20px;
`;

const ProductStickySection = styled.div`
  width: 100%;
  max-width: 300px;
  margin: 20px 0;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow: auto;
`;

const MainImageContainer = styled.div`
  position: relative;
  grid-area: main;
  width: 100%;
  height: 100%;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const GridImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-areas:
    "main main side1 side2"
    "main main side3 side4";
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: repeat(2, 200px);
  grid-gap: 10px;

  @media (max-width: 768px) {
    grid-template-areas:
      "main"
      "side1"
      "side2"
      "side3"
      "side4";
    grid-template-columns: 1fr;
    grid-template-rows: repeat(5, auto);
  }
`;

const ShowMoreButton = styled.button`
  position: absolute;
  bottom: 10px;
  left: 10px;
  padding: 10px 20px;
  background-color: #008DD5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 10px;
`;

const Section = styled.section`
  margin: 20px 0;
`;

const ReviewsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Review = styled.li`
  padding: 10px 0;
`;

const Price = styled.p`
  color: #333;
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #cccccc; /* Gray out the button when disabled */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: not-allowed; /* Indicate the button is not clickable */
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 80%;
  max-height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalImage = styled.img`
  width: 100%;
  height: auto;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;

  &:first-of-type {
    left: 10px;
  }

  &:last-of-type {
    right: 10px;
  }
`;

const ShopProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = shopData.products.find((product) => product.id.toString() === id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  if (!product) {
    return <Container>Product not found</Container>;
  }

  const userLocation = ''; // Replace with actual location logic
  const currencySymbol = getCurrencySymbol(userLocation);
  const convertedPrice = convertPrice(product.price, userLocation);

  const placeholderImage = 'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=No+Image';
  const mainImageUrl = product.images && product.images.length > 0 ? product.images[0] : placeholderImage;
  const imageUrls = product.images && product.images.length > 0 ? product.images : [placeholderImage];

  return (
    <Container>
      <ImageGridContainer>
        <ImageGrid>
          <MainImageContainer>
            <MainImage src={mainImageUrl} alt={`${product.name} main`} />
            <ShowMoreButton onClick={() => openModal(0)}>Show More</ShowMoreButton>
          </MainImageContainer>
          {imageUrls.slice(1, 5).map((img, index) => (
            <GridImage
              key={index}
              src={img}
              alt={`${product.name} ${index + 1}`}
              style={{ gridArea: `side${index + 1}` }}
              onClick={() => openModal(index + 1)}
            />
          ))}
        </ImageGrid>
      </ImageGridContainer>
      <ContentWrapper>
        <MainContent>
          <Title>{product.name}</Title>
          
          <Section>
            <p>{product.description}</p>
          </Section>

          <Section>
            <h3>Reviews</h3>
            <ReviewsList>
              {product.reviews && product.reviews.map((review) => (
                <Review key={review.id}>
                  <p>{review.name}</p>
                  <p>{review.comment}</p>
                  <p>Rating: {review.rating}</p>
                </Review>
              ))}
            </ReviewsList>
          </Section>
        </MainContent>
        <ProductStickySection>
          <Price>{currencySymbol}{convertedPrice}</Price>
          <Button disabled>
            {isAddedToCart ? <FaCheck style={{ marginRight: '8px' }} /> : null}
            {isAddedToCart ? 'Added to Cart' : 'Add to Cart'}
          </Button>
        </ProductStickySection>
      </ContentWrapper>
      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ArrowButton onClick={showPreviousImage}><FaArrowLeft /></ArrowButton>
          <ModalImage src={imageUrls[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`} />
          <ArrowButton onClick={showNextImage}><FaArrowRight /></ArrowButton>
        </ModalContent>
        <Button onClick={closeModal} style={{ position: 'absolute', top: '20px', right: '20px' }}>Close</Button>
      </Modal>
    </Container>
  );
};

export default ShopProductDetails;
