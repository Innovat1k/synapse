// @mocks/handlers.js
// Mock Supabase REST API responses for integration and UI tests using MSW.
// Uses mutable in-memory stores for activities, skills, tracks, and skill links
// to simulate realistic CRUD operations and maintain data consistency across tests.

import { http, HttpResponse } from "msw";
import {
  activitiesStore,
  defaultSkills,
  skillLinksStore,
  skillsStore,
  tracksStore,
} from "./stores";

export const SUPABASE_URL = "https://yuvgvsjlwwiobwpyaeff.supabase.co";

// ✅ Helper: Extract and normalize user_id from Supabase query params
// Supabase sends: user_id=eq.XXX → we strip "eq." prefix to get the raw UUID
const extractUserId = (url) => {
  const rawUserId = new URL(url).searchParams.get("user_id");
  return rawUserId?.replace(/^eq\./, "") || null;
};

// ✅ Helper: Extract and normalize ID from Supabase query params (eq. or in. format)
const extractId = (url, paramName) => {
  const rawValue = new URL(url).searchParams.get(paramName);
  if (!rawValue) return null;
  if (rawValue.startsWith("eq.")) return rawValue.slice(3);
  if (rawValue.startsWith("in.(") && rawValue.endsWith(")")) {
    return rawValue
      .slice(4, -1)
      .split(",")
      .map((id) => id.trim());
  }
  return rawValue;
};

