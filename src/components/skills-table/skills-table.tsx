import type { Skill } from "@/src/entities/rank/types";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { getRankBgColor } from "@/src/entities/rank/ui/get-rank-color";
import { cn } from "@/src/lib/utils";

import AddSkillModal from "../add-skill-modal/add-skill-modal";

function SkillsTable({ skills, selectedSkillId, setSelectedSkillId }: { skills: Skill[]; selectedSkillId: number | null; setSelectedSkillId: (id: number) => void }) {
  return (
    <>
      <div className="flex items-center gap-2 border-b border-gray-600 pb-2">
        <h2 className="text-lg font-semibold">Skill</h2>
        <AddSkillModal />
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
                <TableCell className="text-center">{skill.skillName}</TableCell>
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
