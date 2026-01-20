export type Rank = "S" | "A" | "B" | "C";

export type Skill = {
  id: number;
  skillName: string;
  description: string;
  rank: Rank;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  goals: {
    id: number;
    goalName: string;
    isCompleted: boolean;
  }[];
};
