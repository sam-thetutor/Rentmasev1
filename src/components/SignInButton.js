import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background-color: #00B5E2;
  border: 1px solid #00B5E2;
  color: white;
  padding: 15px 20px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 15px; /* Rounded corners */
  font-size: 1rem; /* Increased font size */

  &:hover {
    background-color: white;
    color: black;
  }
`;

const SignInButton = () => {
  return <Button>Sign In</Button>;
};

export default SignInButton;
