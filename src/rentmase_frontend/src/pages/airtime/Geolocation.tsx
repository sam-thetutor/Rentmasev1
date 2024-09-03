import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 20px auto;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorBox = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #ffe6e6;
  border-left: 5px solid #ff4d4d;
  border-radius: 5px;
  color: #ff3333;
`;

const ErrorMessage = styled.p`
  margin: 0;
  font-weight: bold;
`;

const ErrorInstructions = styled.p`
  margin: 5px 0 0 0;
  color: #333;
`;

const Looading = styled.div`
    margin-top: 20px;
    font-weight: bold;
    `;


const Geolocation = () => {
    const [error, setError] = useState(null);
    const { location, locationStatus, countries } = useSelector((state: RootState) => state.app);
    const [localLocation, setLocalLocation] = useState(null);

    const requestGeolocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocalLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setError(null);
            },
            (err) => {
                console.error("Geolocation Error:", err);
                setError(err.message);
            }
        );
    };

    useEffect(() => {
        if (!location && !localLocation && !error) {
            requestGeolocation();
        }
    }, [requestGeolocation]);

    return (
        <Container>
            {localLocation && !location && locationStatus === "NotFound" && (
                <ErrorMessage>
                    Apologies, your location is not available at the moment. Please try again later.
                </ErrorMessage>
            )
            }



            {error && !localLocation && !location && locationStatus === "Denied" &&
                (
                    <ErrorBox>
                        <ErrorMessage>Error: {error}</ErrorMessage>
                        <ErrorInstructions>
                            It looks like you denied location access. To enable it again, please
                            go to your browser settings and allow location access for this site.
                        </ErrorInstructions>
                    </ErrorBox>
                )}
            {!error && !location && !locationStatus &&
                (
                    <Looading>Loading...</Looading>
                )
            }
        </Container>
    );
};

export default Geolocation