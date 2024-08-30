import List "mo:base/List";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Types "types";

actor {
      type User = Types.User;
      type TokenInterface = Types.TokenInterface;

    var rewardAmount = 100;
    let tokenCanister = "rrkah-fqaaa-aaaaa-aaaaq-cai";
    let tokenDecimals= 100_000_000;

    stable var users = List.nil<User>();

    public shared ({ caller }) func registerUser(payload : Types.UserPayload) : async Result.Result<User, Text> {
        assert(not Principal.isAnonymous(caller));
        switch (payload.referrerCode) {
            case (null) {
                let user = _createUser(payload, caller);
                return #ok(user);
            };
            case (?code) {
                let referralUser = List.find<User>(
                    users,
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
                        var userRewards = List.fromArray<Types.Reward>(_user.rewards);
                        var userReferrals = List.fromArray<Principal>(_user.referrals);
                        let reward : Types.Reward = {
                            amount = rewardAmount;
                            claimed = false;
                            claimedAt = null;
                            timestamp = Time.now();
                        };
                        userRewards := List.push<Types.Reward>(reward, userRewards);
                        userReferrals := List.push<Principal>(caller, userReferrals);
                        let updatedUser : User = {
                            _user with
                            rewards = List.toArray<Types.Reward>(userRewards);
                            referrals = List.toArray<Principal>(userReferrals);
                        };
                        func updateUser(u : User) : User {
                            if (u.id == _user.id) {
                                return updatedUser;
                            } else {
                                return u;
                            };
                        };
                        users := List.map(users, updateUser);
                       let user = _createUser(payload, caller);
                       return #ok(user);
                    };
                };
            };
        };
    };

    func _createUser(payload : Types.UserPayload, id : Principal) : User {
        let user : User = {
            id = id;
            firstName = payload.firstName;
            lastName = payload.lastName;
            referralCode = payload.referralCode;
            referrals = [];
            rewards = [];
            dob = payload.dob;
            gender = payload.gender;
            lastupdated = Time.now();
            email = payload.email;
            createdAt = Time.now();
        };
        users := List.push<User>(user, users);
        return user;
    };

    public shared ({caller}) func updateProfile(payload : Types.UserUpdatePayload) : async Result.Result<User, Text> {
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

    public shared query ({caller}) func getAllUsers() : async [User] {
        assert(Principal.isController(caller));
        return List.toArray<User>(users);
    };

    public shared query func getPublicUsers() : async [Types.PublicUser] {
        return List.toArray(List.map<User, Types.PublicUser>(
            users,
            func(user : User) : Types.PublicUser {
                return {
                    id = user.id;
                    firstName = user.firstName;
                    lastName = user.lastName;
                    referrals = user.referrals;
                    rewards = user.rewards;
                };
            },
        ));
    };

    public shared ({caller}) func redeemRewards(wallet: Principal, amount: Nat) : async Result.Result<(), Text> {
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
                let rewardslist = List.fromArray<Types.Reward>(_user.rewards);
                let _claimedRewards = List.filter<Types.Reward>(
                    rewardslist,
                    func(reward : Types.Reward) : Bool {
                        return reward.claimed == true;
                    },
                );
                let unclaimedRewards = List.filter<Types.Reward>(
                    rewardslist,
                    func(reward : Types.Reward) : Bool {
                        return reward.claimed == false;
                    },
                );
                let unclaimedSize = List.size<Types.Reward>(unclaimedRewards);
                if (unclaimedSize < amount) {
                    return #err("Insufficient rewards, " # Nat.toText(unclaimedSize) # " rewards available");
                };
                let tobeClaimedRewards = List.take<Types.Reward>(unclaimedRewards, amount);
                switch (await transferRewards(wallet, amount * rewardAmount)) {
                    case (#err(err)) {
                        return #err(err);
                    };
                    case (#ok(_)) {
                        let claimedRewards = List.map<Types.Reward, Types.Reward>(
                            tobeClaimedRewards,
                            func(reward : Types.Reward) : Types.Reward {
                                return { reward with claimed = true; claimedAt = ?Time.now() };
                            },
                        );
                        let remainingRewards = List.drop<Types.Reward>(unclaimedRewards, amount);
                        let combinedRewards = List.append<Types.Reward>(claimedRewards, remainingRewards);
                        let updatedRewards = List.append<Types.Reward>(combinedRewards, _claimedRewards);
                        let updatedUser : User = {
                            _user with
                            rewards = List.toArray<Types.Reward>(updatedRewards);
                        };
                        func updateUser(u : User) : User {
                            if (u.id == _user.id) {
                                return updatedUser;
                            } else {
                                return u;
                            };
                        };
                        users := List.map(users, updateUser);
                        return #ok(());
                    };
                };


                return #ok(());
            };
        };
    };

    public shared query ({caller}) func getUnclaimedRewards() : async Result.Result<[Types.Reward], Text> {
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
                let rewardslist = List.fromArray<Types.Reward>(_user.rewards);
                let unclaimedRewards = List.filter<Types.Reward>(
                    rewardslist,
                    func(reward : Types.Reward) : Bool {
                        return reward.claimed == false;
                    },
                );
                return #ok(List.toArray<Types.Reward>(unclaimedRewards));
            };
        };
    };

    func transferRewards(wallet: Principal, amount: Nat) : async Result.Result<(), Text> {
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


};
