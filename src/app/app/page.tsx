"use client";
import { useState } from "react";

import type { Skill } from "@/src/entities/rank/types";

import Character from "@/src/components/character/character";
import Header from "@/src/components/header/header";
import SkillsTable from "@/src/components/skills-table/skills-table";
import TasksTable from "@/src/components/tasks-table/tasks-table";

export default function HomePage() {
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: 1,
      skillName: "Skating",
      description: "I can skate",
      rank: "S",
      level: 10,
      currentXp: 140,
      nextLevelXp: 900,
      goals: [
        {
          id: 1,
          goalName: "Skate 10 times",
          isCompleted: true,
        },
        {
          id: 2,
          goalName: "Do an ollie",
          isCompleted: false,
        },
        {
          id: 3,
          goalName: "Land a kickflip",
          isCompleted: false,
        },
      ],
    },
    {
      id: 2,
      skillName: "Coding",
      description: "I can code",
      rank: "A",
      level: 17,
      currentXp: 775,
      nextLevelXp: 4400,
      goals: [
        {
          id: 1,
          goalName: "Code a website",
          isCompleted: false,
        },
        {
          id: 2,
          goalName: "Code a mobile app",
          isCompleted: false,
        },
      ],
    },
    {
      id: 3,
      skillName: "Snowboarding",
      description: "I can snowboard",
      rank: "C",
      level: 12,
      currentXp: 310,
      nextLevelXp: 1800,
      goals: [
        {
          id: 1,
          goalName: "Snowboard 10 times",
          isCompleted: false,
        },
        {
          id: 2,
          goalName: "Land a 360",
          isCompleted: false,
        },
      ],
    },
    {
      id: 4,
      skillName: "Piano",
      description: "I can play piano",
      rank: "B",
      level: 14,
      currentXp: 2200,
      nextLevelXp: 2900,
      goals: [
        {
          id: 1,
          goalName: "Play a song",
          isCompleted: false,
        },
        {
          id: 2,
          goalName: "Play a song by Beethoven",
          isCompleted: true,
        },
      ],
    },
  ]);

  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
  const selectedSkill = skills.find(skill => skill.id === selectedSkillId);

  const addSkill = (newSkill: Omit<Skill, "id" | "level" | "currentXp" | "nextLevelXp">) => {
    const skill: Skill = {
      ...newSkill,
      id: skills.length > 0 ? Math.max(...skills.map(s => s.id), 0) + 1 : 1,
      level: 1,
      currentXp: 0,
      nextLevelXp: 100,
    };
    setSkills([...skills, skill]);
  };

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
              <SkillsTable skills={skills} selectedSkillId={selectedSkillId} setSelectedSkillId={setSelectedSkillId} onAddSkill={addSkill} />
            </div>
            <div className="w-2/4 mt-8">
              <TasksTable selectedSkill={selectedSkill ?? (undefined as unknown as Skill)} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
