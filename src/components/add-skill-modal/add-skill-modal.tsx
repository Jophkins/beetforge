"use client";

import { Check, Plus, X } from "lucide-react";
import { useState } from "react";

import type { Rank, Skill } from "@/src/entities/rank/types";

import SelectRank from "../select-rank/select-rank";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

function AddSkillModal({ onAddSkill }: { onAddSkill: (skill: Omit<Skill, "id" | "level" | "currentXp" | "nextLevelXp">) => void }) {
  const [open, setOpen] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [description, setDescription] = useState("");
  const [rank, setRank] = useState<Rank | undefined>(undefined);
  const [goals, setGoals] = useState<Array<{ id: number; value: string; checked: boolean }>>([
    { id: 0, value: "", checked: false },
  ]);

  const addGoal = () => {
    setGoals([...goals, { id: Date.now(), value: "", checked: false }]);
  };

  const removeGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const updateGoal = (id: number, value: string) => {
    setGoals(goals.map(goal => (goal.id === id ? { ...goal, value } : goal)));
  };

  const toggleGoalChecked = (id: number) => {
    setGoals(goals.map((goal) => {
      if (goal.id === id && goal.value.trim() !== "") {
        return { ...goal, checked: !goal.checked };
      }
      return goal;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!skillName.trim() || !description.trim() || !rank) {
      return;
    }

    const validGoals = goals
      .filter(goal => goal.value.trim() !== "")
      .map((goal, index) => ({
        id: index + 1,
        goalName: goal.value.trim(),
        isCompleted: goal.checked,
      }));

    if (validGoals.length === 0) {
      return;
    }

    onAddSkill({
      skillName: skillName.trim(),
      description: description.trim(),
      rank,
      goals: validGoals,
    });

    // Reset form
    setSkillName("");
    setDescription("");
    setRank(undefined);
    setGoals([{ id: 0, value: "", checked: false }]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Skill</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
            <DialogDescription>
              Add a new skill to your list. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Skill Name</Label>
              <Input
                id="name-1"
                name="name"
                placeholder="Snowboarding"
                maxLength={20}
                required
                value={skillName}
                onChange={e => setSkillName(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label>Rank</Label>
              <SelectRank value={rank} onValueChange={value => setRank(value)} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="desc-1">Description</Label>
              <Textarea
                id="desc-1"
                name="desc"
                placeholder="Enter skill description"
                rows={4}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                <Label htmlFor="name-2">Goals</Label>
                <Button type="button" variant="outline" size="icon" onClick={addGoal}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {goals.map((goal, index) => (
                <div key={goal.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                  <Input
                    id={`goal-${goal.id}`}
                    name={`goal-${goal.id}`}
                    placeholder={index === 0 ? "Add at least one goal" : "Add your goal"}
                    maxLength={40}
                    value={goal.value}
                    onChange={e => updateGoal(goal.id, e.target.value)}
                    required={index === 0}
                    disabled={goal.checked}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleGoalChecked(goal.id)}
                    disabled={goal.value.trim() === ""}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeGoal(goal.id)}
                    disabled={goals.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save Skill</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddSkillModal;
