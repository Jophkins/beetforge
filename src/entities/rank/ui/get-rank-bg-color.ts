import type { Rank } from "../types";

import { rankColorToken } from "../tokens";
import { tokenToBgColor } from "./rank.styles";

export function getRankBgColor(rank: Rank) {
  return tokenToBgColor[rankColorToken[rank]];
}