export const handlers = [
  // ============================================
  // TRACKS
  // ============================================

  http.get(`${SUPABASE_URL}/rest/v1/synapse_tracks`, ({ request }) => {
    const userId = extractUserId(request.url);
    const data = userId
      ? tracksStore.filter((t) => t.user_id === userId)
      : tracksStore;
    return HttpResponse.json(data);
  }),

  http.post(`${SUPABASE_URL}/rest/v1/synapse_tracks`, async ({ request }) => {
    const newTrack = await request.json();

    if (!newTrack.title) {
      return HttpResponse.json({ error: "Title is required" }, { status: 400 });
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

  // ============================================
  // SKILLS
  // ============================================

  http.get(`${SUPABASE_URL}/rest/v1/synapse_skills`, ({ request }) => {
    const url = new URL(request.url);
    const userId = extractUserId(request.url);
    const skillIds = extractId(request.url, "skill_id");

    let data = skillsStore;

    // Filter by user_id if provided
    if (userId) {
      data = data.filter((s) => s.user_id === userId);
    }

    // Filter by skill_id(s) if provided (for enrichment queries)
    if (skillIds) {
      const ids = Array.isArray(skillIds) ? skillIds : [skillIds];
      data = data.filter((s) => ids.includes(s.skill_id));
    }

    return HttpResponse.json(data);
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
    const skillId = extractId(request.url, "skill_id");
    if (!skillId) {
      return HttpResponse.json(
        { error: "skill_id filter required" },
        { status: 400 },
      );
    }

    const updates = await request.json();
    const index = skillsStore.findIndex((s) => s.skill_id === skillId);

    if (index === -1) {
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    }

    skillsStore[index] = {
      ...skillsStore[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return HttpResponse.json(skillsStore[index], { status: 200 });
  }),

  http.delete(`${SUPABASE_URL}/rest/v1/synapse_skills`, ({ request }) => {
    const skillId =
      extractId(request.url, "skill_id") || extractId(request.url, "id");
    if (!skillId) {
      return HttpResponse.json(
        { error: "Valid ID filter required" },
        { status: 400 },
      );
    }

    const index = skillsStore.findIndex((s) => s.skill_id === skillId);
    if (index !== -1) {
      skillsStore.splice(index, 1);
    }

    return HttpResponse.json(null, { status: 204 });
  }),

  // ============================================
  // ACTIVITIES
  // ============================================

  http.get(`${SUPABASE_URL}/rest/v1/synapse_activities`, ({ request }) => {
    const userId = extractUserId(request.url);
    const skillId = extractId(request.url, "skill_id");

    let data = activitiesStore;
    if (userId) data = data.filter((a) => a.user_id === userId);
    if (skillId) {
      const ids = Array.isArray(skillId) ? skillId : [skillId];
      data = data.filter((a) => ids.includes(a.skill_id));
    }

    return HttpResponse.json(data);
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
      const activityId = extractId(request.url, "id");
      if (!activityId) {
        return HttpResponse.json(
          { error: "ID filter required" },
          { status: 400 },
        );
      }

      const updates = await request.json();
      const index = activitiesStore.findIndex((a) => a.id === activityId);

      if (index === -1) {
        return HttpResponse.json({ error: "Not found" }, { status: 404 });
      }

      activitiesStore[index] = {
        ...activitiesStore[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      return HttpResponse.json([activitiesStore[index]], { status: 200 });
    },
  ),

  http.delete(`${SUPABASE_URL}/rest/v1/synapse_activities`, ({ request }) => {
    const skillId = extractId(request.url, "skill_id");
    const activityId = extractId(request.url, "id");

    if (skillId) {
      for (let i = activitiesStore.length - 1; i >= 0; i--) {
        if (activitiesStore[i].skill_id === skillId) {
          activitiesStore.splice(i, 1);
        }
      }
      return HttpResponse.json(null, { status: 204 });
    }

    if (activityId) {
      const index = activitiesStore.findIndex((a) => a.id === activityId);
      if (index !== -1) {
        activitiesStore.splice(index, 1);
      }
      return HttpResponse.json(null, { status: 204 });
    }

    return HttpResponse.json({ error: "Filter required" }, { status: 400 });
  }),

  // ============================================
  // SKILL LINKS
  // ============================================

  http.get(`${SUPABASE_URL}/rest/v1/synapse_skill_links`, ({ request }) => {
    const url = new URL(request.url);
    const selectParam = url.searchParams.get("select");
    const sourceId = extractId(request.url, "source_skill_id");
    const targetId = extractId(request.url, "target_skill_id");

    let filtered = skillLinksStore;
    if (sourceId)
      filtered = filtered.filter((l) => l.source_skill_id === sourceId);
    if (targetId)
      filtered = filtered.filter((l) => l.target_skill_id === targetId);

    // Enrich with skill name if requested via select=skill(*)
    if (selectParam?.includes("skill:")) {
      return HttpResponse.json(
        filtered.map((link) => {
          const skillId = selectParam.includes("source_skill_id")
            ? link.source_skill_id
            : link.target_skill_id;
          const skill = skillsStore.find((s) => s.skill_id === skillId);
          return {
            ...link,
            skill: skill ? { name: skill.name } : null,
          };
        }),
      );
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
        return HttpResponse.json(
          { error: "Missing required fields" },
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
    const linkId = extractId(request.url, "id");
    if (!linkId) {
      return HttpResponse.json(
        { error: "ID filter required" },
        { status: 400 },
      );
    }

    const index = skillLinksStore.findIndex((l) => l.id === linkId);
    if (index !== -1) {
      skillLinksStore.splice(index, 1);
    }

    return HttpResponse.json(null, { status: 204 });
  }),

  // ============================================
  // RPC ENDPOINTS
  // ============================================

  http.post(`${SUPABASE_URL}/rest/v1/rpc/get_skill_subgraph`, () => {
    return HttpResponse.json({ nodes: [], links: [] });
  }),

  http.post(
    `${SUPABASE_URL}/rest/v1/rpc/get_current_focus`,
    async ({ request }) => {
      const { p_user_id: userId } = await request.json();
      const userSkills = skillsStore.filter((s) => s.user_id === userId);

      if (userSkills.length === 0) {
        return HttpResponse.json([]);
      }

      return HttpResponse.json([
        {
          skill_id: userSkills[0].skill_id,
          skill_name: userSkills[0].name,
          skill_level: userSkills[0].level || 1,
          total_minutes: 180,
          activities_count: 5,
          track_title: userSkills[0].track_id || "No Track",
        },
      ]);
    },
  ),

  http.post(
    `${SUPABASE_URL}/rest/v1/rpc/get_key_metrics`,
    async ({ request }) => {
      const { p_user_id: userId } = await request.json();
      const userActivities = activitiesStore.filter(
        (a) => a.user_id === userId,
      );
      const totalMinutes = userActivities.reduce(
        (sum, a) => sum + (a.duration_minutes || 0),
        0,
      );

      return HttpResponse.json([
        {
          hours_this_week: Math.round((totalMinutes / 60) * 10) / 10,
          skills_practiced: new Set(userActivities.map((a) => a.skill_id)).size,
          total_sessions: userActivities.length,
          total_minutes_this_week: totalMinutes,
          most_practiced_skill: userActivities[0]?.skill_id
            ? skillsStore.find((s) => s.skill_id === userActivities[0].skill_id)
                ?.name || "Unknown"
            : null,
        },
      ]);
    },
  ),

  http.post(
    `${SUPABASE_URL}/rest/v1/rpc/get_daily_activity`,
    async ({ request }) => {
      const { p_user_id: userId, p_days_back: daysBack = 7 } =
        await request.json();
      const userActivities = activitiesStore.filter(
        (a) => a.user_id === userId,
      );

      const dailyData =
        userActivities.length > 0
          ? [
              {
                day_date: "2026-04-09",
                day_label: "Apr 09",
                total_minutes: 60,
                activities_count: 1,
              },
              {
                day_date: "2026-04-10",
                day_label: "Apr 10",
                total_minutes: 90,
                activities_count: 2,
              },
            ]
          : [];

      return HttpResponse.json(dailyData);
    },
  ),

  http.post(
    `${SUPABASE_URL}/rest/v1/rpc/get_weekly_progress`,
    async ({ request }) => {
      const {
        p_user_id: userId,
        p_weeks_back: weeksBack = 8,
        p_track_id: trackId,
        p_skill_id: skillId,
      } = await request.json();

      let userActivities = activitiesStore.filter((a) => a.user_id === userId);
      if (trackId && trackId !== "all") {
        userActivities = userActivities.filter((a) => a.track_id === trackId);
      }
      if (skillId) {
        userActivities = userActivities.filter((a) => a.skill_id === skillId);
      }

      const weeklyData =
        userActivities.length > 0
          ? [
              {
                week_start: "2026-03-24",
                week_label: "Mar 24",
                total_minutes: 120,
                activities_count: 2,
              },
              {
                week_start: "2026-03-31",
                week_label: "Mar 31",
                total_minutes: 90,
                activities_count: 1,
              },
              {
                week_start: "2026-04-07",
                week_label: "Apr 07",
                total_minutes: 150,
                activities_count: 3,
              },
            ]
          : [];

      return HttpResponse.json(weeklyData);
    },
  ),
];
