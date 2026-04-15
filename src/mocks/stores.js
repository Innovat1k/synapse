// Mutable in-memory stores for integration tests with reset/seed utilities

// Unique mock user ID for all tests
const TEST_USER_ID = "025af00a-1837-44e0-b03d-6150e1da4611";

export const defaultSkills = [
  {
    name: "React JS",
    skill_id: "skill-react",
    user_id: TEST_USER_ID,
    category: "frontend",
    level: 4,
    description:
      "Completed an online React JS course leading to certification.",
    tags: ["programming", "visual"],
    track_id: "react-fundamentals",
  },
  {
    name: "Java",
    skill_id: "skill-java",
    user_id: TEST_USER_ID,
    category: "backend",
    level: 1,
    description: "Exploring the fundamentals of Java development.",
    tags: ["programming"],
    track_id: "computer-science",
  },
  {
    name: "Project Management",
    skill_id: "skill-project-mgmt",
    user_id: TEST_USER_ID,
    category: "other",
    level: 3,
    description: "Managing small agile projects and coordinating tasks.",
    tags: ["organization"],
    track_id: "computer-science",
  },
];

export const defaultActivities = [
  {
    id: "act-001",
    skill_id: "skill-react",
    user_id: TEST_USER_ID,
    activity_type: "learning",
    logged_at: "2025-01-08T18:00:00Z",
    duration_minutes: 150,
    notes: "Completed a React JS module on hooks (useState, useEffect).",
  },
  {
    id: "act-002",
    skill_id: "skill-react",
    user_id: TEST_USER_ID,
    activity_type: "project work",
    logged_at: "2025-01-11T14:00:00Z",
    duration_minutes: 210,
    notes: "Developed a small React project: dashboard with components.",
  },
  {
    id: "act-003",
    skill_id: "skill-java",
    user_id: TEST_USER_ID,
    activity_type: "learning",
    logged_at: "2025-02-15T10:30:00Z",
    duration_minutes: 90,
    notes: "Studied Java OOP concepts and inheritance.",
  },
];

export const defaultTracks = [
  {
    track_id: "computer-science",
    title: "Computer Science",
    description: null,
    category: "other",
    is_visible: true,
    sort_order: 0,
    created_at: "2026-02-27T12:10:35.256058+00:00",
    updated_at: "2026-02-27T12:10:35.256058+00:00",
  },
  {
    track_id: "react-fundamentals",
    title: "React Fundamentals",
    description: "Learn React from scratch",
    category: "frontend",
    is_visible: true,
    sort_order: 1,
    created_at: "2026-02-27T10:00:00.000000+00:00",
    updated_at: "2026-02-27T10:00:00.000000+00:00",
  },
];

export const defaultSkillLinks = [
  {
    id: "link-project-mgmt-support",
    source_skill_id: "skill-project-mgmt",
    target_skill_id: "skill-react",
    type: "support",
    skill_name: "Project Management",
  },
  {
    id: "link-react-prereq",
    source_skill_id: "skill-react",
    target_skill_id: "skill-java",
    type: "prerequisite",
    skill_name: "React JS",
  },
];

// Mutables stores
export let skillsStore = [...defaultSkills];
export let activitiesStore = [...defaultActivities];
export let tracksStore = [...defaultTracks];
export let skillLinksStore = [...defaultSkillLinks];

// Resets
export const resetSkills = () => {
  skillsStore.length = 0;
  skillsStore.push(...defaultSkills);
};

export const resetActivities = () => {
  activitiesStore.length = 0;
  activitiesStore.push(...defaultActivities);
};

export const resetTracks = () => {
  tracksStore.length = 0;
  tracksStore.push(...defaultTracks);
};

export const resetSkillLinksStore = () => {
  skillLinksStore.length = 0;
  skillLinksStore.push(...defaultSkillLinks);
};

// Resets all stores to default state (call in beforeEach for clean tests)
export const resetAllStores = () => {
  resetSkills();
  resetActivities();
  resetTracks();
  resetSkillLinksStore();
};

export const clearSkills = () => {
  skillsStore.length = 0;
};
export const clearActivities = () => {
  activitiesStore.length = 0;
};
export const clearTracks = () => {
  tracksStore.length = 0;
};
export const clearSkillLinks = () => {
  skillLinksStore.length = 0;
};

export const clearAllStores = () => {
  clearSkills();
  clearActivities();
};
// Seeds
export const seedSkills = (data) => {
  skillsStore.length = 0;
  skillsStore.push(...data);
};

export const seedActivities = (data) => {
  activitiesStore.length = 0;
  activitiesStore.push(...data);
};

export const seedTracks = (data) => {
  tracksStore.length = 0;
  tracksStore.push(...data);
};

export const seedSkillLinks = (data) => {
  skillLinksStore.length = 0;
  skillLinksStore.push(...data);
};
