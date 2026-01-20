import type { Rank } from "@/src/entities/rank/types";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

function SelectRank({ value, onValueChange }: { value?: Rank; onValueChange?: (value: Rank) => void }) {
  return (
    <Select value={value} onValueChange={val => val && onValueChange?.(val as Rank)}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select a rank" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select a rank</SelectLabel>
          <SelectItem value="S">S</SelectItem>
          <SelectItem value="A">A</SelectItem>
          <SelectItem value="B">B</SelectItem>
          <SelectItem value="C">C</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectRank;
