import { Loader2, Pencil, Trash } from "lucide-react";

import type { Skill } from "@/src/entities/rank/types";

import { Checkbox } from "@/src/components/ui/checkbox";
import { getRankBgColor, getRankBorderColor, getRankTaskBgColor } from "@/src/entities/rank/ui/get-rank-color";
import { cn } from "@/src/lib/utils";

function TasksTable({ selectedSkill, onToggleGoal, loadingGoalIds }: { selectedSkill: Skill | null; onToggleGoal: (goalId: string) => void; loadingGoalIds: Set<string> }) {
  if (!selectedSkill) {
    return (
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-border pb-2">
          <h2 className="text-base sm:text-lg font-semibold">
            Goals
          </h2>
        </div>
        <div className="p-4 text-center text-muted-foreground text-sm">
          Select a skill to view its goals
        </div>
      </div>
    );
  }

  const xpProgress = selectedSkill.nextLevelXp > 0
    ? (selectedSkill.currentXp / selectedSkill.nextLevelXp) * 100
    : 0;

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
        <h2 className="text-base sm:text-lg font-semibold min-w-0 truncate">
          Goals:
          {" "}
          <span className="font-normal">{selectedSkill.skillName}</span>
        </h2>
        <span className={cn("shrink-0 font-medium inline-flex items-center justify-center w-10 sm:w-12 h-6 text-white text-xs sm:text-sm rounded-2xl", getRankBgColor(selectedSkill.rank))}>{selectedSkill.rank}</span>
      </div>
      <div className="p-2">
        <p className="text-xs sm:text-sm text-muted-foreground wrap-break-word">
          <span className="font-medium text-foreground">Goal: </span>
          {selectedSkill.description ?? "No description"}
        </p>
        <div className="flex items-center mt-3 gap-2 sm:gap-3">
          <span className="shrink-0 text-sm font-medium">
            Lvl
            {" "}
            {selectedSkill.level}
          </span>
          <div className="relative h-5 sm:h-6 bg-muted rounded-full overflow-hidden flex-1 min-w-0">
            <div
              className="absolute inset-0 bg-yellow-400 rounded-full"
              style={{ width: `${xpProgress}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-medium text-foreground">
              {`${selectedSkill.currentXp}/${selectedSkill.nextLevelXp} xp`}
            </div>
          </div>
        </div>
      </div>
      <div className="p-2 border rounded-md border-border flex flex-col gap-2">
        {selectedSkill.goals.length === 0
          ? (
              <div className="text-center text-muted-foreground text-sm py-2">
                No goals yet
              </div>
            )
          : (
              selectedSkill.goals.map((goal) => {
                const isLoading = loadingGoalIds.has(goal.id);
                return (
                  <div key={goal.id} className={cn("flex items-start gap-2 text-white rounded-md p-2 border-l-4", getRankBorderColor(selectedSkill.rank), getRankTaskBgColor(selectedSkill.rank))}>
                    <div className="shrink-0 mt-0.5">
                      {isLoading
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Checkbox checked={goal.isCompleted} onCheckedChange={() => onToggleGoal(goal.id)} />}
                    </div>
                    <span className="text-xs sm:text-sm min-w-0 wrap-break-word flex-1">{goal.goalName}</span>
                    <div className="shrink-0 flex gap-1">
                      <Pencil className="w-4 h-4" />
                      <Trash className="w-4 h-4" />
                    </div>
                  </div>
                );
              })
            )}
      </div>
    </div>
  );
}

export default TasksTable;
