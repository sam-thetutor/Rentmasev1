import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Hero from "../components/Hero";
import CategoryGrid from "../components/CategoryGrid";
import SearchForm from "../components/SearchForm";
import PlaceList from "../components/PlaceList";
import placesData from "../data/places";
import InspirationComponent from "../components/InspirationComponent";
import RestaurantCarousel from "./RestaurantCarousel";
import ProductCarousel from "../components/ProductCarousel";
import GiftList from "./gift/GiftList";
import GridPayments from "./payments/GridPayments";
import { RewardsExtended } from "../../../declarations/rentmase_backend/rentmase_backend.did";
import { Principal } from "@dfinity/principal";
import { useAuth } from "../hooks/Context";
import { BEARER_TOKEN } from "../constants";

const HomeContainer = styled.div`
  padding: 40px 20px;
  background-color: transparet;
  text-align: center;
  font-family: "Poppins", sans-serif; /* Apply Poppins globally */
`;

const HomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 400;
  color: #111827;
  margin-bottom: 20px;
`;

const HomeDescription = styled.p`
  font-size: 1.125rem;
  color: #6b7280; /* Text color for description */
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
  background-color: #e8f5ff;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #008dd5;
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
  color: #008dd5;
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

// Update RewardsExtendedWithPOH interface
interface RewardsExtendedWithPOH extends RewardsExtended {
  pohScore?: number;
  email: string;
  username: string;
  totalAmountEarned: bigint;
  referrals: bigint;
  user: Principal;
}

const Home = () => {
  const [places, setPlaces] = useState(placesData);
  const [filteredPlaces, setFilteredPlaces] = useState(placesData);
  const { newBackendActor, user } = useAuth();

  const [showBanner, setShowBanner] = useState(() => {
    const hidden = localStorage.getItem("pohQuestBannerHidden");
    return !hidden;
  });
  console.log("sss");

  const handleSearch = ({ location, startDate, endDate, guests }) => {
    const results = places.filter(
      (place) =>
        place.location.toLowerCase().includes(location.toLowerCase()) &&
        place.guests >= guests
    );
    setFilteredPlaces(results);
  };

  // useEffect(() => {
  //   console.log("fetching poh scores");

  //   fetchPohScores();
  // }, []);

  const getPohScore = async (email: string) => {
    try {
      const url = `https://publicapi.intract.io/api/pv1/proof-of-humanity/check-identity-score?identityType=Email&identity=${email}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      };
      const response = await fetch(url, {
        headers,
      });
      const res = await response.json();
      console.log(res);
      return Number(res.data ? res.data : 0);
    } catch (error) {
      return 0
    }
  };
  


  const fetchPohScores = async () => {
    if (newBackendActor) {
      const rewardsExtended = await newBackendActor.getRewardsExtended();
      const users = rewardsExtended[0];
      const batchSize = 50;
      let usersWithScores = [];

      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);

        const batchScores = await Promise.all(
          batch.map(async (user) => {
            const pohScore = await getPohScore(user.email);
            return { ...user, pohScore };
          })
        );
        console.log(batchScores);

        usersWithScores = [...usersWithScores, ...batchScores];

        if (i + batchSize < users.length) {
          // Wait 1 second before next batch, but only if there are more batches
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      console.log("final score", usersWithScores);
    }
  };

  //fetch the poh scores of all the users and cache them in local storage
  // const fetchPohScores = async () => {
  //   const response = await fetch('https://publicapi.intract.io/api/pv1/proof-of-humanity/get-all-scores');
  //   const data = await response.json();
  //   localStorage.setItem('pohScores', JSON.stringify(data));
  // };

  const hideBanner = () => {
    setShowBanner(false);
    localStorage.setItem("pohQuestBannerHidden", "true");
  };

  return (
    <>
      {/* {showBanner && ( */}
      <QuestBanner>
        <BannerContent>
          <span role="img" aria-label="trophy">
            🏆
          </span>
          <BannerText>
            Complete the POH Quest to earn rewards and prove your humanity!{" "}
            <BannerLink
              href="https://persona.intract.io/proof-of-humanity"
              target="_blank"
              rel="noopener noreferrer"
            >
              Start Quest →
            </BannerLink>
          </BannerText>
        </BannerContent>
        {/* <CloseIcon onClick={hideBanner}>&times;</CloseIcon> */}
      </QuestBanner>
      <HomeContainer>
        <CategoryGrid />
        <Hero />
        <HomeDescription>Welcome to RentMase.</HomeDescription>
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
