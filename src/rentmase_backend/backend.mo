import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Float "mo:base/Float";
import Int64 "mo:base/Int64";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Array "mo:base/Array";
import TrieMap "mo:base/TrieMap";
import Iter "mo:base/Iter";
import Types "types";
import OldTypes "old.types";

actor class Rentmase() = this {
    type User = Types.User;
    type TokenInterface = Types.TokenInterface;
    type InternalTxn = Types.InternalTxn;
    type TxnPayload = Types.TxnPayload;
    type CashbackType = Types.CashbackType;
    type Referral = Types.Referral;

    var signupRewardAmnt = 100;
    var referralRewardAmnt = 50;
    var reviewReward = 30;
    var socialShareReward = 50;
    let tokenCanister = "fr2qs-haaaa-aaaai-actya-cai";
    let tokenDecimals = 100_000_000;
    let faucetAmount = 1_000_000_000_000;

    type ReviewId = Text;
    type RewardId = Text;
    type InternalTxnId = Text;
    type SocialShareRewardRequestId = Text;

    var cashback : CashbackType = null;

    var users = TrieMap.TrieMap<Principal, User>(Principal.equal, Principal.hash);
    stable var usersEntries : [(Principal, User)] = [];

    var reviews = TrieMap.TrieMap<ReviewId, Types.Review>(Text.equal, Text.hash);
    stable var reviewsEntries : [(ReviewId, Types.Review)] = [];

    var referrals = TrieMap.TrieMap<Text, Referral>(Text.equal, Text.hash);
    stable var referralsEntries : [(Text, Referral)] = [];

    // var rewards = TrieMap.TrieMap<RewardId, Types.Rewards>(Text.equal, Text.hash);
    // stable var rewardsEntries : [(RewardId, Types.Rewards)] = [];

    var socialShareRequests = TrieMap.TrieMap<SocialShareRewardRequestId, Types.SocialShareRewardRequest>(Text.equal, Text.hash);
    stable var socialShareRequestsEntries : [(SocialShareRewardRequestId, Types.SocialShareRewardRequest)] = [];

    var faucets = TrieMap.TrieMap<Principal, Types.FaucetTxn>(Principal.equal, Principal.hash);
    stable var faucetsEntries : [(Principal, Types.FaucetTxn)] = [];

    var transactions = TrieMap.TrieMap<InternalTxnId, InternalTxn>(Text.equal, Text.hash);
    stable var transactionsEntries : [(InternalTxnId, InternalTxn)] = [];

    system func preupgrade() {
        usersEntries := Iter.toArray(users.entries());
        reviewsEntries := Iter.toArray(reviews.entries());
        // rewardsEntries := Iter.toArray(rewards.entries());
        socialShareRequestsEntries := Iter.toArray(socialShareRequests.entries());
        faucetsEntries := Iter.toArray(faucets.entries());
        transactionsEntries := Iter.toArray(transactions.entries());
        referralsEntries := Iter.toArray(referrals.entries());
    };

    system func postupgrade() {
        users := TrieMap.fromEntries<Principal, User>(usersEntries.vals(), Principal.equal, Principal.hash);
        reviews := TrieMap.fromEntries<ReviewId, Types.Review>(reviewsEntries.vals(), Text.equal, Text.hash);
        // rewards := TrieMap.fromEntries<RewardId, Types.Rewards>(rewardsEntries.vals(), Text.equal, Text.hash);
        socialShareRequests := TrieMap.fromEntries<SocialShareRewardRequestId, Types.SocialShareRewardRequest>(socialShareRequestsEntries.vals(), Text.equal, Text.hash);
        faucets := TrieMap.fromEntries<Principal, Types.FaucetTxn>(faucetsEntries.vals(), Principal.equal, Principal.hash);
        transactions := TrieMap.fromEntries<InternalTxnId, InternalTxn>(transactionsEntries.vals(), Text.equal, Text.hash);
        referrals := TrieMap.fromEntries<Text, Referral>(referralsEntries.vals(), Text.equal, Text.hash);
        usersEntries := [];
        reviewsEntries := [];
        // rewardsEntries := [];
        socialShareRequestsEntries := [];
        faucetsEntries := [];
        transactionsEntries := [];
        referralsEntries := [];
    };

    /***************************
     * FAUCET
    ****************************/

    public shared ({ caller }) func getTestTokens() : async Result.Result<(), Text> {
        switch (faucets.get(caller)) {
            case (null) {
                switch (await transferTokens(caller, faucetAmount)) {
                    case (#err(err)) {
                        return #err(err);
                    };
                    case (#ok(_)) {
                        let id = faucets.size();
                        let faucetTxn : Types.FaucetTxn = {
                            id = id;
                            user = caller;
                            amount = faucetAmount;
                            timestamp = Time.now();
                        };
                        faucets.put(caller, faucetTxn);
                        return #ok(());
                    };
                };
            };
            case (?_txn) {
                let currentTime = Time.now();
                let lastTxnTime = _txn.timestamp;
                let diff = currentTime - lastTxnTime;
                if (diff > 86400_000_000_000) {
                    switch (await transferTokens(caller, faucetAmount)) {
                        case (#err(err)) {
                            return #err(err);
                        };
                        case (#ok(_)) {
                            // Update the faucet transaction
                            let updatedFaucetTxn : Types.FaucetTxn = {
                                _txn with
                                timestamp = Time.now();
                            };
                            faucets.put(caller, updatedFaucetTxn);
                            return #ok(());
                        };
                    };
                } else {
                    return #err("You have already received test tokens, please try again after 24 hours");
                };
            };
        };
    };

    public shared query ({ caller }) func getMyFaucetTxn() : async Result.Result<Types.FaucetTxn, Text> {
        switch (faucets.get(caller)) {
            case (null) {
                return #err("User has not received test tokens");
            };
            case (?_txn) {
                return #ok(_txn);
            };
        };
    };

    func transferTokens(to : Principal, amount : Nat) : async Result.Result<(), Text> {
        let _actor = actor (tokenCanister) : TokenInterface;
        let transferArg : Types.TransferArg = {
            to = { owner = to; subaccount = null };
            fee = null;
            memo = null;
            from_subaccount = null;
            created_at_time = null;
            amount = amount;
        };
        switch (await _actor.icrc1_transfer(transferArg)) {
            case (#Err(err)) {
                return #err(handleTransferError(err));
            };
            case (#Ok(_)) {
                return #ok(());
            };
        };
    };

    public shared func migrateUser(oluser : OldTypes.User, rewardsArgs : OldTypes.Rewards, socialRe : [OldTypes.SocialShareRewardRequest]) : async Result.Result<(), Text> {

        switch (users.get(oluser.id)) {
            case (?_) {
                return #err("User already migrated");
            };
            case (null) {
                var signupAmount = 0;
                var signupNumberOfTimes = 0;

                var referralAmount = 0;
                var referralNumberOfTimes = 0;

                var socialShareAmount = 0;
                var socialShareNumberOfTimes = 0;

                var reviewAmount = 0;
                var reviewNumberOfTimes = 0;

                for (_reward in rewardsArgs.rewards.vals()) {
                    switch (_reward) {
                        case (#Signup(reward)) {
                            signupAmount := signupAmount + reward.amount;
                            signupNumberOfTimes := signupNumberOfTimes + 1;
                        };
                        case (#Referral(reward)) {
                            referralAmount := referralAmount + reward.amount;
                            referralNumberOfTimes := referralNumberOfTimes + 1;

                            let referralVal : Referral = {
                                refefferedUser = reward.referred;
                                referredBy = rewardsArgs.user;
                                referralCode = reward.referralCode;
                                rewardAmount = reward.amount;
                                timestamp = reward.timestamp;
                            };

                            let id = referrals.size() + 1;
                            referrals.put(Nat.toText(id), referralVal);
                        };
                        case (#SocialShare(reward)) {
                            socialShareAmount := socialShareAmount + reward.amount;
                            socialShareNumberOfTimes := socialShareNumberOfTimes + 1;
                        };
                        case (#ReviewReward(reward)) {
                            reviewAmount := reviewAmount + reward.amount;
                            reviewNumberOfTimes := reviewNumberOfTimes + 1;
                        };
                    };
                };

                var userRewards : Types.RewardType = {
                    signup = {
                        amount = signupAmount;
                        numberOfTimes = signupNumberOfTimes;
                    };
                    referral = {
                        amount = referralAmount;
                        numberOfTimes = referralNumberOfTimes;
                    };
                    socialShare = {
                        amount = socialShareAmount;
                        numberOfTimes = socialShareNumberOfTimes;
                    };
                    review = {
                        amount = reviewAmount;
                        numberOfTimes = reviewNumberOfTimes;
                    };
                    totalAmountEarned = rewardsArgs.totalAmountEarned;
                    balance = rewardsArgs.balance;
                };

                let user : Types.User = {
                    id = oluser.id;
                    firstName = oluser.firstName;
                    lastName = oluser.lastName;
                    username = oluser.username;
                    email = oluser.email;
                    gender = oluser.gender;
                    referralCode = oluser.referralCode;
                    rewards = userRewards;
                    dob = oluser.dob;
                    lastupdated = oluser.lastupdated;
                    createdAt = oluser.createdAt;
                };

                users.put(oluser.id, user);

                for (req in socialRe.vals()) {
                    socialShareRequests.put(
                        Nat.toText(req.id),
                        {
                            id = req.id;
                            user = req.user;
                            postUrl = req.postUrl;
                            platform = req.platform;
                            approved = req.approved;
                            timestamp = req.timestamp;
                        },
                    );
                };
                return #ok(());
            };
        };
    };

    public shared func migrateUserTransactions(txns : [OldTypes.InternalTxn]) : async () {
        for (txn in txns.vals()) {
            transactions.put(
                Nat.toText(txn.id),
                {
                    id = txn.id;
                    userEmail = txn.userEmail;
                    status = txn.status;
                    transferData = txn.transferData;
                    cashback = txn.cashback;
                    quantity = txn.quantity;
                    txnType = txn.txnType;
                    userPrincipal = txn.userPrincipal;
                    reloadlyTxnId = txn.reloadlyTxnId;
                    timestamp = txn.timestamp;
                },
            );
        };
    };

    /*****************************
     * CASHBACK
     *****************************/

    public shared ({ caller }) func setCashback(args : CashbackType) : async () {
        assert (Principal.isController(caller)); // TODO: Uncomment this line
        cashback := args;
    };

    public shared query func getCashback() : async CashbackType {
        return cashback;
    };
    public shared query ({ caller }) func getUsersCashbackTxns() : async [InternalTxn] {
        let usersTxns = TrieMap.mapFilter<InternalTxnId, InternalTxn, InternalTxn>(
            transactions,
            Text.equal,
            Text.hash,
            func(k, v) {
                if (v.cashback != null and v.userPrincipal == caller) {
                    ?v;
                } else {
                    null;
                };
            },
        );
        return Iter.toArray(usersTxns.vals());
    };

    public shared query ({ caller }) func getUsersTxns() : async [InternalTxn] {
        let usersTxns = TrieMap.mapFilter<InternalTxnId, InternalTxn, InternalTxn>(
            transactions,
            Text.equal,
            Text.hash,
            func(k, v) {
                if (v.userPrincipal == caller) {
                    ?v;
                } else {
                    null;
                };
            },
        );
        return Iter.toArray(usersTxns.vals());
    };

    /****************************
    * USER PROFILE
    ****************************/

    public shared ({ caller }) func registerUser(payload : Types.UserPayload) : async Result.Result<User, Text> {
        assert (not Principal.isAnonymous(caller));
        switch (payload.referrerCode) {
            case (null) {
                let user = _createUser(payload, caller);
                return #ok(user);
            };
            case (?code) {
                let usersArray = Iter.toArray(users.vals());

                let referralUser = Array.find<User>(
                    usersArray,
                    func(user : User) : Bool {
                        return user.referralCode == code;
                    },
                );

                switch (referralUser) {
                    case (null) {
                        let user = _createUser(payload, caller);
                        return #ok(user);
                    };
                    case (?_user) {
                        let updatedRefererUser : User = {
                            _user with
                            rewards = {
                                _user.rewards with
                                referral = {
                                    amount = _user.rewards.referral.amount + referralRewardAmnt;
                                    numberOfTimes = _user.rewards.referral.numberOfTimes + 1;
                                };
                                totalAmountEarned = _user.rewards.totalAmountEarned + referralRewardAmnt;
                                balance = _user.rewards.balance + referralRewardAmnt;
                            }
                        };
                        users.put(_user.id, updatedRefererUser);

                        let referralVal : Referral = {
                            refefferedUser = caller;
                            referredBy = _user.id;
                            referralCode = payload.referralCode;
                            rewardAmount = referralRewardAmnt;
                            timestamp = Time.now();
                        };

                        let id = referrals.size() + 1;
                        referrals.put(Nat.toText(id), referralVal);

                        let user = _createUser(payload, caller);
                        return #ok(user);
                    };
                };
            };
        };
    };

    func _createUser(payload : Types.UserPayload, id : Principal) : User {
        let user : Types.User = {
            id = id;
            firstName = payload.firstName;
            lastName = payload.lastName;
            username = payload.username;
            referralCode = payload.referralCode;
            referrals = [];
            rewards = {
                signup = {
                    amount = signupRewardAmnt;
                    numberOfTimes = 1;
                };
                referral = {
                    amount = 0;
                    numberOfTimes = 0;
                };
                socialShare = {
                    amount = 0;
                    numberOfTimes = 0;
                };
                review = {
                    amount = 0;
                    numberOfTimes = 0;
                };
                totalAmountEarned = signupRewardAmnt;
                totalWithdrawn = 0;
                balance = signupRewardAmnt;
            };
            dob = payload.dob;
            gender = payload.gender;
            lastupdated = Time.now();
            email = payload.email;
            createdAt = Time.now();
        };
        users.put(id, user);
        return user;
    };

    public shared ({ caller }) func updateProfile(payload : Types.UserUpdatePayload) : async Result.Result<User, Text> {
        switch (users.get(caller)) {
            case (null) {
                return #err("User not found");
            };
            case (?_user) {
                let updatedUser : User = {
                    _user with
                    firstName = payload.firstName;
                    lastName = payload.lastName;
                    email = payload.email;
                    dob = payload.dob;
                    referralCode = payload.refferalCode;
                    gender = payload.gender;
                    lastupdated = Time.now();
                };
                users.put(caller, updatedUser);
                return #ok(updatedUser);
            };
        };
    };

    public shared query func isReferralCodeUnique(referralCode : Text) : async Bool {
        let usersArray = Iter.toArray(users.vals());
        let user = Array.find<User>(
            usersArray,
            func(user : User) : Bool {
                return user.referralCode == referralCode;
            },
        );
        return switch (user) {
            case (null) {
                true;
            };
            case (?_) {
                false;
            };
        };
    };

    public shared query func isUserNameUnique(username : Text) : async Bool {
        let usersArray = Iter.toArray(users.vals());
        let user = Array.find<User>(
            usersArray,
            func(user : User) : Bool {
                return user.username == username;
            },
        );
        return switch (user) {
            case (null) {
                true;
            };
            case (?_) {
                false;
            };
        };
    };

    public shared query ({ caller }) func getUser() : async Result.Result<User, Text> {
        switch (users.get(caller)) {
            case (null) {
                return #err("User not found");
            };
            case (?_user) {
                return #ok(_user);
            };
        };
    };

    public shared query ({ caller }) func getAllUsers() : async [User] {
        assert (Principal.isController(caller));
        return Iter.toArray(users.vals());
    };

    public shared query func getPublicUsers() : async [Types.PublicUser] {
        let usersArray = Iter.toArray(users.vals());
        return Array.map<User, Types.PublicUser>(
            usersArray,
            func(user : User) : Types.PublicUser {
                let usersRefferals = TrieMap.mapFilter<Text, Referral, Referral>(
                    referrals,
                    Text.equal,
                    Text.hash,
                    func(k, v) {
                        if (v.referredBy == user.id) {
                            ?v;
                        } else {
                            null;
                        };
                    },
                );

                let referralPrincipals = Array.map<Referral, Principal>(
                    Iter.toArray(usersRefferals.vals()),
                    func(referral : Referral) : Principal {
                        return referral.refefferedUser;
                    },
                );
                return {
                    id = user.id;
                    firstName = user.firstName;
                    lastName = user.lastName;
                    referrals = referralPrincipals;
                };
            },
        );
    };

    public shared ({ caller }) func redeemRewards(wallet : Principal, amount : Nat) : async Result.Result<(), Text> {
        switch (users.get(caller)) {
            case (null) {
                return #err("User not found");
            };
            case (?_user) {
                if (_user.rewards.balance < amount) {
                    return #err("Insufficient balance");
                };
                let _actor = actor (tokenCanister) : TokenInterface;
                let transferArg : Types.TransferArg = {
                    to = { owner = wallet; subaccount = null };
                    fee = null;
                    memo = null;
                    from_subaccount = null;
                    created_at_time = null;
                    amount = amount * tokenDecimals;
                };
                switch (await _actor.icrc1_transfer(transferArg)) {
                    case (#Err(err)) {
                        return #err(handleTransferError(err));
                    };
                    case (#Ok(_)) {
                        let updatedUser : User = {
                            _user with
                            rewards = {
                                _user.rewards with
                                balance = _user.rewards.balance - amount;
                            };
                        };
                        users.put(caller, updatedUser);
                        return #ok(());
                    };
                };
            };
        };

    };

    public shared func cashbackTxn(txnId : Text, percentage : Float, reloadlyTxnId : Text) : async Result.Result<(), Text> {
        switch (transactions.get(txnId)) {
            case (null) {
                return #err("Transaction not found");
            };
            case (?_txn) {
                switch (_txn.status) {
                    case (#Initiated) {
                        return #err("Transaction not yet transfered");
                    };
                    case (#Completed) {
                        return #err("Transaction already completed");
                    };
                    case (#FailedNRefunded) {
                        return #err("Transaction failed and refunded");
                    };
                    case (#TokensTransfered) {
                        let cashbackAmount = (natToFloat(_txn.transferData.amount) * percentage) / 100;
                        Debug.print("Cashback amount: " # Float.toText(cashbackAmount));
                        let _actor = actor (tokenCanister) : TokenInterface;
                        let transferArg : Types.TransferArg = {
                            to = {
                                owner = _txn.userPrincipal;
                                subaccount = null;
                            };
                            fee = null;
                            memo = null;
                            from_subaccount = null;
                            created_at_time = null;
                            amount = floatToNat(cashbackAmount);
                        };
                        switch (await _actor.icrc1_transfer(transferArg)) {
                            case (#Err(err)) {
                                return #err(handleTransferError(err));
                            };
                            case (#Ok(_)) {
                                switch (await completeTxn(txnId, reloadlyTxnId)) {
                                    case (#err(err)) {
                                        return #err(err);
                                    };
                                    case (#ok(_)) {
                                        return #ok(());
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };

    func natToFloat(nat : Nat) : Float {
        return Float.fromInt64(Int64.fromNat64(Nat64.fromNat(nat)));
    };

    func floatToNat(float : Float) : Nat {
        return Nat64.toNat(Int64.toNat64(Float.toInt64(float)));
    };
    public shared query func getRewards() : async ([Types.RewardsReturn], Nat) {

        let usersRewards = TrieMap.map<Principal, User, Types.RewardsReturn>(
            users,
            Principal.equal,
            Principal.hash,
            func(k, v) {
                let rewardsTotal = v.rewards.signup.numberOfTimes + v.rewards.referral.numberOfTimes + v.rewards.socialShare.numberOfTimes + v.rewards.review.numberOfTimes;
                return {
                    user = v.id;
                    username = v.username;
                    rewards = rewardsTotal;
                    referrals = v.rewards.referral.numberOfTimes;
                    totalAmountEarned = v.rewards.totalAmountEarned;
                    balance = v.rewards.balance;
                    created = v.createdAt;
                };
            },
        );
        return (Iter.toArray(usersRewards.vals()), users.size());
    };

    public shared query ({ caller }) func getUserRewards() : async Result.Result<Types.Rewards, Text> {
        switch (users.get(caller)) {
            case (null) {
                return #err("User not found");
            };
            case (?_user) {
                let rewardsTotal = _user.rewards.signup.numberOfTimes + _user.rewards.referral.numberOfTimes + _user.rewards.socialShare.numberOfTimes + _user.rewards.review.numberOfTimes;
                let rewards : Types.Rewards = {
                    user = _user.id;
                    username = _user.username;
                    rewards = rewardsTotal;
                    referrals = _user.rewards.referral.numberOfTimes;
                    totalAmountEarned = _user.rewards.totalAmountEarned;
                    balance = _user.rewards.balance;
                    created = _user.createdAt;
                };
                return #ok(rewards);
            };
        };
    };

    func handleTransferError(err : Types.TransferError) : Text {
        return switch (err) {
            case (#GenericError(details)) {
                "Generic error: " # details.message # " (code: " # Nat.toText(details.error_code) # ")";
            };
            case (#TemporarilyUnavailable) {
                "Temporarily unavailable";
            };
            case (#BadBurn(details)) {
                "Bad burn, minimum amount: " # Nat.toText(details.min_burn_amount);
            };
            case (#Duplicate(details)) {
                "Duplicate transaction, original ID: " # Nat.toText(details.duplicate_of);
            };
            case (#BadFee(details)) {
                "Incorrect fee, expected: " # Nat.toText(details.expected_fee);
            };
            case (#CreatedInFuture(details)) {
                "Created in the future, ledger time: " # Nat64.toText(details.ledger_time);
            };
            case (#TooOld) {
                "Transaction too old";
            };
            case (#InsufficientFunds(details)) {
                "Insufficient funds, balance: " # Nat.toText(details.balance);
            };
        };
    };

    /*************************
    * Internal Transactions
    *************************/

    public shared ({ caller }) func intiateTxn(payload : Types.TxnPayload) : async Result.Result<InternalTxn, Text> {
        let id = transactions.size();
        let txn : InternalTxn = {
            id;
            userEmail = payload.userEmail;
            status = #Initiated;
            reloadlyTxnId = null;
            transferAmount = payload.transferAmount;
            transferData = {
                from = { owner = caller; subaccount = null };
                amount = payload.transferAmount;
            };
            cashback = payload.cashback;
            quantity = payload.quantity;
            txnType = payload.txnType;
            userPrincipal = caller;
            timestamp = Time.now();
        };
        transactions.put(Nat.toText(id), txn);
        return #ok(txn);
    };

    public shared func transferTransaction(txnId : Text) : async Result.Result<InternalTxn, Text> {
        switch (transactions.get(txnId)) {
            case (null) {
                return #err("Transaction not found");
            };
            case (?_txn) {
                switch (_txn.status) {
                    case (#Initiated) {
                        let _actor = actor (tokenCanister) : TokenInterface;
                        let transferArg : Types.TransferFromArgs = {
                            to = {
                                owner = Principal.fromActor(this);
                                subaccount = null;
                            };
                            fee = ?10_000;
                            memo = null;
                            from = _txn.transferData.from;
                            created_at_time = ?Nat64.fromIntWrap(Time.now());
                            amount = _txn.transferData.amount;
                            spender_subaccount = null;
                        };
                        switch (await _actor.icrc2_transfer_from(transferArg)) {
                            case (#Err(err)) {
                                return #err(handleTransferFromError(err));
                            };
                            case (#Ok(_)) {
                                let updatedTxn : InternalTxn = {
                                    _txn with
                                    status = #TokensTransfered;
                                };
                                transactions.put(txnId, updatedTxn);
                                return #ok(updatedTxn);
                            };
                        };
                    };
                    case (#Completed) {
                        return #err("Transaction already completed");
                    };
                    case (#TokensTransfered) {
                        return #err("Tokens already transfered");
                    };
                    case (#FailedNRefunded) {
                        return #err("Transaction failed and refunded");
                    };
                };
            };
        };
    };

    public shared func completeTxn(txnId : Text, reloadlyTxnId : Text) : async Result.Result<InternalTxn, Text> {
        switch (transactions.get(txnId)) {
            case (null) {
                return #err("Transaction not found");
            };
            case (?_txn) {
                switch (_txn.status) {
                    case (#Initiated) {
                        return #err("Transaction not yet transfered");
                    };
                    case (#Completed) {
                        return #err("Transaction already completed");
                    };
                    case (#FailedNRefunded) {
                        return #err("Transaction failed and refunded");
                    };
                    case (#TokensTransfered) {
                        let updatedTxn : InternalTxn = {
                            _txn with
                            reloadlyTxnId = ?reloadlyTxnId;
                            status = #Completed;
                        };
                        transactions.put(txnId, updatedTxn);
                        return #ok(updatedTxn);
                    };
                };
            };
        };
    };

    public shared func refundFailedTxn(txnId : Text) : async Result.Result<InternalTxn, Text> {
        switch (transactions.get(txnId)) {
            case (null) {
                return #err("Transaction not found");
            };
            case (?_txn) {
                switch (_txn.status) {
                    case (#Initiated) {
                        return #err("Transaction not yet transfered");
                    };
                    case (#Completed) {
                        return #err("Transaction already completed");
                    };
                    case (#FailedNRefunded) {
                        return #err("Transaction failed and refunded");
                    };
                    case (#TokensTransfered) {
                        let _actor = actor (tokenCanister) : TokenInterface;
                        let transferArg : Types.TransferArg = {
                            to = _txn.transferData.from;
                            fee = null;
                            memo = null;
                            from_subaccount = null;
                            created_at_time = null;
                            amount = _txn.transferData.amount;
                        };
                        switch (await _actor.icrc1_transfer(transferArg)) {
                            case (#Err(err)) {
                                return #err(handleTransferError(err));
                            };
                            case (#Ok(_)) {
                                let updatedTxn : InternalTxn = {
                                    _txn with
                                    status = #FailedNRefunded;
                                };
                                transactions.put(txnId, updatedTxn);
                                return #ok(updatedTxn);
                            };
                        };
                    };
                };
            };
        };
    };

    public shared query ({ caller }) func getTxnsByEmail(email : Text) : async [InternalTxn] {
        assert (Principal.isController(caller));
        let txns = TrieMap.mapFilter<InternalTxnId, InternalTxn, InternalTxn>(
            transactions,
            Text.equal,
            Text.hash,
            func(k, v) {
                if (v.userEmail == email) {
                    ?v;
                } else {
                    null;
                };
            },
        );
        return Iter.toArray(txns.vals());
    };

    func handleTransferFromError(err : Types.TransferFromError) : Text {
        return switch (err) {
            case (#GenericError(details)) {
                "Generic error: " # details.message # " (code: " # Nat.toText(details.error_code) # ")";
            };
            case (#TemporarilyUnavailable) {
                "Temporarily unavailable";
            };
            case (#InsufficientAllowance(details)) {
                "Insufficient allowance, required: " # Nat.toText(details.allowance);
            };
            case (#BadBurn(details)) {
                "Bad burn, minimum amount: " # Nat.toText(details.min_burn_amount);
            };
            case (#Duplicate(details)) {
                "Duplicate transaction, original ID: " # Nat.toText(details.duplicate_of);
            };
            case (#BadFee(details)) {
                "Incorrect fee, expected: " # Nat.toText(details.expected_fee);
            };
            case (#CreatedInFuture(details)) {
                "Created in the future, ledger time: " # Nat64.toText(details.ledger_time);
            };
            case (#TooOld) {
                "Transaction too old";
            };
            case (#InsufficientFunds(details)) {
                "Insufficient funds, balance: " # Nat.toText(details.balance);
            };
        };
    };

    /****************************
    * SOCIAL SHARE
    *****************************/

    public shared ({ caller }) func addSocialShereRequest(args : Types.SocialShareRewardRequestPayload) : async () {
        let id = socialShareRequests.size();
        let request : Types.SocialShareRewardRequest = {
            id = id;
            user = caller;
            postUrl = args.postUrl;
            platform = args.platform;
            approved = false;
            timestamp = Time.now();
        };
        socialShareRequests.put(Nat.toText(id), request);
    };

    public shared ({ caller }) func approveSocialShareReuest(id : Text) : async Result.Result<(Types.SocialShareRewardRequest), Text> {
        assert (Principal.isController(caller));
        switch (socialShareRequests.get(id)) {
            case (null) {
                return #err("Social reward not found");
            };
            case (?_req) {
                switch (users.get(_req.user)) {
                    case (null) {
                        return #err("User not found");
                    };
                    case (?_user) {

                        let updatedReq : Types.SocialShareRewardRequest = {
                            _req with
                            approved = true
                        };
                        socialShareRequests.put(id, updatedReq);

                        let updatedUser : User = {
                            _user with
                            rewards = {
                                _user.rewards with
                                socialShare = {
                                    amount = _user.rewards.socialShare.amount + socialShareReward;
                                    numberOfTimes = _user.rewards.socialShare.numberOfTimes + 1;
                                };
                                totalAmountEarned = _user.rewards.totalAmountEarned + socialShareReward;
                                balance = _user.rewards.balance + socialShareReward;
                            }
                        };
                        users.put(_req.user, updatedUser);
                        return #ok(updatedReq);

                    };
                };

            };
        };
    };

    public shared query func getAllSocialShareRequest() : async [Types.SocialShareRewardRequest] {
        return Iter.toArray(socialShareRequests.vals());
    };

    public shared query ({ caller }) func getMySocialShareRequest() : async [Types.SocialShareRewardRequest] {
        let myRequests = TrieMap.mapFilter<SocialShareRewardRequestId, Types.SocialShareRewardRequest, Types.SocialShareRewardRequest>(
            socialShareRequests,
            Text.equal,
            Text.hash,
            func(k, v) {
                if (v.user == caller) {
                    ?v;
                } else {
                    null;
                };
            },
        );
        return Iter.toArray(myRequests.vals());
    };
    public shared ({ caller }) func updateMyShareRequest(args : Types.SocialShareRewardRequestPayload, id : Nat) : async Result.Result<Types.SocialShareRewardRequest, Text> {
        switch (socialShareRequests.get(Nat.toText(id))) {
            case (null) {
                return #err("Social reward not found");
            };
            case (?_req) {
                if (_req.user != caller) {
                    return #err("You are not authorized to update this request");
                };
                let updatedReq : Types.SocialShareRewardRequest = {
                    _req with
                    postUrl = args.postUrl;
                };
                socialShareRequests.put(Nat.toText(id), updatedReq);
                return #ok(updatedReq);
            };
        };
    };
};
