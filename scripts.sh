dfx deploy token --argument '
  (variant {
    Init = record {
      token_name = "Token E";
      token_symbol = "E";
      minting_account = record {
        owner = principal "shu3y-t65bi-rhvef-c7vvy-arrzh-emws6-g2uew-hpgh2-uvjqi-7s3b2-zae";
      };
      initial_balances = vec {
        record {
          record {
            owner = principal "shu3y-t65bi-rhvef-c7vvy-arrzh-emws6-g2uew-hpgh2-uvjqi-7s3b2-zae";
          };
          100_000_000_000;
        };
      };
      metadata = vec {};
      transfer_fee = 10_000;
      archive_options = record {
        trigger_threshold = 2000;
        num_blocks_to_archive = 1000;
        controller_id = principal "shu3y-t65bi-rhvef-c7vvy-arrzh-emws6-g2uew-hpgh2-uvjqi-7s3b2-zae";
      };
      feature_flags = opt record {
        icrc2 = true;
      };
    }
  })
'

dfx canister call token icrc1_transfer "(record { to = record { owner = principal \"lvr2m-qiywl-xzoe3-5ci2z-exnbi-4y3z4-h6ils-6wpjv-kpq6i-cyfa6-dqe\";}; amount = 1_000_000_000_000;})"
