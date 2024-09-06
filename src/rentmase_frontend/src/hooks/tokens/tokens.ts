import ic from "./icblast.js";
import { idlFactory as aggridl } from "./aggregator.idl.js";
import { first_tick, i2t, lastStartedTick, p2i } from "./utils.js";

function unique(a) {
  return [...new Set(a)];
}

export const fetchTokens = async () => {
  let aggr = await ic("u45jl-liaaa-aaaam-abppa-cai", aggridl);

  const interval = "t1d";
  const ids = unique([0, 1, 2, 3]);
  const back = 31;

  let to = lastStartedTick(i2t(interval), Date.now() / 1000);
  let from = Math.max(to - i2t(interval) * back, first_tick);

  let tokens = await aggr.get_tokens(ids, from * 1000000000, to * 1000000000);

  console.log("Tokens: ", tokens);

  let start = Number(tokens.ok.first / 1000000000n);
  let end = Number(tokens.ok.last / 1000000000n);

  let data = tokens.ok.tokens.map((t) => {
    return {
      time: t.time / 1000000000,
      id: t.id,
      value: t.value,
    };
  });

  return { data, start, end };
};
