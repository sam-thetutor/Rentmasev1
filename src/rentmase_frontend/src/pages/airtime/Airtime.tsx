import styled from "styled-components";
import { useEffect, useState } from "react";
import PhoneNumberForm from "./PhoneNumberPhone";
import Operators from "./Operators";
import { CountryData } from "./types";




const AirtimeForm = () => {

  const [phoneNumber, setPhoneNumber] = useState("");
  const [component, setComponent] = useState("phone-number");
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);


  return (
    <>
      {component === "phone-number" && <PhoneNumberForm {...{ setComponent, selectedCountry, setPhoneNumber, phoneNumber, setSelectedCountry }} />}
      {component === "operator" && <Operators {...{phoneNumber, selectedCountry, setComponent}} />}
    </>
  );
};

export default AirtimeForm;

