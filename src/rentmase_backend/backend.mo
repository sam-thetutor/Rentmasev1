import List "mo:base/List";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Int64 "mo:base/Int64";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Order "mo:base/Order";
import Trie "mo:base/Trie";
import TrieMap "mo:base/TrieMap";
import Iter "mo:base/Iter";
import Types "types";

actor class Rentmase() = this {
    type User = Types.User;
    type TokenInterface = Types.TokenInterface;
    type InternalTxn = Types.InternalTxn;
    type TxnPayload = Types.TxnPayload;
    type CashbackType = Types.CashbackType;

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

    var rewards = TrieMap.TrieMap<RewardId, Types.Rewards>(Text.equal, Text.hash);
    stable var rewardsEntries : [(RewardId, Types.Rewards)] = [];

    var socialShareRequests = TrieMap.TrieMap<SocialShareRewardRequestId, Types.SocialShareRewardRequest>(Text.equal, Text.hash);
    stable var socialShareRequestsEntries : [(SocialShareRewardRequestId, Types.SocialShareRewardRequest)] = [];

    var faucets = TrieMap.TrieMap<Principal, Types.FaucetTxn>(Principal.equal, Principal.hash);
    stable var faucetsEntries : [(Principal, Types.FaucetTxn)] = [];

    var transactions = TrieMap.TrieMap<InternalTxnId, InternalTxn>(Text.equal, Text.hash);
    stable var transactionsEntries : [(InternalTxnId, InternalTxn)] = [];

    system func preupgrade() {
        usersEntries := Iter.toArray(users.entries());
        reviewsEntries := Iter.toArray(reviews.entries());
        rewardsEntries := Iter.toArray(rewards.entries());
        socialShareRequestsEntries := Iter.toArray(socialShareRequests.entries());
        faucetsEntries := Iter.toArray(faucets.entries());
        transactionsEntries := Iter.toArray(transactions.entries());
    };

    system func postupgrade() {
        users := TrieMap.fromEntries<Principal, User>(usersEntries.vals(), Principal.equal, Principal.hash);
        reviews := TrieMap.fromEntries<ReviewId, Types.Review>(reviewsEntries.vals(), Text.equal, Text.hash);
        rewards := TrieMap.fromEntries<RewardId, Types.Rewards>(rewardsEntries.vals(), Text.equal, Text.hash);
        socialShareRequests := TrieMap.fromEntries<SocialShareRewardRequestId, Types.SocialShareRewardRequest>(socialShareRequestsEntries.vals(), Text.equal, Text.hash);
        faucets := TrieMap.fromEntries<Principal, Types.FaucetTxn>(faucetsEntries.vals(), Principal.equal, Principal.hash);
        transactions := TrieMap.fromEntries<InternalTxnId, InternalTxn>(transactionsEntries.vals(), Text.equal, Text.hash);
        usersEntries := [];
        reviewsEntries := [];
        rewardsEntries := [];
        socialShareRequestsEntries := [];
        faucetsEntries := [];
        transactionsEntries := [];
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
                                totalAmountEarned = _user.rewards.totalAmountEarned + referralRewardAmnt;
                                balance = _user.rewards.balance + referralRewardAmnt;
                            }
                        };
                        users.put(_user.id, updatedRefererUser);
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
                signup = signupRewardAmnt;
                referral = 0;
                socialShare = 0;
                review = 0;
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
                return {
                    id = user.id;
                    firstName = user.firstName;
                    lastName = user.lastName;
                    referrals = user.referrals;
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
                                totalWithdrawn = _user.rewards.totalWithdrawn + amount;
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
        


        // return List.toArray<Types.Rewards>(rewards);

        let sortedRewards = List.fromArray(
            Array.sort(
                List.toArray(rewards),
                func(a : Types.Rewards, b : Types.Rewards) : Order.Order {
                    let a_rewards = Array.size(a.rewards);
                    let b_rewards = Array.size(b.rewards);
                    Nat.compare(a_rewards, b_rewards);
                },
            )

        );
        let reversedRewards = List.reverse(sortedRewards);

        let shortList = List.take(reversedRewards, 50);

        let modifiedList = List.map<Types.Rewards, Types.RewardsReturn>(
            shortList,
            func(reward : Types.Rewards) : Types.RewardsReturn {
                return {
                    user = reward.user;
                    username = reward.username;
                    rewards = Array.size(reward.rewards);
                    referrals = getUsersReferedValue(reward.rewards);
                    totalAmountEarned = reward.totalAmountEarned;
                    balance = reward.balance;
                    created = reward.created;
                };
            },
        );
        return (List.toArray(modifiedList), List.size(rewards));
    };

    func getUsersReferedValue(args : [Types.RewardType]) : Nat {
        var value = 0;
        for (reward in args.vals()) {
            switch (reward) {
                case (#Referral(_)) {
                    value += 1;
                };
                case (_) {};

            };
        };
        return value;
    };

    public shared query ({ caller }) func getUserRewards() : async Result.Result<Types.Rewards, Text> {
        let userRewards = List.find<Types.Rewards>(
            rewards,
            func(reward : Types.Rewards) : Bool {
                return reward.user == caller;
            },
        );
        switch (userRewards) {
            case (null) {
                return #err("User has no rewards");
            };
            case (?_userRewards) {
                return #ok(_userRewards);
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
        let id = List.size<InternalTxn>(transactions);
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
        transactions := List.push<InternalTxn>(txn, transactions);
        return #ok(txn);
    };

    public shared func transferTransaction(txnId : Int) : async Result.Result<InternalTxn, Text> {
        let txn = List.find<InternalTxn>(
            transactions,
            func(txn : InternalTxn) : Bool {
                return txn.id == txnId;
            },
        );
        switch (txn) {
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
                                func updateTxn(t : InternalTxn) : InternalTxn {
                                    if (t.id == _txn.id) {
                                        return updatedTxn;
                                    } else {
                                        return t;
                                    };
                                };
                                transactions := List.map(transactions, updateTxn);
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
        let txn = List.find<InternalTxn>(
            transactions,
            func(txn : InternalTxn) : Bool {
                return txn.id == txnId;
            },
        );
        switch (txn) {
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
                        func updateTxn(t : InternalTxn) : InternalTxn {
                            if (t.id == _txn.id) {
                                return updatedTxn;
                            } else {
                                return t;
                            };
                        };
                        transactions := List.map(transactions, updateTxn);
                        return #ok(updatedTxn);
                    };
                };
            };
        };
    };

    public shared func refundFailedTxn(txnId : Int) : async Result.Result<InternalTxn, Text> {
        let txn = List.find<InternalTxn>(
            transactions,
            func(txn : InternalTxn) : Bool {
                return txn.id == txnId;
            },
        );
        switch (txn) {
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
                                func updateTxn(t : InternalTxn) : InternalTxn {
                                    if (t.id == _txn.id) {
                                        return updatedTxn;
                                    } else {
                                        return t;
                                    };
                                };
                                transactions := List.map(transactions, updateTxn);
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
        return List.toArray<InternalTxn>(
            List.filter<InternalTxn>(
                transactions,
                func(txn : InternalTxn) : Bool {
                    return txn.userEmail == email;
                },
            )
        );
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
        let request : Types.SocialShareRewardRequest = {
            id = List.size(socialShareRequests);
            user = caller;
            postUrl = args.postUrl;
            platform = args.platform;
            approved = false;
            timestamp = Time.now();
        };
        socialShareRequests := List.push<Types.SocialShareRewardRequest>(request, socialShareRequests);
    };

    public shared ({ caller }) func approveSocialShareReuest(id : Nat) : async Result.Result<(Types.SocialShareRewardRequest), Text> {
        assert (Principal.isController(caller));
        let request = List.find<Types.SocialShareRewardRequest>(
            socialShareRequests,
            func(txn : Types.SocialShareRewardRequest) : Bool {
                return txn.id == id;
            },
        );

        switch (request) {
            case (null) {
                return #err("Social reward not found");
            };
            case (?_req) {
                let user = List.find<User>(
                    users,
                    func(u : User) : Bool {
                        return u.id == _req.user;
                    },
                );

                switch (user) {
                    case (null) {
                        return #err("User not found");
                    };
                    case (?_user) {

                        let updatedReq : Types.SocialShareRewardRequest = {
                            _req with
                            approved = true
                        };
                        func updateReq(t : Types.SocialShareRewardRequest) : Types.SocialShareRewardRequest {
                            if (t.id == _req.id) {
                                return updatedReq;
                            } else {
                                return t;
                            };
                        };
                        socialShareRequests := List.map(socialShareRequests, updateReq);

                        let userRewards = List.find<Types.Rewards>(
                            rewards,
                            func(reward : Types.Rewards) : Bool {
                                return reward.user == caller;
                            },
                        );
                        switch (userRewards) {
                            case (null) {
                                return #err("User has no rewards");
                            };
                            case (?_userRewards) {
                                var rewardsList = List.fromArray<Types.RewardType>(_userRewards.rewards);
                                rewardsList := List.push<Types.RewardType>(#SocialShare({ amount = socialShareReward; timestamp = Time.now() }), rewardsList);
                                let reward : Types.Rewards = {
                                    user = _req.user;
                                    username = _user.username;
                                    rewards = List.toArray<Types.RewardType>(rewardsList);
                                    totalAmountEarned = _userRewards.totalAmountEarned + socialShareReward;
                                    balance = _userRewards.balance + socialShareReward;
                                    created = Time.now();
                                };
                                rewards := List.push<Types.Rewards>(reward, rewards);
                                return #ok(updatedReq);
                            };
                        };

                    };
                };

            };
        };
    };

    public shared query func getAllSocialShareRequest() : async [Types.SocialShareRewardRequest] {
        return List.toArray<Types.SocialShareRewardRequest>(socialShareRequests);
    };

    public shared query ({ caller }) func getMySocialShareRequest() : async [Types.SocialShareRewardRequest] {
        return List.toArray<Types.SocialShareRewardRequest>(
            List.filter<Types.SocialShareRewardRequest>(
                socialShareRequests,
                func(req : Types.SocialShareRewardRequest) : Bool {
                    return req.user == caller;
                },
            )
        );
    };

    public shared ({ caller }) func updateMyShareRequest(args : Types.SocialShareRewardRequestPayload, id : Nat) : async Result.Result<Types.SocialShareRewardRequest, Text> {
        let request = List.find<Types.SocialShareRewardRequest>(
            socialShareRequests,
            func(req : Types.SocialShareRewardRequest) : Bool {
                return req.user == caller and req.id == id;
            },
        );

        switch (request) {
            case (null) {
                return #err("Social reward not found");
            };
            case (?_req) {
                let updatedReq : Types.SocialShareRewardRequest = {
                    _req with
                    postUrl = args.postUrl;
                };
                func updateReq(t : Types.SocialShareRewardRequest) : Types.SocialShareRewardRequest {
                    if (t.id == _req.id) {
                        return updatedReq;
                    } else {
                        return t;
                    };
                };
                socialShareRequests := List.map(socialShareRequests, updateReq);
                return #ok(updatedReq);
            };
        };
    };
};
