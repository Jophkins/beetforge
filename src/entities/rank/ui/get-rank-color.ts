import type { Rank } from "../types";

import { rankColorToken } from "../tokens";
import { tokenToBgColor, tokenToBorderColor, tokenToTaskBgColor } from "./rank.styles";

export function getRankBgColor(rank: Rank) {
  return tokenToBgColor[rankColorToken[rank]];
}

export function getRankBorderColor(rank: Rank) {
  return tokenToBorderColor[rankColorToken[rank]];
}

export function getRankTaskBgColor(rank: Rank) {
  return tokenToTaskBgColor[rankColorToken[rank]];
}
