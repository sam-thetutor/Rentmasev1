import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ManageAddressesContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  padding-left: 250px;
  padding-right: 250px;
`;

const AddressForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #00B5E2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 10px;
  margin-right: 5px;
`;

const AddressList = styled.div`
  margin-top: 20px;
`;

const AddressItem = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
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
      <h1>Manage Addresses</h1>
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
              <div>
                <p><strong>Name:</strong> {address.name}</p>
                <p><strong>Street:</strong> {address.street}</p>
                <p><strong>Building:</strong> {address.building}</p>
                <p><strong>Phone:</strong> {address.phone}</p>
                <p><strong>Pincode:</strong> {address.pincode}</p>
                <p><strong>Nickname:</strong> {address.nickname}</p>
              </div>
              <div>
                <Button onClick={() => handleEditAddress(address.nickname)}>Edit</Button>
                <Button onClick={() => handleDeleteAddress(address.nickname)}>Delete</Button>
              </div>
            </AddressItem>
          ))
        )}
      </AddressList>
    </ManageAddressesContainer>
  );
}

export default ManageAddresses;
