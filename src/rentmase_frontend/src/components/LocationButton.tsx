import styled from 'styled-components';
import { IoLocationSharp } from 'react-icons/io5';

const Button = styled.button`
  display: flex;
  align-items: center;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 25px;
  padding: 10px 10px;
  margin-right: 30px; /* Add margin to separate it from the search bar */
  cursor: pointer;
  transition: border-color 0.3s ease, background-color 0.3s ease;
  height: 40px; /* Set a fixed height to maintain button size */

  &:hover {
    background-color: #f0f0f0;
    border-color: #008DD5;
  }

  &:active {
    border-color: blue;
  }
`;

const Icon = styled(IoLocationSharp)`
  width: 24px;
  height: 24px;
  margin-right: 10px;
  fill: #008DD5; /* Set the fill color to 008DD5 */
`;

const LocationText = styled.span`
  font-size: 0.9rem;
  color: black;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
  font-family: 'Poppins', sans-serif; /* Apply Poppins */
`;

const LocationButton = ({currentLocation}) => {
 

  return (
    <>
      <Button>
        <Icon />
        <LocationText>{currentLocation}</LocationText>
      </Button>
    </>
  );
};

export default LocationButton;
