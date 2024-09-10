
import { useEffect, useState } from "react";
import PhoneNumberForm from "./PhoneNumberPhone";
import Operators from "./Operators";
import { CountryData } from "./types";
import { useAuthenticateMutation } from "../../redux/api/servicesSlice";
import { useAuth } from "../../hooks/Context";
import { useDispatch } from "react-redux";
import { setAudience } from "../../redux/slices/app";




const Airtime = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAudience("topups-sandbox"));
  }, [dispatch]);

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

export default Airtime

