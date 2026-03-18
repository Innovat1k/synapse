import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SkillsGrid } from "./SkillsGrid";

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

const mockSkills = [
  {
    skill_id: "skill-1",
    name: "React JS",
    level: 4,
    category: "frontend",
    tags: ["ui", "library", "framework"],
  },
  {
    skill_id: "skill-2",
    name: "Supabase",
    level: 3,
    category: "backend",
    tags: ["auth", "database"],
  },
];

describe("SkillsGrid", () => {
  it("shows empty state when no skills", () => {
    render(<SkillsGrid skills={[]} />);

    expect(screen.getByText(/No skills found/i)).toBeInTheDocument();
    expect(screen.getByText(/Add your first skill/i)).toBeInTheDocument();
  });

  it("renders skills with correct data", () => {
    render(<SkillsGrid skills={mockSkills} />);

    expect(screen.getByText("React JS")).toBeInTheDocument();
    expect(screen.getByText("Level 4")).toBeInTheDocument();
    expect(screen.getByText("frontend")).toBeInTheDocument();
    expect(screen.getByText("ui")).toBeInTheDocument();
    expect(screen.getByText("library")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();

    expect(screen.getByText("Supabase")).toBeInTheDocument();
    expect(screen.getByText("Level 3")).toBeInTheDocument();
    expect(screen.getByText("backend")).toBeInTheDocument();
    expect(screen.getByText("auth")).toBeInTheDocument();
    expect(screen.getByText("database")).toBeInTheDocument();
    expect(screen.queryByText("+")).not.toBeInTheDocument();
  });

  it("renders links to skill detail pages", () => {
    render(<SkillsGrid skills={mockSkills} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/skills/skill-1");
    expect(links[1]).toHaveAttribute("href", "/skills/skill-2");
  });
});