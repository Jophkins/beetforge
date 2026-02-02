import { Loader2, Pencil, Trash } from "lucide-react";

import type { Skill } from "@/src/entities/rank/types";

import { Checkbox } from "@/src/components/ui/checkbox";
import { getRankBgColor, getRankBorderColor, getRankTaskBgColor } from "@/src/entities/rank/ui/get-rank-color";
import { cn } from "@/src/lib/utils";

function TasksTable({ selectedSkill, onToggleGoal, loadingGoalIds }: { selectedSkill: Skill | null; onToggleGoal: (goalId: string) => void; loadingGoalIds: Set<string> }) {
  if (!selectedSkill) {
    return (
      <>
        <div className="flex items-center justify-between border-b border-gray-600 pb-2">
          <h2 className="text-lg font-semibold">
            Goals for: Select a skill on the left
          </h2>
        </div>
        <div className="p-4 text-center text-muted-foreground">
          Select a skill to view its goals
        </div>
      </>
    );
  }

  const xpProgress = selectedSkill.nextLevelXp > 0
    ? (selectedSkill.currentXp / selectedSkill.nextLevelXp) * 100
    : 0;

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-600 pb-2">
        <h2 className="text-lg font-semibold">
          Goals for:
          {" "}
          {selectedSkill.skillName}
        </h2>
        <span className={cn("mt-0.5 font-medium inline-flex items-center justify-center w-12 h-6 bg-purple-700/0 text-white rounded-2xl", getRankBgColor(selectedSkill.rank))}>{selectedSkill.rank}</span>
      </div>
      <div className="p-2">
        <h2 className="text-sm">
          What I want to achieve:
          {" "}
          {selectedSkill.description ?? "No description"}
        </h2>
        <div className="flex items-center m-2">
          <span className="mr-3">
            Lvl:
            {" "}
            {selectedSkill.level}
          </span>
          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden flex-1 min-w-0">
            <div
              className="absolute inset-0 bg-yellow-300 rounded-full"
              style={{ width: `${xpProgress}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-800">
              {`${selectedSkill.currentXp}/${selectedSkill.nextLevelXp} exp.`}
            </div>
          </div>
        </div>
      </div>
      <div className="p-2 border rounded-md border-gray-200 flex flex-col gap-2">
        {selectedSkill.goals.map((goal) => {
          const isLoading = loadingGoalIds.has(goal.id);
          return (
            <div key={goal.id} className={cn("flex items-center gap-2 bg-purple-950/30 text-white rounded-md p-2 border-l-4", getRankBorderColor(selectedSkill.rank), getRankTaskBgColor(selectedSkill.rank))}>
              {isLoading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Checkbox checked={goal.isCompleted} onCheckedChange={() => onToggleGoal(goal.id)} />}
              <span className="text-sm">{goal.goalName}</span>
              <div className="ml-auto flex gap-1">
                <Pencil className="w-4 h-4" />
                <Trash className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default TasksTable;
