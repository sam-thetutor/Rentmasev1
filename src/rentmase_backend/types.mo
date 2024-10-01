import Text "mo:base/Text";
import Time "mo:base/Time";
module {
    public type UserPayload = {
        firstName : Text;
        lastName : Text;
        username: Text;
        dob : ?Time.Time;
        gender : ?Text;
        referrerCode : ?Text;
        referralCode : Text;
        email : Text;
    };

    public type UserUpdatePayload = {
        firstName : Text;
        lastName : Text;
        username: Text;
        dob : ?Time.Time;
        gender : ?Text;
        email : Text;
        refferalCode : Text;
    };

    public type PublicUser = {
        id : Principal;
        firstName : Text;
        lastName : Text;
        referrals : [Principal];
    };
    public type User = {
        id : Principal;
        firstName : Text;
        lastName : Text;
        username: Text;
        referralCode : Text;
        referrals : [Principal];
        email : Text;
        dob : ?Time.Time;
        gender : ?Text;
        lastupdated : Time.Time;
        createdAt : Time.Time;
    };

    public type Rewards = {
        user : Principal;
        username : Text;
        rewards : [RewardType];
        totalAmountEarned : Nat;
        balance : Nat;
        created : Time.Time;
    };

    public type RewardType = {
        #Signup : SignupReward;
        #Referral : ReferralReward;
        #SocialShare : SocialShareReward;
        #ReviewReward : ReviewReward;
    };

    public type SignupReward = {
        amount : Nat;
        timestamp : Time.Time;
    };

    public type ReferralReward = {
        referred : Principal;
        referralCode : Text;
        amount : Nat;
        timestamp : Time.Time;
    };

    public type SocialShareReward = {
        amount : Nat;
        timestamp : Time.Time;
    };

    public type ReviewReward = {
        amount : Nat;
        timestamp : Time.Time;
    };

    public type SocialShareRewardRequest = {
        user : Principal;
        postUrl : Text;
        approved : Bool;    
        timestamp : Time.Time;
    };

public type Review = {
        user : Principal;
        review : Text;
        rating : Nat;
        timestamp : Time.Time;
    };

    public type TxnPayload = {
        txnType : TxnType;
        transferAmount : Nat;
        userEmail : Text;
    };

    public type InternalTxn = {
        id : Nat;
        txnType : TxnType;
        userEmail : Text;
        transferData : TransferData;
        userPrincipal : Principal;
        status : TxnStatus;
        timestamp : Time.Time;
    };

    public type TransferData = {
        from : Account;
        amount : Nat;
    };  

    type TxnType = {
        #AirtimeTopup : AirtimeTopup;
        #DataTopup : DataTopup;
        #BillsPayment : BillsPayment;
        #GiftCardPurchase : GiftCardPurchase;
    };

    type TxnStatus = {
        #Initiated;
        #TokensTransfered;
        #Completed;
    };

    type AirtimeTopup = {
        amount : Text;
        operator : Text;
        operaterId : Text;
        phoneNumber : Text;
        countryCode : Text;
    };

    type DataTopup = {
        amount : Text;
        operator : Text;
        operaterId : Text;
        phoneNumber : Text;
        countryCode : Text;
    };

    type GiftCardPurchase = {
        productId : Text;
        amount : Text;
        quantity : Int;
        recipientEmail : Text;
        countryCode : Text;
        phoneNumber : Text;
    };

    type BillsPayment = {
        amount : Text;
        biller : Text;
        billerId : Text;
        subscriberAccount : Text;
        reference : Text;
    };

    /*************************
    * Token Interface
*************************/

    public type Account = { owner : Principal; subaccount : ?Blob };
    public type MetadataValue = {
        #Int : Int;
        #Nat : Nat;
        #Blob : Blob;
        #Text : Text;
    };
    public type TransfereResult = { #Ok : Nat; #Err : TransferError };
    public type TransferArg = {
        to : Account;
        fee : ?Nat;
        memo : ?Blob;
        from_subaccount : ?Blob;
        created_at_time : ?Nat64;
        amount : Nat;
    };
    public type TransferError = {
        #GenericError : { message : Text; error_code : Nat };
        #TemporarilyUnavailable;
        #BadBurn : { min_burn_amount : Nat };
        #Duplicate : { duplicate_of : Nat };
        #BadFee : { expected_fee : Nat };
        #CreatedInFuture : { ledger_time : Nat64 };
        #TooOld;
        #InsufficientFunds : { balance : Nat };
    };

    public type TransferFromArgs = {
        to : Account;
        fee : ?Nat;
        spender_subaccount : ?Blob;
        from : Account;
        memo : ?Blob;
        created_at_time : ?Nat64;
        amount : Nat;
    };

    public type TransferFromError = {
        #GenericError : { message : Text; error_code : Nat };
        #TemporarilyUnavailable;
        #InsufficientAllowance : { allowance : Nat };
        #BadBurn : { min_burn_amount : Nat };
        #Duplicate : { duplicate_of : Nat };
        #BadFee : { expected_fee : Nat };
        #CreatedInFuture : { ledger_time : Nat64 };
        #TooOld;
        #InsufficientFunds : { balance : Nat };
    };

    public type Result_2 = { #Ok : Nat; #Err : TransferFromError };

    public type TokenInterface = actor {
        icrc1_balance_of : shared query Account -> async Nat;
        icrc1_decimals : shared query () -> async Nat8;
        icrc1_fee : shared query () -> async Nat;
        icrc1_metadata : shared query () -> async [(Text, MetadataValue)];
        icrc1_minting_account : shared query () -> async ?Account;
        icrc1_transfer : shared TransferArg -> async TransfereResult;
        icrc2_transfer_from : shared TransferFromArgs -> async Result_2;
    };

};
