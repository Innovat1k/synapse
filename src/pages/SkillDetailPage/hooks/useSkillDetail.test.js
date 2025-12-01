import { act, renderHook } from "@testing-library/react";
import { describe, expect } from "vitest";
import { useSkillDetail } from "./useSkillDetail";

const mockSkills = [
  {
    name: "React JS",
    skill_id: "550e8400-e29b-41d4-a716-446655440001",
    category: "frontend",
    level: 4,
    description:
      "Completed an online React JS course leading to certification.",
    tags: ["programming", "visual"],
  },
  {
    name: "Project Management",
    skill_id: "123e4567-e89b-12d3-a456-426614174000",
    category: "others",
    level: 3,
    description: "Managing small agile projects and coordinating tasks.",
    tags: ["organization"],
  },
];

describe("useSkillDetail", () => {
  it("returns the skill corresponding to the ID in useParams", () => {
    const { result } = renderHook(() =>
      useSkillDetail("123e4567-e89b-12d3-a456-426614174000", mockSkills)
    );

    expect(result.current.skill).toEqual(mockSkills[1]);
  });

  it("toggles the isOpened state when called", () => {
    const { result } = renderHook(() =>
      useSkillDetail("123e4567-e89b-12d3-a456-426614174000", mockSkills)
    );

    act(() => {
      result.current.actionsMenu.handleToggle();
    });

    expect(result.current.actionsMenu.isOpened).toBe(true);
  });
});
