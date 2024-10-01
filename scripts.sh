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

dfx canister call token icrc1_transfer "(record { 
  to = record { 
    owner = principal \"7km4a-3mivz-sugwg-naxhb-uc4fl-7nrqt-ibcsv-lbepu-v7tqu-33mup-fqe\";
  }; 
  amount = 100_000_000_000_000;
})"

dfx canister call token icrc2_transfer_from "(record { 
  amount = 90_000; 
  from = record { 
    owner = principal \"7km4a-3mivz-sugwg-naxhb-uc4fl-7nrqt-ibcsv-lbepu-v7tqu-33mup-fqe\";
  }; 
  to = record { 
    owner = principal \"7km4a-3mivz-sugwg-naxhb-uc4fl-7nrqt-ibcsv-lbepu-v7tqu-33mup-fqe\";
  }; 
})"

dfx canister call token icrc2_approve "(record { 
  amount = 100_000; 
  spender = record { 
    owner = principal \"sckqo-e2vyl-4rqqu-5g4wf-pqskh-iynjm-46ixm-awluw-ucnqa-4sl6j-mqe\";
  }; 
})"
