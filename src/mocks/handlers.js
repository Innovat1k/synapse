// Mock Supabase REST API responses for integration and UI tests using MSW.
// Uses a mutable in-memory store for activities to simulate CRUD operations.

import { http, HttpResponse } from "msw";

const SUPABASE_URL = "https://yuvgvsjlwwiobwpyaeff.supabase.co";

let activitiesStore = [
  {
    id: "act-001",
    skill_id: "skill-react",
    activity_type: "learning",
    logged_at: "2025-01-08T18:00:00Z",
    duration_minutes: 150,
    notes: "Completed a React JS module on hooks (useState, useEffect).",
  },
  {
    id: "act-002",
    skill_id: "skill-react",
    activity_type: "project work",
    logged_at: "2025-01-11T14:00:00Z",
    duration_minutes: 210,
    notes: "Developed a small React project: dashboard with components.",
  },
  {
    id: "act-003",
    skill_id: "skill-java",
    activity_type: "learning",
    logged_at: "2025-02-15T10:30:00Z",
    duration_minutes: 90,
    notes: "Studied Java OOP concepts and inheritance.",
  },
];

// Resets the in-memory activity store to its initial state (call in beforeEach)
export const resetStore = () => {
  activitiesStore = [
    {
      id: "act-001",
      skill_id: "skill-react",
      activity_type: "learning",
      logged_at: "2025-01-08T18:00:00Z",
      duration_minutes: 150,
      notes: "Completed a React JS module on hooks (useState, useEffect).",
    },
    {
      id: "act-002",
      skill_id: "skill-react",
      activity_type: "project work",
      logged_at: "2025-01-11T14:00:00Z",
      duration_minutes: 210,
      notes: "Developed a small React project: dashboard with components.",
    },
    {
      id: "act-003",
      skill_id: "skill-java",
      activity_type: "learning",
      logged_at: "2025-02-15T10:30:00Z",
      duration_minutes: 90,
      notes: "Studied Java OOP concepts and inheritance.",
    },
  ];
};

export const handlers = [
  http.get(`${SUPABASE_URL}/rest/v1/synapse_tracks`, ({ request }) => {
    const url = new URL(request.url);
    const order = url.searchParams.get("order");

    const tracks = [
      {
        track_id: "arc-icte",
        title: "arc icte",
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

    if (order?.includes("title")) {
      const asc = order.includes("asc");
      tracks.sort((a, b) =>
        asc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title),
      );
    }

    return HttpResponse.json(tracks);
  }),

  http.get(`${SUPABASE_URL}/rest/v1/synapse_skills`, () => {
    return HttpResponse.json([
      {
        name: "React JS",
        skill_id: "skill-react",
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
        category: "backend",
        level: 1,
        description: "Exploring the fundamentals of Java development.",
        tags: ["programming"],
        track_id: "arc-icte",
      },
      {
        name: "Project Management",
        skill_id: "skill-project-mgmt",
        category: "others",
        level: 3,
        description: "Managing small agile projects and coordinating tasks.",
        tags: ["organization"],
        track_id: "arc-icte",
      },
    ]);
  }),

  http.get(`${SUPABASE_URL}/rest/v1/synapse_activities`, ({ request }) => {
    const url = new URL(request.url);
    let skillId = url.searchParams.get("skill_id");

    if (skillId?.startsWith("eq.")) {
      skillId = skillId.slice(3);
    }

    if (!skillId) {
      return HttpResponse.json(activitiesStore);
    }

    return HttpResponse.json(
      activitiesStore.filter((a) => a.skill_id === skillId),
    );
  }),

  http.get(`${SUPABASE_URL}/rest/v1/synapse_skill_links`, () => {
    return HttpResponse.json([]);
  }),

  http.delete(`${SUPABASE_URL}/rest/v1/synapse_activities`, ({ request }) => {
    const url = new URL(request.url);
    const skillIdParam = url.searchParams.get("skill_id");

    if (skillIdParam?.startsWith("eq.")) {
      const skillId = skillIdParam.slice(3);
      // const beforeCount = activitiesStore.length;

      activitiesStore = activitiesStore.filter((a) => a.skill_id !== skillId);
    }

    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${SUPABASE_URL}/rest/v1/rpc/get_skill_subgraph`, () => {
    return HttpResponse.json({ nodes: [], links: [] });
  }),
];
