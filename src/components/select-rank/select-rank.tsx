import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

function SelectRank() {
  return (
    <Select>
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
