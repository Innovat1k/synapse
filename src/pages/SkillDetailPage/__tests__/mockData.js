// Reusable mock data for skill and activity tests (used across component/integration tests)

export const MOCK_SKILL_IDS = {
  REACT: "skill-react",
  JAVA: "skill-java",
  PROJECT_MGMT: "skill-project-mgmt",
};

export const mockSkills = [
  {
    name: "React JS",
    skill_id: MOCK_SKILL_IDS.REACT,
    category: "frontend",
    level: 4,
    description:
      "Completed an online React JS course leading to certification.",
    tags: ["programming", "visual"],
    track_id: "react-fundamentals",
  },
  {
    name: "Java",
    skill_id: MOCK_SKILL_IDS.JAVA,
    category: "backend",
    level: 1,
    description: "Exploring the fundamentals of Java development.",
    tags: ["programming"],
    track_id: "computer-science",
  },
  {
    name: "Project Management",
    skill_id: MOCK_SKILL_IDS.PROJECT_MGMT,
    category: "others",
    level: 3,
    description: "Managing small agile projects and coordinating tasks.",
    tags: ["organization"],
    track_id: "computer-science",
  },
];

export const mockActivities = [
  {
    id: "act-001",
    skill_id: MOCK_SKILL_IDS.REACT,
    activity_type: "learning",
    logged_at: "2025-01-08T18:00:00Z",
    duration_minutes: 150,
    notes: "Completed a React JS module on hooks (useState, useEffect).",
  },
  {
    id: "act-002",
    skill_id: MOCK_SKILL_IDS.REACT,
    activity_type: "project work",
    logged_at: "2025-01-11T14:00:00Z",
    duration_minutes: 210,
    notes: "Developed a small React project: dashboard with components.",
  },
  {
    id: "act-003",
    skill_id: MOCK_SKILL_IDS.JAVA,
    activity_type: "learning",
    logged_at: "2025-02-15T10:30:00Z",
    duration_minutes: 90,
    notes: "Studied Java OOP concepts and inheritance.",
  },
];
