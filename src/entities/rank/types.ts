export type Rank = "S" | "A" | "B" | "C";

export type Goal = {
  id: string;
  goalName: string;
  isCompleted: boolean;
};

export type Skill = {
  id: string;
  skillName: string;
  description: string | null;
  rank: Rank;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  goals: Goal[];
};

/** DTO for creating a new skill (no id, goals without id) */
export type NewGoal = {
  goalName: string;
  isCompleted: boolean;
};

export type NewSkill = {
  skillName: string;
  description: string;
  rank: Rank;
  goals: NewGoal[];
};
