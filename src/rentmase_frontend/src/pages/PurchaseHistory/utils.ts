import { PuerchaseTypeField, TxnType } from "../../../../declarations/rentmase_backend/rentmase_backend.did";

export const getTxnTypeName = (txnType: TxnType): string => {
    switch (true) {
      case 'GiftCardPurchase' in txnType:
        return 'Gift Card Purchase';
      case 'AirtimeTopup' in txnType:
        return 'Airtime Top-up';
      case 'DataTopup' in txnType:
        return 'Data Top-up';
      case 'BillsPayment' in txnType:
        return 'Bills Payment';
      default:
        return 'Unknown Transaction';
    }
  };
  
  export const getMoreDetails = (txnType: TxnType): PuerchaseTypeField | null => {
    if ('GiftCardPurchase' in txnType) {
      return txnType.GiftCardPurchase.more;
    } else if ('AirtimeTopup' in txnType) {
      return txnType.AirtimeTopup.more;
    } else if ('DataTopup' in txnType) {
      return txnType.DataTopup.more;
    } else if ('BillsPayment' in txnType) {
      return txnType.BillsPayment.more;
    }
    return null;
  };