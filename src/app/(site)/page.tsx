import type { Rank } from "@/src/entities/rank/types";

import Character from "@/src/components/character/character";
import Header from "@/src/components/header/header";
import SkillsTable from "@/src/components/skills-table/skills-table";
import TasksTable from "@/src/components/tasks-table/tasks-table";

export default function HomePage() {
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

  const skills: Skill[] = [
    {
      id: 1,
      title: "Skating",
      description: "I can skate",
      rank: "S",
      level: 10,
      currentXp: 140,
      nextLevelXp: 900,
      tasks: [
        {
          id: 1,
          title: "Skate 10 times",
          isCompleted: true,
        },
        {
          id: 2,
          title: "Do an ollie",
          isCompleted: false,
        },
        {
          id: 3,
          title: "Land a kickflip",
          isCompleted: false,
        },
      ],
    },
    {
      id: 2,
      title: "Coding",
      description: "I can code",
      rank: "A",
      level: 17,
      currentXp: 775,
      nextLevelXp: 4400,
      tasks: [
        {
          id: 1,
          title: "Code a website",
          isCompleted: false,
        },
        {
          id: 2,
          title: "Code a mobile app",
          isCompleted: false,
        },
      ],
    },
    {
      id: 3,
      title: "Snowboarding",
      description: "I can snowboard",
      rank: "C",
      level: 12,
      currentXp: 310,
      nextLevelXp: 1800,
      tasks: [
        {
          id: 1,
          title: "Snowboard 10 times",
          isCompleted: false,
        },
        {
          id: 2,
          title: "Land a 360",
          isCompleted: false,
        },
      ],
    },
    {
      id: 4,
      title: "Piano",
      description: "I can play piano",
      rank: "B",
      level: 14,
      currentXp: 520,
      nextLevelXp: 2900,
      tasks: [
        {
          id: 1,
          title: "Play a song",
          isCompleted: false,
        },
        {
          id: 2,
          title: "Play a song by Beethoven",
          isCompleted: true,
        },
      ],
    },
  ];

  return (
    <div className="flex items-center justify-center h-screen p-4">
      <div className="w-11/12 max-w-7xl border rounded-lg shadow-lg">
        <Header />
        <main className="p-4">
          <div className="w-2/3">
            <Character />
          </div>
          <div className="flex gap-4">
            <div className="w-2/4 mt-8">
              <SkillsTable skills={skills} />
            </div>
            <div className="w-2/4 mt-8">
              <TasksTable skills={skills} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
