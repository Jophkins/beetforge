export type Rank = "S" | "A" | "B" | "C";

export type Skill = {
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
