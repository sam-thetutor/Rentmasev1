import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background-color: black;
  border: 1px solid blue;
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
