import type { NewSkill, Skill } from "@/src/entities/rank/types";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { getRankBgColor } from "@/src/entities/rank/ui/get-rank-color";
import { cn } from "@/src/lib/utils";

import AddSkillModal from "../add-skill-modal/add-skill-modal";

function SkillsTable({ skills, selectedSkillId, setSelectedSkillId, onAddSkill }: { skills: Skill[]; selectedSkillId: string | null; setSelectedSkillId: (id: string | null) => void; onAddSkill: (skill: NewSkill) => void }) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
        <h2 className="text-base sm:text-lg font-semibold">Skills</h2>
        <AddSkillModal onAddSkill={onAddSkill} />
      </div>
      <Table>
        <TableCaption>A list of your skills.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] sm:w-[100px]">Rank</TableHead>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center">LvL</TableHead>
            <TableHead className="text-center hidden sm:table-cell">XP</TableHead>
            <TableHead className="text-right hidden sm:table-cell">Actions</TableHead>
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
                onClick={() => setSelectedSkillId(isSelected ? null : skill.id)}
              >
                <TableCell className={cn("font-medium inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-white text-xs sm:text-sm rounded", getRankBgColor(skill.rank))}>
                  {skill.rank}
                </TableCell>
                <TableCell className="text-center max-w-[120px] sm:max-w-none truncate">{skill.skillName}</TableCell>
                <TableCell className="text-center">{skill.level}</TableCell>
                <TableCell className="text-center hidden sm:table-cell">
                  {skill.currentXp}
                  /
                  {skill.nextLevelXp}
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell">actions</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default SkillsTable;
