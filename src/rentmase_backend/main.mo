import List "mo:base/List";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import Types "types";

actor class Rentmase() = this {
    type User = Types.User;
    type TokenInterface = Types.TokenInterface;
    type InternalTxn = Types.InternalTxn;
    type TxnPayload = Types.TxnPayload;

    var signupRewardAmnt = 100;
    var referralRewardAmnt = 50;
    var reviewReward = 30;
    var socialShareReward = 50;
    let tokenCanister = "a4tbr-q4aaa-aaaaa-qaafq-cai";
    let tokenDecimals = 100_000_000;

    stable var users = List.nil<User>();
    stable var transactions = List.nil<InternalTxn>();
    stable var reviews = List.nil<Types.Review>();
    stable var rewards = List.nil<Types.Rewards>();
    stable var socialShareRequests = List.nil<Types.SocialShareRewardRequest>();

    public shared ({ caller }) func registerUser(payload : Types.UserPayload) : async Result.Result<User, Text> {
        assert (not Principal.isAnonymous(caller));
        // Does the payload have a referral code?
        switch (payload.referrerCode) {
            case (null) {
                // No referral code, create user
                let user = _createUser(payload, caller);
                return #ok(user);
            };
            case (?code) {
                // Referral code exists, find the user with the code
                let referralUser = List.find<User>(
                    users,
                    func(user : User) : Bool {
                        return user.referralCode == code;
                    },
                );
                switch (referralUser) {
                    case (null) {
                        // Referral code owner not found, create user
                        let user = _createUser(payload, caller);
                        return #ok(user);
                    };
                    case (?_user) {
                        // Referral code owner found, create user and reward the owner
                        var userRewards = List.find<Types.Rewards>(
                            rewards,
                            func(reward : Types.Rewards) : Bool {
                                return reward.user == _user.id;
                            },
                        );
                        let referralReward : Types.ReferralReward = {
                            referred = caller;
                            referralCode = payload.referralCode;
                            amount = referralRewardAmnt;
                            timestamp = Time.now();
                        };
                        switch (userRewards) {
                            case (null) {
                                // User has no rewards, create their first reward
                                let reward : Types.Rewards = {
                                    user = _user.id;
                                    userName = _user.firstName # " " # _user.lastName;
                                    userReferralCode = _user.referralCode;
                                    rewards = [#Referral(referralReward)];
                                    totalAmountEarned = referralRewardAmnt;
                                    balance = referralRewardAmnt;
                                    created = Time.now();
                                };
                                rewards := List.push<Types.Rewards>(reward, rewards);
                            };
                            case (?_rewards) {
                                // User has rewards, add the referral reward
                                var rewardsList = List.fromArray<Types.RewardType>(_rewards.rewards);
                                rewardsList := List.push<Types.RewardType>(#Referral(referralReward), rewardsList);
                                let updatedRewards : Types.Rewards = {
                                    _rewards with
                                    rewards = List.toArray<Types.RewardType>(rewardsList);
                                    totalAmountEarned = _rewards.totalAmountEarned + referralRewardAmnt;
                                    balance = _rewards.balance + referralRewardAmnt;
                                };
                                func updateRewards(r : Types.Rewards) : Types.Rewards {
                                    if (r.user == _rewards.user) {
                                        return updatedRewards;
                                    } else {
                                        return r;
                                    };
                                };
                                rewards := List.map(rewards, updateRewards);
                            };
                        };
                        // Create the user
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
            referralCode = payload.referralCode;
            referrals = [];
            dob = payload.dob;
            gender = payload.gender;
            lastupdated = Time.now();
            email = payload.email;
            createdAt = Time.now();
        };

        let _signupReward : Types.SignupReward = {
            amount = signupRewardAmnt;
            timestamp = Time.now();
        };

        let reward : Types.Rewards = {
            user = id;
            userName = payload.firstName # " " # payload.lastName;
            userReferralCode = payload.referralCode;
            rewards = [#Signup(_signupReward)];
            totalAmountEarned = signupRewardAmnt;
            balance = signupRewardAmnt;
            created = Time.now();
        };
        rewards := List.push<Types.Rewards>(reward, rewards);
        users := List.push<User>(user, users);
        return user;
    };

    public shared ({ caller }) func updateProfile(payload : Types.UserUpdatePayload) : async Result.Result<User, Text> {
        let user = List.find<User>(
            users,
            func(user : User) : Bool {
                return user.id == caller;
            },
        );
        switch (user) {
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
                func updateUser(u : User) : User {
                    if (u.id == _user.id) {
                        return updatedUser;
                    } else {
                        return u;
                    };
                };
                users := List.map(users, updateUser);
                return #ok(updatedUser);
            };
        };
    };

    public shared query func isReferralCodeUnique(referralCode : Text) : async Bool {
        let user = List.find<User>(
            users,
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

    public shared query ({ caller }) func getUser() : async Result.Result<User, Text> {
        let user = List.find<User>(
            users,
            func(user : User) : Bool {
                return user.id == caller;
            },
        );
        switch (user) {
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
        return List.toArray<User>(users);
    };

    // public shared query func getPublicUsers() : async [Types.PublicUser] {
    //     return List.toArray(
    //         List.map<User, Types.PublicUser>(
    //             users,
    //             func(user : User) : Types.PublicUser {
    //                 return {
    //                     id = user.id;
    //                     firstName = user.firstName;
    //                     lastName = user.lastName;
    //                     referrals = user.referrals;
    //                     rewards = user.rewards;
    //                 };
    //             },
    //         )
    //     );
    // };

    // public shared ({ caller }) func redeemRewards(wallet : Principal, amount : Nat) : async Result.Result<(), Text> {
    //     let user = List.find<User>(
    //         users,
    //         func(user : User) : Bool {
    //             return user.id == caller;
    //         },
    //     );
    //     switch (user) {
    //         case (null) {
    //             return #err("User not found");
    //         };
    //         case (?_user) {
    //             let rewardslist = List.fromArray<Types.Reward>(_user.rewards);
    //             let _claimedRewards = List.filter<Types.Reward>(
    //                 rewardslist,
    //                 func(reward : Types.Reward) : Bool {
    //                     return reward.claimed == true;
    //                 },
    //             );
    //             let unclaimedRewards = List.filter<Types.Reward>(
    //                 rewardslist,
    //                 func(reward : Types.Reward) : Bool {
    //                     return reward.claimed == false;
    //                 },
    //             );
    //             let unclaimedSize = List.size<Types.Reward>(unclaimedRewards);
    //             if (unclaimedSize < amount) {
    //                 return #err("Insufficient rewards, " # Nat.toText(unclaimedSize) # " rewards available");
    //             };
    //             let tobeClaimedRewards = List.take<Types.Reward>(unclaimedRewards, amount);
    //             switch (await transferRewards(wallet, amount * referralReward)) {
    //                 case (#err(err)) {
    //                     return #err(err);
    //                 };
    //                 case (#ok(_)) {
    //                     let claimedRewards = List.map<Types.Reward, Types.Reward>(
    //                         tobeClaimedRewards,
    //                         func(reward : Types.Reward) : Types.Reward {
    //                             return {
    //                                 reward with claimed = true;
    //                                 claimedAt = ?Time.now();
    //                             };
    //                         },
    //                     );
    //                     let remainingRewards = List.drop<Types.Reward>(unclaimedRewards, amount);
    //                     let combinedRewards = List.append<Types.Reward>(claimedRewards, remainingRewards);
    //                     let updatedRewards = List.append<Types.Reward>(combinedRewards, _claimedRewards);
    //                     let updatedUser : User = {
    //                         _user with
    //                         rewards = List.toArray<Types.Reward>(updatedRewards);
    //                     };
    //                     func updateUser(u : User) : User {
    //                         if (u.id == _user.id) {
    //                             return updatedUser;
    //                         } else {
    //                             return u;
    //                         };
    //                     };
    //                     users := List.map(users, updateUser);
    //                     return #ok(());
    //                 };
    //             };
    //             return #ok(());
    //         };
    //     };
    // };

    // public shared query ({ caller }) func getUnclaimedRewards() : async Result.Result<[Types.Reward], Text> {
    //     let user = List.find<User>(
    //         users,
    //         func(user : User) : Bool {
    //             return user.id == caller;
    //         },
    //     );
    //     switch (user) {
    //         case (null) {
    //             return #err("User not found");
    //         };
    //         case (?_user) {
    //             let rewardslist = List.fromArray<Types.Reward>(_user.rewards);
    //             let unclaimedRewards = List.filter<Types.Reward>(
    //                 rewardslist,
    //                 func(reward : Types.Reward) : Bool {
    //                     return reward.claimed == false;
    //                 },
    //             );
    //             return #ok(List.toArray<Types.Reward>(unclaimedRewards));
    //         };
    //     };
    // };

    public shared query func getRewards() : async [Types.Rewards] {
        return List.toArray<Types.Rewards>(rewards);
    };

    public shared query ({caller}) func  getUserRewards() : async Result.Result<Types.Rewards, Text> {
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

    func transferRewards(wallet : Principal, amount : Nat) : async Result.Result<(), Text> {
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
                return #ok(());
            };
        };
        return #ok(());
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
            transferAmount = payload.transferAmount;
            transferData = {
                from = { owner = caller; subaccount = null };
                amount = payload.transferAmount;
            };
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
                };
            };
        };
    };

    public shared func completeTxn(txnId : Int) : async Result.Result<InternalTxn, Text> {
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
                    case (#TokensTransfered) {
                        let updatedTxn : InternalTxn = {
                            _txn with
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
};
