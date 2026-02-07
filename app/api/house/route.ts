import { NextResponse } from 'next/server';

const MANEMUS_URL = process.env.MANEMUS_URL || 'http://localhost:8765';

let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 5_000; // 5s cache for near-real-time

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    // Primary: rich endpoint with full state
    const res = await fetch(`${MANEMUS_URL}/api/house`, {
      next: { revalidate: 5 },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    cache = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch {
    // Fallback: metaphor endpoint, map to expected schema
    try {
      const res = await fetch(`${MANEMUS_URL}/house/state`, {
        next: { revalidate: 5 },
      });
      if (res.ok) {
        const m = await res.json();
        const mapped = {
          ts: m.ts,
          presence: {
            active_sessions: m.meta?.room_count ?? 0,
            queue_depth: 0,
            citizens_online: m.streets?.citizen_count ?? 0,
          },
          vitals: {
            heart_rate: m.neon?.hr ? { resting_hr: m.neon.hr } : {},
            stress: m.neon?.stress ? { current_stress: m.neon.stress } : {},
            body_battery: m.neon?.energy ? { current: m.neon.energy, max: m.neon.energy_max ?? 100 } : {},
            sleep: m.neon?.sleep_hours ? { duration_hours: m.neon.sleep_hours } : {},
            ans_mode: m.neon?.ans_mode,
          },
          conversation: { recent: [] },
          music: m.ceiling?.playing ? {
            artist: m.ceiling.artist,
            title: m.ceiling.title,
            album: m.ceiling.album,
            progress_ms: m.ceiling.progress_ms,
            duration_ms: m.ceiling.duration_ms,
            is_playing: true,
          } : {},
          neurons: (m.rooms || []).map((r: Record<string, string>) => ({
            id: r.id,
            status: r.status,
            purpose: r.purpose,
            mode: r.mode,
            created: r.created,
            updated: '',
          })),
          activity: (m.hallway || []).map((h: Record<string, string>) => ({
            ts: h.ts,
            event: h.event,
            content: h.content,
            instance: h.instance,
          })),
          backlog: { ready: 0, in_progress: 0, done: 0, total: 0 },
        };
        cache = { data: mapped, timestamp: Date.now() };
        return NextResponse.json(mapped);
      }
    } catch { /* both failed */ }

    return NextResponse.json({
      ts: new Date().toISOString(),
      presence: { active_sessions: 0, busy_count: 0, queue_depth: 0, citizens_online: 0 },
      vitals: {},
      conversation: { recent: [] },
      music: {},
      neurons: [],
      activity: [],
      backlog: { ready: 0, in_progress: 0, done: 0, total: 0 },
      offline: true,
    });
  }
}
