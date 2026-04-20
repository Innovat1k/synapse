// Mock Supabase REST API responses for integration and UI tests using MSW.
// Uses mutable in-memory stores for activities, skills, tracks, and skill links
// to simulate realistic CRUD operations and maintain data consistency across tests.

import { http, HttpResponse } from "msw";
import {
  activitiesStore,
  skillLinksStore,
  skillsStore,
  TEST_USER_ID,
  tracksStore,
} from "./stores";

export const SUPABASE_URL = "https://yuvgvsjlwwiobwpyaeff.supabase.co";

// Helper: Extract and normalize user_id from Supabase query params
// Supabase sends: user_id=eq.XXX → we strip "eq." prefix to get the raw UUID
const extractUserId = (url) => {
  const rawUserId = new URL(url).searchParams.get("user_id");
  return rawUserId?.replace(/^eq\./, "") || null;
};

// Helper: Extract and normalize ID from Supabase query params (eq. or in. format)
const extractId = (url, paramName) => {
  const rawValue = new URL(url).searchParams.get(paramName);
  if (!rawValue) {
    return null;
  }
  if (rawValue.startsWith("eq.")) {
    return rawValue.slice(3);
  }
  if (rawValue.startsWith("in.(") && rawValue.endsWith(")")) {
    return rawValue
      .slice(4, -1)
      .split(",")
      .map((id) => id.trim());
  }
  return rawValue;
};

// Generates mock daily activity data for the given number of days
const generateMockDailyData = (days) =>
  Array.from({ length: days }).map((_, i) => ({
    day_date: `2026-04-${String(10 + i).padStart(2, "0")}`,
    day_label: `Apr ${String(10 + i).padStart(2, "0")}`,
    total_minutes: 60,
    activities_count: 1,
  }));

// Generates mock weekly progress data for the given number of weeks
const generateWeeklyData = (weeks) =>
  Array.from({ length: weeks }).map((_, i) => ({
    week_start: `2026-04-${String(1 + i * 7).padStart(2, "0")}`,
    week_label: `Week ${i + 1}`,
    total_minutes: 100,
    activities_count: 2,
  }));

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

  http.delete(`${SUPABASE_URL}/rest/v1/synapse_tracks`, ({ request }) => {
    const trackId =
      extractId(request.url, "track_id") || extractId(request.url, "id");
    const userId = extractUserId(request.url);

    if (trackId) {
      const ids = Array.isArray(trackId) ? trackId : [trackId];
      for (let i = tracksStore.length - 1; i >= 0; i--) {
        if (ids.includes(tracksStore[i].track_id)) {
          tracksStore.splice(i, 1);
        }
      }
      return HttpResponse.json(null, { status: 204 });
    }

    if (userId) {
      for (let i = tracksStore.length - 1; i >= 0; i--) {
        if (tracksStore[i].user_id === userId) {
          tracksStore.splice(i, 1);
        }
      }
      return HttpResponse.json(null, { status: 204 });
    }

    return HttpResponse.json(
      { error: "Valid filter required (track_id or user_id)" },
      { status: 400 },
    );
  }),

  // ============================================
  // SKILLS
  // ============================================

  http.get(`${SUPABASE_URL}/rest/v1/synapse_skills`, ({ request }) => {
    const userId = extractUserId(request.url);
    const skillIds = extractId(request.url, "skill_id");

    let data = skillsStore;

    if (userId) {
      data = data.filter((s) => s.user_id === userId);
    }

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
      user_id: TEST_USER_ID,
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
    const userId = extractUserId(request.url);

    if (skillId) {
      const index = skillsStore.findIndex((s) => s.skill_id === skillId);
      if (index !== -1) {
        skillsStore.splice(index, 1);
      }
      return HttpResponse.json(null, { status: 204 });
    }

    if (userId) {
      for (let i = skillsStore.length - 1; i >= 0; i--) {
        if (skillsStore[i].user_id === userId) {
          skillsStore.splice(i, 1);
        }
      }
      return HttpResponse.json(null, { status: 204 });
    }

    return HttpResponse.json(
      { error: "Valid filter required" },
      { status: 400 },
    );
  }),

  // ============================================
  // ACTIVITIES
  // ============================================

  http.get(`${SUPABASE_URL}/rest/v1/synapse_activities`, ({ request }) => {
    const userId = extractUserId(request.url);
    const skillId = extractId(request.url, "skill_id");

    let data = activitiesStore;
    if (userId) {
      data = data.filter((a) => a.user_id === userId);
    }
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
    const activityId = extractId(request.url, "id");
    const skillId = extractId(request.url, "skill_id");
    const userId = extractUserId(request.url);

    if (activityId) {
      const index = activitiesStore.findIndex((a) => a.id === activityId);
      if (index !== -1) {
        activitiesStore.splice(index, 1);
      }
      return HttpResponse.json(null, { status: 204 });
    }

    if (skillId) {
      const ids = Array.isArray(skillId) ? skillId : [skillId];
      for (let i = activitiesStore.length - 1; i >= 0; i--) {
        if (ids.includes(activitiesStore[i].skill_id)) {
          activitiesStore.splice(i, 1);
        }
      }
      return HttpResponse.json(null, { status: 204 });
    }

    if (userId) {
      for (let i = activitiesStore.length - 1; i >= 0; i--) {
        if (activitiesStore[i].user_id === userId) {
          activitiesStore.splice(i, 1);
        }
      }
      return HttpResponse.json(null, { status: 204 });
    }

    return HttpResponse.json(
      { error: "Valid filter required (id, skill_id, or user_id)" },
      { status: 400 },
    );
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
    if (sourceId) {
      filtered = filtered.filter((l) => l.source_skill_id === sourceId);
    }
    if (targetId) {
      filtered = filtered.filter((l) => l.target_skill_id === targetId);
    }

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
        userActivities.length > 0 ? generateMockDailyData(daysBack) : [];

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
        userActivities.length > 0 ? generateWeeklyData(weeksBack) : [];

      return HttpResponse.json(weeklyData);
    },
  ),
];
