import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setAudience } from '../../redux/slices/app';

const Bills = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAudience("bills-sandbox"));
  }, [dispatch]);
  return (
    <div>Bills</div>
  )
}

export default Bills