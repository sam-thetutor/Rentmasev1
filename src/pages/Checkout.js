import React, { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { getCurrencySymbol, convertPrice } from '../utils/currency';

const CheckoutContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  padding-left: 250px;
  padding-right: 250px;

  @media (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }
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

const Select = styled.select`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #00B5E2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

const Summary = styled.div`
  text-align: left;
  margin-top: 20px;
`;

const SummaryItem = styled.p`
  margin: 5px 0;
  font-weight: bold;
`;

function Checkout() {
  const { cart, clearCart } = useCart();
  const [savedAddresses, setSavedAddresses] = useState(JSON.parse(localStorage.getItem('savedAddresses')) || []);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [nickname, setNickname] = useState('');
  const [saveAddress, setSaveAddress] = useState(false);
  const navigate = useNavigate();
  const location = ''; // Set to default

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleSelectAddress = (e) => {
    const address = savedAddresses.find(addr => addr.nickname === e.target.value);
    if (address) {
      setSelectedAddress(address);
      setName(address.name);
      setStreet(address.street);
      setBuilding(address.building);
      setPhone(address.phone);
      setPincode(address.pincode);
      setNickname(address.nickname);
    } else {
      setSelectedAddress('');
      setName('');
      setStreet('');
      setBuilding('');
      setPhone('');
      setPincode('');
      setNickname('');
    }
  };

  const handlePlaceOrder = () => {
    const newAddress = { name, street, building, phone, pincode, nickname };
    if (saveAddress && !savedAddresses.some(addr => addr.nickname === nickname)) {
      const updatedAddresses = [...savedAddresses, newAddress];
      setSavedAddresses(updatedAddresses);
      localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    }

    const orderId = Math.floor(Math.random() * 1000000); // Generate a random order ID
    clearCart();
    navigate(`/order-confirmation/${orderId}`, { state: { orderId, address: newAddress, cart, total } });
  };

  const currencySymbol = getCurrencySymbol(location);

  return (
    <CheckoutContainer>
      <h1>Checkout</h1>
      <AddressForm>
        <Select onChange={handleSelectAddress} value={nickname}>
          <option value="">Select a saved address</option>
          {savedAddresses.map((addr, index) => (
            <option key={index} value={addr.nickname}>{addr.nickname}</option>
          ))}
        </Select>
        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input type="text" placeholder="Street Name" value={street} onChange={(e) => setStreet(e.target.value)} />
        <Input type="text" placeholder="Building" value={building} onChange={(e) => setBuilding(e.target.value)} />
        <Input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
        <CheckboxContainer>
          <Checkbox type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
          <label>Save this address</label>
        </CheckboxContainer>
        {saveAddress && (
          <Input type="text" placeholder="Nickname for Address" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        )}
        <Button type="button" onClick={handlePlaceOrder}>Place Order</Button>
      </AddressForm>
      <Summary>
        <h2>Order Summary</h2>
        {cart.map((item, index) => (
          <SummaryItem key={index}>
            {item.quantity} x {item.name} ({currencySymbol}{convertPrice(parseFloat(item.price), location)})
          </SummaryItem>
        ))}
        <SummaryItem>Subtotal: {currencySymbol}{convertPrice(subtotal, location)}</SummaryItem>
        <SummaryItem>Tax (18%): {currencySymbol}{convertPrice(tax, location)}</SummaryItem>
        <SummaryItem>Total: {currencySymbol}{convertPrice(total, location)}</SummaryItem>
      </Summary>
    </CheckoutContainer>
  );
}

export default Checkout;
