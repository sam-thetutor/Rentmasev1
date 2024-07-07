import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaArrowRight, FaEnvelope, FaPhone } from 'react-icons/fa';
import placesData from '../data/places';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

const Container = styled.div`
  padding: 20px;
  padding-left: 250px;
  padding-right: 250px;
  background-color: #f5f5f5;

  @media (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const ImageGridContainer = styled.div`
  margin-bottom: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const MainContent = styled.div`
  flex: 1;
  margin-right: 20px;

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const StickySection = styled.div`
  width: 300px;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow: auto;

  @media (max-width: 768px) {
    width: 100%;
    position: static;
    max-height: none;
  }
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
  aspect-ratio: 1/1;
`;

const GridImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 1/1;
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
  background-color: #00B5E2;
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

const Subtitle = styled.h2`
  color: #555;
  margin-bottom: 20px;
`;

const Section = styled.section`
  margin: 20px 0;
`;

const HostInfo = styled.div`
  display: flex;
  align-items: center;
`;

const HostImage = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-right: 20px;
`;

const AmenitiesList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Amenity = styled.li`
  padding: 5px 0;
`;

const ReviewsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Review = styled.li`
  padding: 10px 0;
`;

const ContactSection = styled.section`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Price = styled.p`
  color: #333;
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #555;
`;

const Input = styled.input`
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #00B5E2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const ContactDetails = styled.div`
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
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

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const place = placesData.find((place) => place.id.toString() === id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const userLocation = ''; // Replace with actual location logic
  const currencySymbol = getCurrencySymbol(userLocation);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % place.details.images.length);
  };

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + place.details.images.length) % place.details.images.length);
  };

  const handleBookNow = () => {
    navigate('/booking-confirmation', { state: { place } });
  };

  if (!place) {
    return <Container>Place not found</Container>;
  }

  return (
    <Container>
      <ImageGridContainer>
        <ImageGrid>
          <MainImageContainer>
            <MainImage src={place.details.images[0]} alt={`${place.name} main`} />
            <ShowMoreButton onClick={() => openModal(0)}>Show More</ShowMoreButton>
          </MainImageContainer>
          {place.details.images.slice(1, 5).map((img, index) => (
            <GridImage
              key={index}
              src={img}
              alt={`${place.name} ${index + 1}`}
              style={{ gridArea: `side${index + 1}` }}
              onClick={() => openModal(index + 1)}
            />
          ))}
        </ImageGrid>
      </ImageGridContainer>
      <ContentWrapper>
        <MainContent>
          <Title>{place.name}</Title>
          <Subtitle>Hosted by {place.host}</Subtitle>
          
          <Section>
            <p>{place.details.description}</p>
          </Section>

          <Section>
            <h3>Hosted by</h3>
            <HostInfo>
              <HostImage src={place.hostDetails.imageUrl} alt={place.hostDetails.name} />
              <div>
                <p>{place.hostDetails.name}</p>
                <p>Superhost: {place.hostDetails.superhost ? "Yes" : "No"}</p>
                <p>Response rate: {place.hostDetails.responseRate}</p>
                <p>Languages: {place.hostDetails.languages.join(", ")}</p>
              </div>
            </HostInfo>
            <p>{place.hostDetails.description}</p>
          </Section>

          <Section>
            <h3>Amenities</h3>
            <AmenitiesList>
              {place.details.amenities.map((amenity, index) => (
                <Amenity key={index}>{amenity}</Amenity>
              ))}
            </AmenitiesList>
          </Section>
          
          <Section>
            <h3>Reviews</h3>
            <ReviewsList>
              {place.details.reviews.map((review) => (
                <Review key={review.id}>
                  <p>{review.name}</p>
                  <p>{review.comment}</p>
                  <p>Rating: {review.rating}</p>
                </Review>
              ))}
            </ReviewsList>
          </Section>
        </MainContent>
        <StickySection>
          <ContactSection>
            <Price>{currencySymbol}{convertPrice(place.price, userLocation)} per month</Price>
            <Button onClick={() => setShowContact(!showContact)}>
              <FaPhone style={{ marginRight: '10px' }} /> {showContact ? place.hostDetails.phone : 'Contact via Phone'}
            </Button>
            <Button onClick={() => setShowEmail(!showEmail)}>
              <FaEnvelope style={{ marginRight: '10px' }} /> {showEmail ? place.hostDetails.email : 'Contact via Email'}
            </Button>
            {showContact && (
              <ContactDetails>
                <p>Phone: {place.hostDetails.phone}</p>
              </ContactDetails>
            )}
            {showEmail && (
              <ContactDetails>
                <p>Email: {place.hostDetails.email}</p>
              </ContactDetails>
            )}
            <Button onClick={handleBookNow}>Book Now</Button>
          </ContactSection>
        </StickySection>
      </ContentWrapper>
      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ArrowButton onClick={showPreviousImage}><FaArrowLeft /></ArrowButton>
          <ModalImage src={place.details.images[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`} />
          <ArrowButton onClick={showNextImage}><FaArrowRight /></ArrowButton>
        </ModalContent>
        <Button onClick={closeModal} style={{ position: 'absolute', top: '20px', right: '20px' }}>Close</Button>
      </Modal>
    </Container>
  );
};

export default PlaceDetail;
