import React, { useState } from 'react';
import styled from 'styled-components';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import SearchForm from '../components/SearchForm';
import PlaceList from '../components/PlaceList';
import placesData from '../data/places';
import InspirationComponent from '../components/InspirationComponent';
import RestaurantCarousel from './RestaurantCarousel';
import ProductCarousel from '../components/ProductCarousel';
import GiftList from './gift/GiftList';
import GridPayments from './payments/GridPayments';

const HomeContainer = styled.div`
  padding: 40px 20px;
  background-color: transparet;
  text-align: center;
  font-family: 'Poppins', sans-serif; /* Apply Poppins globally */
`;

const HomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 400;
  color: #111827;
  margin-bottom: 20px;
`;

const HomeDescription = styled.p`
  font-size: 1.125rem;
  color: #6B7280; /* Text color for description */
  margin-bottom: 0px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 500;
  margin-top: 60px;
  margin-bottom: 30px;
  color: #111827;
`;

const QuestBanner = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #E8F5FF;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #008DD5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const BannerText = styled.p`
  color: #333;
  margin: 0;
  font-size: 16px;
`;

const BannerLink = styled.a`
  color: #008DD5;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CloseIcon = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
  
  &:hover {
    color: #333;
  }
`;

const Home = () => {
  const [places, setPlaces] = useState(placesData);
  const [filteredPlaces, setFilteredPlaces] = useState(placesData);
  const [showBanner, setShowBanner] = useState(() => {
    const hidden = localStorage.getItem('pohQuestBannerHidden');
    return !hidden;
  });

  const handleSearch = ({ location, startDate, endDate, guests }) => {
    const results = places.filter(
      (place) =>
        place.location.toLowerCase().includes(location.toLowerCase()) &&
        place.guests >= guests
    );
    setFilteredPlaces(results);
  };

  const hideBanner = () => {
    setShowBanner(false);
    localStorage.setItem('pohQuestBannerHidden', 'true');
  };

  return (
    <>
      {showBanner && (
        <QuestBanner>
          <BannerContent>
            <span role="img" aria-label="trophy">🏆</span>
            <BannerText>
              Complete the POH Quest to earn rewards and prove your humanity!{' '}
              <BannerLink 
                href="https://quest.intract.io/quest/67c7397d05b12fb575456313?utm_source=dashboard" 
                target="_blank"
                rel="noopener noreferrer"
              >
                Start Quest →
              </BannerLink>
            </BannerText>
          </BannerContent>
          <CloseIcon onClick={hideBanner}>&times;</CloseIcon>
        </QuestBanner>
      )}
      <HomeContainer>
        <CategoryGrid />
        <Hero />
        <HomeDescription>
          Welcome to RentMase.
        </HomeDescription>
        <HomeTitle>World's First Fully Decentralized SuperApp</HomeTitle>
        <SectionTitle>Buy Gift Cards and EARN Cashbacks!!!</SectionTitle>
        <GiftList />

        <GridPayments />
        {/* Optionally enable the search form */}
        {/* <SearchForm onSearch={handleSearch} /> */}
        
        <SectionTitle>Find your next HOME</SectionTitle>
        <PlaceList places={filteredPlaces} />

        <InspirationComponent />
        
        <SectionTitle>Restaurants near you</SectionTitle>
        <RestaurantCarousel />

        <SectionTitle>Products delivered to your doorstep</SectionTitle>
        <ProductCarousel />
      </HomeContainer>
    </>
  );
};

export default Home;
