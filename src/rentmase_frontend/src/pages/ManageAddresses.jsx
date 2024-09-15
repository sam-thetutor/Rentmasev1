import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ManageAddressesContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family: 'Poppins', sans-serif;
  margin-top: 100px;
`;

const Title = styled.h1`
  text-align: center;
  color: #008DD5;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
`;

const AddressForm = styled.form`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
`;

const Input = styled.input`
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  outline: none;
  transition: border 0.2s ease-in-out;

  &:focus {
    border-color: #008DD5;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: ${props => props.secondary ? "transparent" : "#008DD5"};
  color: ${props => props.secondary ? "#008DD5" : "white"};
  border: ${props => props.secondary ? "2px solid #008DD5" : "none"};
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin-right: ${props => props.secondary ? "10px" : "0"};
  transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;

  &:hover {
    background-color: ${props => props.secondary ? "#008DD5" : "#006bb3"};
    color: white;
    transform: scale(1.05);
  }
`;

const AddressList = styled.div`
  margin-top: 30px;
`;

const AddressItem = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const AddressDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const AddressField = styled.p`
  margin: 5px 0;
  font-size: 16px;
  color: #333;

  strong {
    color: #555;
    margin-right: 5px;
  }
`;

const ManageAddresses = () => {
  const [addresses, setAddresses] = useState(JSON.parse(localStorage.getItem('savedAddresses')) || []);
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [nickname, setNickname] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedAddresses = JSON.parse(localStorage.getItem('savedAddresses')) || [];
    setAddresses(storedAddresses);
  }, []);

  const handleSaveAddress = () => {
    const newAddress = { name, street, building, phone, pincode, nickname };

    if (isEditing) {
      const updatedAddresses = addresses.map(address => 
        address.nickname === nickname ? newAddress : address
      );
      setAddresses(updatedAddresses);
      localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
      setIsEditing(false);
    } else {
      const updatedAddresses = [...addresses, newAddress];
      setAddresses(updatedAddresses);
      localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    }

    clearForm();
  };

  const handleDeleteAddress = (nickname) => {
    const updatedAddresses = addresses.filter(address => address.nickname !== nickname);
    setAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
  };

  const handleEditAddress = (nickname) => {
    const address = addresses.find(addr => addr.nickname === nickname);
    if (address) {
      setName(address.name);
      setStreet(address.street);
      setBuilding(address.building);
      setPhone(address.phone);
      setPincode(address.pincode);
      setNickname(address.nickname);
      setIsEditing(true);
    }
  };

  const clearForm = () => {
    setName('');
    setStreet('');
    setBuilding('');
    setPhone('');
    setPincode('');
    setNickname('');
  };

  return (
    <ManageAddressesContainer>
      <Title>Manage Addresses</Title>
      <AddressForm>
        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input type="text" placeholder="Street Name" value={street} onChange={(e) => setStreet(e.target.value)} />
        <Input type="text" placeholder="Building" value={building} onChange={(e) => setBuilding(e.target.value)} />
        <Input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
        <Input type="text" placeholder="Nickname for Address" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        <Button type="button" onClick={handleSaveAddress}>{isEditing ? 'Update Address' : 'Save Address'}</Button>
      </AddressForm>
      <AddressList>
        {addresses.length === 0 ? (
          <p>No saved addresses.</p>
        ) : (
          addresses.map((address, index) => (
            <AddressItem key={index}>
              <AddressDetails>
                <AddressField><strong>Name:</strong> {address.name}</AddressField>
                <AddressField><strong>Street:</strong> {address.street}</AddressField>
                <AddressField><strong>Building:</strong> {address.building}</AddressField>
                <AddressField><strong>Phone:</strong> {address.phone}</AddressField>
                <AddressField><strong>Pincode:</strong> {address.pincode}</AddressField>
                <AddressField><strong>Nickname:</strong> {address.nickname}</AddressField>
              </AddressDetails>
              <div>
                <Button secondary onClick={() => handleEditAddress(address.nickname)}>Edit</Button>
                <Button secondary onClick={() => handleDeleteAddress(address.nickname)}>Delete</Button>
              </div>
            </AddressItem>
          ))
        )}
      </AddressList>
    </ManageAddressesContainer>
  );
}

export default ManageAddresses;
