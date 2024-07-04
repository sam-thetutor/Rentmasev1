import React from 'react';
import styled from 'styled-components';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: #fff;
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

const FooterLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin: 20px 0;
`;

const FooterLinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterLinkTitle = styled.h4`
  margin-bottom: 10px;
  color: #333;
  font-size: 16px;
  font-weight: bold;
`;

const FooterLink = styled.a`
  color: #757575;
  text-decoration: none;
  margin-bottom: 5px;

  &:hover {
    color: #00B5E2;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
`;

const SocialIcon = styled.a`
  color: #00B5E2;
  font-size: 24px;

  &:hover {
    color: #333;
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

const AppButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const AppButton = styled.a`
  img {
    height: 40px;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLinks>
          {/* <FooterLinkGroup>
            <FooterLinkTitle>Company</FooterLinkTitle>
            <FooterLink href="#">Blog</FooterLink>
            <FooterLink href="#">Press</FooterLink>
            <FooterLink href="#">FAQ</FooterLink>
            <FooterLink href="#">Contact Us</FooterLink>
            <FooterLink href="#">Be a partner</FooterLink>
          </FooterLinkGroup> */}
          {/* <FooterLinkGroup>
            <FooterLinkTitle>Product</FooterLinkTitle>
            <FooterLink href="#">FavePay</FooterLink>
            <FooterLink href="#">Fave Deals</FooterLink>
            <FooterLink href="#">Fave eCards</FooterLink>
            <FooterLink href="#">New Users - Free Treat</FooterLink>
          </FooterLinkGroup> */}
          {/* <FooterLinkGroup>
            <FooterLinkTitle>Partnerships</FooterLinkTitle>
            <FooterLink href="#">Fave x GrabPay</FooterLink>
            <FooterLink href="#">Fave x Boost</FooterLink>
            <FooterLink href="#">DuitNow</FooterLink>
          </FooterLinkGroup> */}
        </FooterLinks>
        <SocialIcons>
          <SocialIcon href="#"><FaFacebookF /></SocialIcon>
          <SocialIcon href="#"><FaInstagram /></SocialIcon>
          <SocialIcon href="#"><FaLinkedinIn /></SocialIcon>
          <SocialIcon href="#"><FaYoutube /></SocialIcon>
        </SocialIcons>
        <FooterBottom>
          {/* <AppButtons>
            <AppButton href="#"><img src="/images/app-store.png" alt="App Store" /></AppButton>
            <AppButton href="#"><img src="/images/google-play.png" alt="Google Play" /></AppButton>
            <AppButton href="#"><img src="/images/app-gallery.png" alt="App Gallery" /></AppButton>
          </AppButtons> */}
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
