import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAccessToken } from '../../hooks/requests';
import { useLazyGetBillersQuery } from '../../redux/api/servicesSlice';
import { RootState } from '../../redux/store';
import { utilities_audience } from '../../constants';

const Bills = () => {
  const dispatch = useDispatch();
  const { location } = useSelector((state: RootState) => state.app);
  const [fetchBills] = useLazyGetBillersQuery();
  const [loading, setLoading] = useState(false);
  const [billers, setBillers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
     setLoading(true);
     const res = await getAccessToken(utilities_audience);
     if (res && location) {
       getBillers();
     } else {
       setLoading(false);
     }
    })();
   }, [dispatch]);

  const getBillers = async () => {
    fetchBills({ countryCode: location.isoName }).unwrap().then((res) => {
      console.log("billers: ", res);
      setBillers(res);
      setLoading(false);
    })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching gift cards: ", error);
      });
  }
 
  return (
    <div>Bills</div>
  )
}
// curl --request GET \
// 	--url 'https://utilities.reloadly.com/billers?id=12&name=Eko%20Electricity&type=ELECTRICITY_BILL_PAYMENT&serviceType=PREPAID&countryISOCode=KE&page=1&size=10' \
// 	--header 'Accept: application/com.reloadly.utilities-v1+json' \
// 	--header 'Authorization: Bearer <YOUR_TOKEN_HERE>'
export default Bills