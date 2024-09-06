import { useSelector } from "react-redux";
import { useLazyGetCouuntryGiftCardsQuery } from "../../redux/api/servicesSlice";
import { RootState } from "../../redux/store";
import { useEffect } from "react";

const Gift = () => {
  const {location} = useSelector((state : RootState) => state.app);
  const [fetchCards] = useLazyGetCouuntryGiftCardsQuery();

  useEffect(() => {
    if (location) {
      fetchCards({countryCode: location.isoName}).unwrap().then((res) => {
        console.log("Gift Cards: ", res);
    })
    .catch((error) => {
        console.error("Error fetching gift cards: ", error);
    });
    }
}, [location]);



  return (
    <div>Gift</div>
  )
}

export default Gift