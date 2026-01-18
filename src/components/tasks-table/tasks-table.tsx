import { Pencil, Trash } from "lucide-react";

import type { Rank } from "@/src/entities/rank/types";

import { Checkbox } from "@/src/components/ui/checkbox";
import { getRankBgColor, getRankBorderColor, getRankTaskBgColor } from "@/src/entities/rank/ui/get-rank-bg-color";
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

function TasksTable({ selectedSkill }: { selectedSkill: Skill }) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-600 pb-2">
        <h2 className="text-lg font-semibold">
          Goals for:
          {!selectedSkill ? " Select a skill on the left" : ` ${selectedSkill.title}`}
        </h2>
        <span className={cn("mt-0.5 font-medium inline-flex items-center justify-center w-12 h-6 bg-purple-700/0 text-white rounded-2xl", getRankBgColor(selectedSkill?.rank))}>{selectedSkill?.rank}</span>
      </div>
      <div className="p-2">
        <h2 className="text-sm">
          What I want to achieve:
          {" "}
          {` ${selectedSkill?.description}`}
        </h2>
        <div className="flex items-center m-2">
          <span className="mr-3">
            Lvl:
            {" "}
            {` ${selectedSkill?.level}`}
          </span>
          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden flex-1 min-w-0">
            <div
              className="absolute inset-0 bg-yellow-300 rounded-full"
              style={{ width: `${(selectedSkill?.currentXp / selectedSkill?.nextLevelXp) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-800">
              {`${selectedSkill?.currentXp}/${selectedSkill?.nextLevelXp} exp.`}
            </div>
          </div>
        </div>
      </div>
      <div className="p-2 border rounded-md border-gray-200 flex flex-col gap-2">
        {selectedSkill?.tasks.map(task => (
          <div className={cn("flex items-center gap-2 bg-purple-950/30 text-white rounded-md p-2 border-l-4", getRankBorderColor(selectedSkill?.rank), getRankTaskBgColor(selectedSkill?.rank))}>
            <Checkbox />
            <span className="text-sm">{task.title}</span>
            <div className="ml-auto flex gap-1">
              <Pencil className="w-4 h-4" />
              <Trash className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default TasksTable;
