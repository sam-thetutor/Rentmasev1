import { FC } from "react";
import { InternalTxn } from "../../../../declarations/rentmase_backend/rentmase_backend.did";
import { getMoreDetails, getTxnTypeName } from "./utils";
import { ItemsTitle, PurchaseDetail, PurchaseItem, PurchaseTitle } from './styles';

type Props = {
    purchases: InternalTxn[] | null;
}

const AllHistory: FC<Props> = ({ purchases }) => {
    return (
        <> {purchases?.map((purchase, index) => {
            const txnTypeName = getTxnTypeName(purchase.txnType);
            const moreDetails = getMoreDetails(purchase.txnType);
            return (
                <PurchaseItem key={index}>
                    <PurchaseTitle>Purchase #{Number(purchase.id)}</PurchaseTitle>
                    <PurchaseDetail>
                        Time: {new Date(Number(purchase.timestamp) / 1e9).toLocaleString()}
                    </PurchaseDetail>
                    <PurchaseDetail>Status: {Object.keys(purchase.status)[0]}</PurchaseDetail>
                    <PurchaseDetail>Transaction Type: {txnTypeName}</PurchaseDetail>

                    {moreDetails && (
                        <>
                            <ItemsTitle>Details:</ItemsTitle>
                            <PurchaseDetail>Name: {moreDetails.name}</PurchaseDetail>
                            <PurchaseDetail>Country Code: {moreDetails.countryCode}</PurchaseDetail>
                            <PurchaseDetail>Amount: {moreDetails.amount}</PurchaseDetail>
                            <PurchaseDetail>Phone: {moreDetails.phoneNumber}</PurchaseDetail>
                        </>
                    )}
                </PurchaseItem>
            );
        })}</>
    )
}

export default AllHistory