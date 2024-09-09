import React from 'react';
import styled from 'styled-components';

// Define the path to your SVG images
import telegramIcon from '/images/SLIDER/telegram.svg';
import nuanceIcon from '/images/SLIDER/nuance.svg';
import dscvrIcon from '/images/SLIDER/dscvr.svg';
import twitterIcon from '/images/SLIDER/x.svg';

const FooterContainer = styled.footer`
  background-color: #111111; /* Dark grey background */
  padding: 40px 20px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
`;


const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
`;

const SocialIcon = styled.a`
  color: #008DD5;
  font-size: 24px;
  display: inline-flex;
  align-items: center;

  &:hover {
    color: #333;
  }

  img {
    width: 20px; /* Adjust the size of your SVG */
    height: 20px;
    transition: transform 0.3s;
  }

  &:hover img {
    transform: scale(1.1);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterText = styled.p`
  color: #757575;
  font-size: 14px;
`;

const FooterLink = styled.a`
  color: #757575;
  text-decoration: none;
  margin-bottom: 5px;

  &:hover {
    color: #008DD5;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <SocialIcons>
          <SocialIcon href="https://t.me/rentmase_chat">
            <img src={telegramIcon} alt="Telegram" />
          </SocialIcon>
          <SocialIcon href="https://nuance.xyz/publication/rentmase">
            <img src={nuanceIcon} alt="Nuance" />
          </SocialIcon>
          <SocialIcon href="https://dscvr.one/p/rentmase">
            <img src={dscvrIcon} alt="DSCVR" />
          </SocialIcon>
          <SocialIcon href="https://x.com/RentMase">
            <img src={twitterIcon} alt="Twitter" />
          </SocialIcon>
        </SocialIcons>
        <FooterBottom>
          <FooterText>© 2024 RentMase. All Rights Reserved.</FooterText>
          <FooterText>
            <FooterLink href="#">Terms & Conditions</FooterLink> | <FooterLink href="#">Privacy Policy</FooterLink>
          </FooterText>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
