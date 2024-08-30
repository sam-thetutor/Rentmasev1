import Text "mo:base/Text";
import Time "mo:base/Time";
module {
    public type UserPayload = {
        firstName : Text;
        lastName : Text;
        dob : ?Time.Time;
        gender: ?Text;
        referrerCode : ?Text;
        referralCode : Text;
        email : Text;
    };

    public type UserUpdatePayload = {
        firstName : Text;
        lastName : Text;
        dob : ?Time.Time;
        gender: ?Text;
        email : Text;
    };

    public type PublicUser = {
        id : Principal;
        firstName : Text;
        lastName : Text;
        referrals : [Principal];
        rewards : [Reward];
    };
    public type User = {
        id : Principal;
        firstName : Text;
        lastName : Text;
        referralCode : Text;
        referrals : [Principal];
        rewards : [Reward];
        email : Text;
        dob : ?Time.Time;
        gender: ?Text;
        lastupdated : Time.Time;
        createdAt : Time.Time;
    };

   public type Reward = {
        amount : Nat;
        claimed : Bool;
        claimedAt : ?Time.Time;
        timestamp : Time.Time;
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

    public type TokenInterface = actor {
        icrc1_balance_of : shared query Account -> async Nat;
        icrc1_decimals : shared query () -> async Nat8;
        icrc1_fee : shared query () -> async Nat;
        icrc1_metadata : shared query () -> async [(Text, MetadataValue)];
        icrc1_minting_account : shared query () -> async ?Account;
        icrc1_transfer : shared TransferArg -> async TransfereResult;
    };

};
