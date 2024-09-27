import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import styled from "styled-components";

type StyleProps = {
    isFavorite: boolean;
  };
  
const Card = styled.div`
  text-align: left;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 15px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    outline: 2px solid #00B5E2;
  }
`;

const ImageContainer = styled.div`
  position: relative;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 15px;
  text-align: left;
`;

const Title = styled.h3`
  margin: 0;
  color: #333;
  font-size: 18px;
`;

const Description = styled.p`
  color: #757575;
  margin: 5px 0;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const BuyProductCard = ({ product }) => {
  return (
    <StyledLink to={`/payments${product.link}`}>
      <Card>
        <ImageContainer>
          <ProductImage src={product.image} alt={product.name} />
        </ImageContainer>
        <Content>
          <Title>{product.name}</Title>
          <Description>{product.description}</Description>
        </Content>
      </Card>
    </StyledLink>
  );
};

export default BuyProductCard;
