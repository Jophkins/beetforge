import type { Rank } from "@/src/entities/rank/types";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { getRankBgColor } from "@/src/entities/rank/ui/get-rank-bg-color";
import { cn } from "@/src/lib/utils";

type Skill = {
  id: number;
  title: string;
  description: string;
  rank: Rank;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  tasks: {
    id: number;
    title: string;
    isCompleted: boolean;
  }[];
};
function SkillsTable({ skills, selectedSkillId, setSelectedSkillId }: { skills: Skill[]; selectedSkillId: number | null; setSelectedSkillId: (id: number) => void }) {
  return (
    <>
      <div className="flex items-center gap-2 border-b border-gray-600 pb-2">
        <h2 className="text-lg font-semibold">Skill</h2>
        <button className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <Table>
        <TableCaption>A list of your skills.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center">LvL</TableHead>
            <TableHead className="text-center">XP</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.map((skill) => {
            const isSelected = selectedSkillId === skill.id;
            return (
              <TableRow
                key={skill.id}
                className={cn(
                  "cursor-pointer hover:bg-sky-500/20 transition-colors",
                  isSelected && "bg-sky-500/20",
                )}
                onClick={() => setSelectedSkillId(isSelected ? skill.id : skill.id)}
              >
                <TableCell className={cn("mt-0.5 font-medium inline-flex items-center justify-center w-8 h-8 text-white rounded", getRankBgColor(skill.rank))}>
                  {skill.rank}
                </TableCell>
                <TableCell className="text-center">{skill.title}</TableCell>
                <TableCell className="text-center">{skill.level}</TableCell>
                <TableCell className="text-center">
                  {skill.currentXp}
                  /
                  {skill.nextLevelXp}
                </TableCell>
                <TableCell className="text-right">actions</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}

export default SkillsTable;
