"use client";
import { useEffect, useState } from "react";

import type { NewSkill, Skill } from "@/src/entities/rank/types";

import Character from "@/src/components/character/character";
import Header from "@/src/components/header/header";
import SkillsTable from "@/src/components/skills-table/skills-table";
import TasksTable from "@/src/components/tasks-table/tasks-table";
import { cn } from "@/src/lib/utils";

type ActivePanel = "skills" | "goals";

export default function HomePage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const selectedSkill = skills.find(skill => skill.id === selectedSkillId) ?? null;

  const [loadingGoalIds, setLoadingGoalIds] = useState<Set<string>>(new Set());

  // Mobile tabs state
  const [activePanel, setActivePanel] = useState<ActivePanel>("skills");

  // Handle skill selection with auto-switch to Goals on mobile
  const handleSelectSkill = (skillId: string | null) => {
    if (skillId === selectedSkillId) {
      // Deselecting
      setSelectedSkillId(null);
    }
    else {
      setSelectedSkillId(skillId);
      // Auto-switch to Goals panel when selecting a skill (for mobile UX)
      if (skillId !== null) {
        setActivePanel("goals");
      }
    }
  };

  // Load skills on mount
  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch("/api/skills");
        if (!res.ok) {
          throw new Error("Failed to fetch skills");
        }
        const data = await res.json();
        setSkills(data.skills);
      }
      catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchSkills();
  }, []);

  const addSkill = async (newSkill: NewSkill) => {
    try {
      // 1. Create the skill
      const skillRes = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillName: newSkill.skillName,
          description: newSkill.description,
          rank: newSkill.rank,
        }),
      });

      if (!skillRes.ok) {
        throw new Error("Failed to create skill");
      }

      const { skill: createdSkill } = await skillRes.json();
      const skillId = createdSkill.id;

      // 2. Create goals for the skill
      const createdGoals = [];
      for (const goal of newSkill.goals) {
        const goalRes = await fetch(`/api/skills/${skillId}/goals`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goalName: goal.goalName }),
        });

        if (!goalRes.ok) {
          console.error("Failed to create goal:", goal.goalName);
          continue;
        }

        const { goal: createdGoal } = await goalRes.json();

        // 3. If goal was marked as completed, toggle it
        if (goal.isCompleted) {
          const toggleRes = await fetch(`/api/goals/${createdGoal.id}`, {
            method: "PATCH",
          });
          if (toggleRes.ok) {
            const { goal: toggledGoal } = await toggleRes.json();
            createdGoals.push(toggledGoal);
          }
          else {
            createdGoals.push(createdGoal);
          }
        }
        else {
          createdGoals.push(createdGoal);
        }
      }

      // 4. Add the complete skill with goals to state
      const fullSkill: Skill = {
        id: createdSkill.id,
        skillName: createdSkill.skillName,
        description: createdSkill.description,
        rank: createdSkill.rank,
        level: createdSkill.level,
        currentXp: createdSkill.currentXp,
        nextLevelXp: createdSkill.nextLevelXp,
        goals: createdGoals.map(g => ({
          id: g.id,
          goalName: g.goalName,
          isCompleted: g.isCompleted,
        })),
      };

      setSkills(prev => [...prev, fullSkill]);
    }
    catch (err) {
      console.error("Error adding skill:", err);
    }
  };

  const toggleGoal = async (goalId: string) => {
    setLoadingGoalIds(prev => new Set(prev).add(goalId));

    try {
      const res = await fetch(`/api/goals/${goalId}`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error("Failed to toggle goal");
      }

      const { goal: updatedGoal } = await res.json();

      // Update the goal in the skills state
      setSkills(prev =>
        prev.map(skill => ({
          ...skill,
          goals: skill.goals.map(goal =>
            goal.id === goalId
              ? { ...goal, isCompleted: updatedGoal.isCompleted }
              : goal,
          ),
        })),
      );
    }
    catch (err) {
      console.error("Error toggling goal:", err);
    }
    finally {
      setLoadingGoalIds((prev) => {
        const next = new Set(prev);
        next.delete(goalId);
        return next;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p className="text-red-500">
          Error:
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl border rounded-lg shadow-lg">
        <Header />
        <main className="p-4 sm:p-6">
          {/* Character section - full width on mobile, 2/3 on larger screens */}
          <div className="w-full lg:w-2/3">
            <Character />
          </div>

          {/* Mobile tabs - only visible on small screens */}
          <div className="flex gap-2 mt-6 lg:hidden">
            <button
              type="button"
              onClick={() => setActivePanel("skills")}
              className={cn(
                "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors",
                activePanel === "skills"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80",
              )}
            >
              Skills
            </button>
            <button
              type="button"
              onClick={() => setActivePanel("goals")}
              className={cn(
                "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors",
                activePanel === "goals"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80",
              )}
            >
              Goals
            </button>
          </div>

          {/* Content grid - stacked on mobile (with tabs), side-by-side on lg+ */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Skills panel */}
            <div className={cn(
              "min-w-0",
              activePanel !== "skills" && "hidden lg:block",
            )}
            >
              <SkillsTable
                skills={skills}
                selectedSkillId={selectedSkillId}
                setSelectedSkillId={handleSelectSkill}
                onAddSkill={addSkill}
              />
            </div>

            {/* Goals panel */}
            <div className={cn(
              "min-w-0",
              activePanel !== "goals" && "hidden lg:block",
            )}
            >
              <TasksTable
                selectedSkill={selectedSkill}
                onToggleGoal={toggleGoal}
                loadingGoalIds={loadingGoalIds}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
