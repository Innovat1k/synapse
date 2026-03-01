import { http, HttpResponse } from "msw";

const SUPABASE_URL = "https://yuvgvsjlwwiobwpyaeff.supabase.co";

export const handlers = [
  // GET /rest/v1/synapse_tracks
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

    // Tri si demandé (comme Supabase)
    if (order?.includes("title")) {
      const asc = order.includes("asc");
      tracks.sort((a, b) =>
        asc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title),
      );
    }

    return HttpResponse.json(tracks);
  }),

  // POST /rest/v1/synapse_tracks
  // POST - retourne objet seul (pas tableau)
  http.post(`${SUPABASE_URL}/rest/v1/synapse_tracks`, async ({ request }) => {
    const body = await request.json();

    if (!body.track_id || !body.title) {
      return HttpResponse.json(
        {
          code: "23502",
          message:
            'null value in column "track_id" violates not-null constraint',
        },
        { status: 400 },
      );
    }

    // Erreur 23505 si doublon
    if (body.track_id === "arc-icte") {
      // Simule conflit
      return HttpResponse.json(
        {
          code: "23505",
          details: "Key (track_id)=(arc-icte) already exists.",
          message:
            'duplicate key value violates unique constraint "synapse_tracks_pkey"',
        },
        { status: 409 },
      );
    }

    const newTrack = {
      track_id: body.track_id,
      title: body.title,
      description: body.description || null,
      category: body.category || "other",
      is_visible: body.is_visible ?? true,
      sort_order: body.sort_order ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return HttpResponse.json(newTrack, { status: 201 }); // ← Objet seul
  }),
];
