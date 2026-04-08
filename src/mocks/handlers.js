// Mock Supabase REST API responses for integration and UI tests using MSW.
// Uses a mutable in-memory store for activities, skills, tracks, and skill links
// to simulate realistic CRUD operations and maintain data consistency across tests.

import { http, HttpResponse } from "msw";
import {
  activitiesStore,
  skillLinksStore,
  skillsStore,
  tracksStore,
} from "./stores";

export const SUPABASE_URL = "https://yuvgvsjlwwiobwpyaeff.supabase.co";

export const handlers = [
  // TRACKS
  http.get(`${SUPABASE_URL}/rest/v1/synapse_tracks`, ({ request }) => {
    const url = new URL(request.url);
    const order = url.searchParams.get("order");

    if (order?.includes("title")) {
      const asc = order.includes("asc");
      tracksStore.sort((a, b) =>
        asc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title),
      );
    }

    return HttpResponse.json(tracksStore);
  }),

  http.post(`${SUPABASE_URL}/rest/v1/synapse_tracks`, async ({ request }) => {
    const newTrack = await request.json();

    if (!newTrack.title) {
      return new HttpResponse(JSON.stringify({ error: "Title is required" }), {
        status: 400,
      });
    }

    const trackWithId = {
      ...newTrack,
      track_id: newTrack.track_id || `track-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    tracksStore.push(trackWithId);

    return HttpResponse.json(trackWithId, { status: 201 });
  }),

  // SKILLS
  http.get(`${SUPABASE_URL}/rest/v1/synapse_skills`, () => {
    return HttpResponse.json(skillsStore);
  }),

  http.post(`${SUPABASE_URL}/rest/v1/synapse_skills`, async ({ request }) => {
    const newSkill = await request.json();
    const skillWithId = {
      ...newSkill,
      skill_id: newSkill.skill_id || `skill-${Date.now()}`,
    };
    skillsStore.push(skillWithId);
    return HttpResponse.json(skillWithId, { status: 201 });
  }),

  http.patch(`${SUPABASE_URL}/rest/v1/synapse_skills`, async ({ request }) => {
    const url = new URL(request.url);
    const idParam = url.searchParams.get("skill_id");

    if (!idParam?.startsWith("eq.")) {
      return new HttpResponse(
        JSON.stringify({ error: "skill_id filter required" }),
        { status: 400 },
      );
    }

    const skillId = idParam.slice(3);
    const updates = await request.json();

    const index = skillsStore.findIndex((skill) => skill.skill_id === skillId);

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    skillsStore[index] = {
      ...skillsStore[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return HttpResponse.json(skillsStore[index], { status: 200 });
  }),

  http.delete(`${SUPABASE_URL}/rest/v1/synapse_skills`, ({ request }) => {
    const url = new URL(request.url);
    const skillIdParam = url.searchParams.get("skill_id");
    const idParam = url.searchParams.get("id");

    let skillId;
    if (skillIdParam?.startsWith("eq.")) {
      skillId = skillIdParam.slice(3);
    } else if (idParam?.startsWith("eq.")) {
      skillId = idParam.slice(3);
    }

    if (!skillId) {
      return new HttpResponse(
        JSON.stringify({ error: "Valid ID filter required" }),
        { status: 400 },
      );
    }

    const index = skillsStore.findIndex((skill) => skill.skill_id === skillId);
    if (index !== -1) {
      skillsStore.splice(index, 1);
    }

    return new HttpResponse(null, { status: 204 });
  }),

  // ACTIVITIES
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

  http.post(
    `${SUPABASE_URL}/rest/v1/synapse_activities`,
    async ({ request }) => {
      const newActivity = await request.json();

      const activityWithId = {
        ...newActivity,
        id: newActivity.id || `activity-${Date.now()}`,
      };
      activitiesStore.push(activityWithId);
      return HttpResponse.json(activityWithId, { status: 201 });
    },
  ),

  http.patch(
    `${SUPABASE_URL}/rest/v1/synapse_activities`,
    async ({ request }) => {
      const url = new URL(request.url);

      const rawId = url.searchParams.get("id");

      if (!rawId) {
        return HttpResponse.json(
          { error: "ID filter required" },
          { status: 400 },
        );
      }

      const activityId = rawId.replace(/^eq\./, "").replace(/^"|"$/g, "");

      const updates = await request.json();

      const index = activitiesStore.findIndex((a) => a.id === activityId);

      if (index === -1) {
        return HttpResponse.json({ error: "Not found" }, { status: 404 });
      }

      const updatedActivity = {
        ...activitiesStore[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      activitiesStore[index] = updatedActivity;

      return HttpResponse.json([updatedActivity], { status: 200 });
    },
  ),

  http.delete(`${SUPABASE_URL}/rest/v1/synapse_activities`, ({ request }) => {
    const url = new URL(request.url);

    const skillIdParam = url.searchParams.get("skill_id");
    const idParam = url.searchParams.get("id");

    if (skillIdParam?.startsWith("eq.")) {
      const skillId = skillIdParam.slice(3);

      for (let i = activitiesStore.length - 1; i >= 0; i--) {
        if (activitiesStore[i].skill_id === skillId) {
          activitiesStore.splice(i, 1);
        }
      }

      return new HttpResponse(null, { status: 204 });
    }

    if (idParam?.startsWith("eq.")) {
      const id = idParam.slice(3);
      const index = activitiesStore.findIndex((a) => a.id === id);

      if (index !== -1) {
        activitiesStore.splice(index, 1);
      }

      return new HttpResponse(null, { status: 204 });
    }

    return new HttpResponse(JSON.stringify({ error: "Filter required" }), {
      status: 400,
    });
  }),

  // SKILL LINKS
  http.get(`${SUPABASE_URL}/rest/v1/synapse_skill_links`, ({ request }) => {
    const url = new URL(request.url);
    const selectParam = url.searchParams.get("select");
    const sourceId = url.searchParams.get("source_skill_id");
    const targetId = url.searchParams.get("target_skill_id");

    let filtered = skillLinksStore;

    if (sourceId?.startsWith("eq.")) {
      const id = sourceId.slice(3);
      filtered = filtered.filter((link) => link.source_skill_id === id);
    }

    if (targetId?.startsWith("eq.")) {
      const id = targetId.slice(3);
      filtered = filtered.filter((link) => link.target_skill_id === id);
    }

    if (selectParam?.includes("skill:")) {
      const enriched = filtered.map((link) => {
        let skillId;

        if (selectParam.includes("source_skill_id")) {
          skillId = link.source_skill_id;
        } else if (selectParam.includes("target_skill_id")) {
          skillId = link.target_skill_id;
        }

        const skill = skillsStore.find((s) => s.skill_id === skillId);
        return {
          ...link,
          skill: skill ? { name: skill.name } : null,
        };
      });
      return HttpResponse.json(enriched);
    }

    return HttpResponse.json(filtered);
  }),

  http.post(
    `${SUPABASE_URL}/rest/v1/synapse_skill_links`,

    async ({ request }) => {
      const newLink = await request.json();

      if (
        !newLink.source_skill_id ||
        !newLink.target_skill_id ||
        !newLink.type
      ) {
        return new HttpResponse(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400 },
        );
      }

      const linkWithId = {
        id: `link-${Date.now()}`,
        ...newLink,
        created_at: new Date().toISOString(),
      };

      skillLinksStore.push(linkWithId);
      return HttpResponse.json(linkWithId, { status: 201 });
    },
  ),

  http.delete(`${SUPABASE_URL}/rest/v1/synapse_skill_links`, ({ request }) => {
    const url = new URL(request.url);
    const idParam = url.searchParams.get("id");

    if (!idParam?.startsWith("eq.")) {
      return new HttpResponse(JSON.stringify({ error: "ID filter required" }), {
        status: 400,
      });
    }

    const linkId = idParam.slice(3);
    const index = skillLinksStore.findIndex((link) => link.id === linkId);

    if (index === -1) {
      return new HttpResponse(null, { status: 204 });
    }

    skillLinksStore.splice(index, 1);

    return new HttpResponse(null, { status: 204 });
  }),

  // SUBGRAPh
  http.post(`${SUPABASE_URL}/rest/v1/rpc/get_skill_subgraph`, () => {
    return HttpResponse.json({ nodes: [], links: [] });
  }),
];
