import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyGetCouuntryGiftCardsQuery } from '../../redux/api/servicesSlice';
import { RootState } from '../../redux/store';
import styled from 'styled-components';
import GiftCard from './Card';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getAccessToken } from '../../hooks/requests';

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 20px 0;
`;

const List = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  padding-left: 10px;
  padding-right: 10px;
  scroll-behavior: smooth;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ItemWrapper = styled.div`
  min-width: 200px;
  flex-shrink: 0;
  transition: transform 0.3s ease-in-out;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  padding: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
    outline: 2px solid #008DD5;
  }

  &:first-of-type {
    left: 10px;
  }

  &:last-of-type {
    right: 10px;
  }
`;

const LoadingMessage = styled.div`
  font-size: 18px;
  color: #008DD5;
  margin: 20px;
`;

const GiftList = () => {
  const { location } = useSelector((state: RootState) => state.app);
  const [fetchCards] = useLazyGetCouuntryGiftCardsQuery();
  const [cards, setCards] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const listRef = useRef(null);
  const itemWidth = 360; // The width of each card

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getAccessToken('giftcards-sandbox');
      if (res) {
        getCards();
      } else {
        setLoading(false);
      }
    })();
  }, [dispatch, location]);

  const getCards = async () => {
    if (location) {
      fetchCards({ countryCode: location.isoName })
        .unwrap()
        .then((res) => {
          setCards(res);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error('Error fetching gift cards: ', error);
        });
    }
  };

  const scrollLeft = () => {
    listRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
  };

  const scrollRight = () => {
    listRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
  };

  return (
    <CarouselContainer>
      {loading ? (
        <LoadingMessage>Loading...</LoadingMessage>
      ) : (
        <>
          <ArrowButton onClick={scrollLeft}>
            <FaChevronLeft />
          </ArrowButton>
          <List ref={listRef}>
            {cards?.map((card, index) => (
              <ItemWrapper key={index}>
                <GiftCard {...card} />
              </ItemWrapper>
            ))}
          </List>
          <ArrowButton onClick={scrollRight}>
            <FaChevronRight />
          </ArrowButton>
        </>
      )}
    </CarouselContainer>
  );
};

export default GiftList;
