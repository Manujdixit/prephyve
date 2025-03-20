"use client";

import { useState } from "react";
import { Card } from "./ui/card";
import Spline from "@splinetool/react-spline";
import SplinePet from "./spline-pet";

type PetState = "happy" | "neutral" | "hungry";
type PetLevel = 1 | 2 | 3;

interface PetStats {
  level: PetLevel;
  experience: number;
  state: PetState;
}

export function VirtualPet() {
  const [stats, setStats] = useState<PetStats>({
    level: 1,
    experience: 0,
    state: "neutral",
  });

  const getExperienceForNextLevel = (currentLevel: PetLevel) => {
    return currentLevel * 100;
  };

  const addExperience = (amount: number) => {
    setStats((prev) => {
      const newExperience = prev.experience + amount;
      const experienceNeeded = getExperienceForNextLevel(prev.level);

      if (newExperience >= experienceNeeded && prev.level < 3) {
        return {
          ...prev,
          level: (prev.level + 1) as PetLevel,
          experience: newExperience - experienceNeeded,
          state: "happy",
        };
      }

      return {
        ...prev,
        experience: newExperience,
        state: "happy",
      };
    });
  };

  const getPetAppearance = () => {
    const baseStyle = "w-80 h-80 flex items-center justify-center text-4xl";

    // Using Spline model instead of emojis
    return (
      <div className={baseStyle}>
        <Spline scene="https://prod.spline.design/pqm9UtY4qH61PPUR/scene.splinecode" />{" "}
      </div>
    );

    /* Original emoji-based appearance
    switch (stats.level) {
      case 1:
        return <div className={baseStyle}>🥚</div>;
      case 2:
        return <div className={baseStyle}>🐣</div>;
      case 3:
        return <div className={baseStyle}>🐥</div>;
    }
    */
  };

  return (
    <Card className="p-4 w-fit">
      <div className="flex flex-col items-center gap-4">
        {getPetAppearance()}
        <div className="text-sm text-center">
          <div>Level {stats.level}</div>
          <div>
            XP: {stats.experience}/{getExperienceForNextLevel(stats.level)}
          </div>
          <div>Status: {stats.state}</div>
        </div>
        <button
          onClick={() => addExperience(20)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Complete Task (+20 XP)
        </button>
      </div>
    </Card>
  );
}
