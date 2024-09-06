dfx deploy token --argument '
  (variant {
    Init = record {
      token_name = "Token E";
      token_symbol = "E";
      minting_account = record {
        owner = principal "nu4ce-6r22f-2x4c3-byypo-ltk2h-rpoks-qd3hw-w22d6-n6adq-iwahh-jae";
      };
      initial_balances = vec {
        record {
          record {
            owner = principal "nu4ce-6r22f-2x4c3-byypo-ltk2h-rpoks-qd3hw-w22d6-n6adq-iwahh-jae";
          };
          100_000_000_000;
        };
      };
      metadata = vec {};
      transfer_fee = 10_000;
      archive_options = record {
        trigger_threshold = 2000;
        num_blocks_to_archive = 1000;
        controller_id = principal "nu4ce-6r22f-2x4c3-byypo-ltk2h-rpoks-qd3hw-w22d6-n6adq-iwahh-jae";
      };
      feature_flags = opt record {
        icrc2 = true;
      };
    }
  })
'

dfx canister call token icrc1_transfer "(record { to = record { owner = principal \"lvr2m-qiywl-xzoe3-5ci2z-exnbi-4y3z4-h6ils-6wpjv-kpq6i-cyfa6-dqe\";}; amount = 1_000_000_000_000;})"