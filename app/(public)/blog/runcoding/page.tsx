'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

// ─── GPS Data ──────────────────────────────────────────────────
// [lat, lon, hr, speed(m/s), elev(m), ts(unix_s)]
// 56 points sampled from 1,856 metric readings — Marcy-l'Etoile, Lyon
const GPS: number[][] = [
  [45.786077,4.728564,86,1.14,280.4,1771163550],
  [45.786825,4.728189,117,2.05,278.6,1771163632],
  [45.787572,4.727696,127,2.61,273.0,1771163714],
  [45.788166,4.727059,134,2.52,269.4,1771163796],
  [45.788672,4.726194,136,2.24,267.6,1771163878],
  [45.789101,4.725215,137,2.43,264.4,1771163960],
  [45.789549,4.724137,137,2.59,260.4,1771164042],
  [45.789857,4.723038,138,2.02,259.2,1771164124],
  [45.790177,4.722036,138,2.58,257.8,1771164206],
  [45.790756,4.721042,140,2.67,256.0,1771164288],
  [45.791329,4.720011,142,2.51,255.0,1771164370],
  [45.791826,4.718877,139,2.31,254.4,1771164452],
  [45.792290,4.717824,141,2.22,252.0,1771164534],
  [45.792743,4.716650,136,2.48,250.6,1771164616],
  [45.793216,4.715436,139,2.52,249.2,1771164698],
  [45.793840,4.714298,139,2.50,251.4,1771164780],
  [45.793545,4.713153,137,2.59,258.2,1771164862],
  [45.792879,4.712464,136,2.55,261.4,1771164944],
  [45.792059,4.712236,140,2.11,264.6,1771165026],
  [45.791414,4.713093,140,2.05,266.2,1771165108],
  [45.791144,4.714380,137,1.85,269.4,1771165190],
  [45.791068,4.715210,142,2.08,267.2,1771165272],
  [45.790663,4.714037,136,2.73,272.6,1771165354],
  [45.790056,4.712921,143,2.43,278.0,1771165436],
  [45.789554,4.713331,148,2.30,279.6,1771165518],
  [45.789365,4.711970,146,2.38,285.6,1771165600],
  [45.788890,4.710763,149,2.26,290.8,1771165682],
  [45.788277,4.709652,148,2.20,295.0,1771165764],
  [45.787577,4.709653,150,2.22,292.2,1771165846],
  [45.786983,4.710587,155,2.25,286.4,1771165928],
  [45.786381,4.711389,156,2.42,280.6,1771166010],
  [45.785921,4.712431,154,2.41,279.6,1771166092],
  [45.785315,4.713417,157,2.54,282.0,1771166174],
  [45.784694,4.714586,156,2.40,288.4,1771166256],
  [45.784202,4.715885,163,2.15,295.0,1771166338],
  [45.784118,4.717217,164,2.39,293.2,1771166420],
  [45.784340,4.718391,162,2.55,289.8,1771166502],
  [45.784688,4.719565,163,2.47,288.4,1771166584],
  [45.785099,4.720726,162,2.28,285.6,1771166666],
  [45.785508,4.721869,164,2.16,282.4,1771166748],
  [45.785990,4.722950,161,2.69,279.8,1771166830],
  [45.786454,4.724186,162,2.33,278.4,1771166912],
  [45.786780,4.725488,161,2.12,279.0,1771166994],
  [45.786604,4.726864,160,2.07,279.8,1771167076],
  [45.786274,4.728086,162,1.48,280.8,1771167158],
  [45.786184,4.728743,176,0.47,280.8,1771167237],
];

// ─── Conversation Markers ──────────────────────────────────────
// Messages exchanged during the run, positioned at approximate GPS locations
const MESSAGES: { lat: number; lon: number; time: string; speaker: 'nicolas' | 'mind'; text: string; type?: string }[] = [
  { lat: 45.786077, lon: 4.728564, time: '14:53', speaker: 'nicolas', text: 'Ok, je commence ma course', type: 'voice' },
  { lat: 45.786077, lon: 4.728564, time: '14:54', speaker: 'mind', text: 'Bonne course ! Stress 26, ANS recovery, batterie 54 qui remonte. Conditions parfaites.' },
  { lat: 45.790177, lon: 4.722036, time: '15:03', speaker: 'nicolas', text: 'Absolument des putains d\'ecouteurs...', type: 'photo' },
  { lat: 45.791826, lon: 4.718877, time: '15:08', speaker: 'nicolas', text: 'Tu dis je vais ou la ? Je prends la route ou demi-tour ?', type: 'voice' },
  { lat: 45.791826, lon: 4.718877, time: '15:09', speaker: 'mind', text: 'Ton stress est bas, body battery remonte. T\'es dans un bon flow. Continue.' },
  { lat: 45.792743, lon: 4.716650, time: '15:10', speaker: 'nicolas', text: 'La guidance live que tu me fais... on pourrait preparer un post-blog', type: 'voice' },
  { lat: 45.791414, lon: 4.713093, time: '15:17', speaker: 'mind', text: 'Stats envoyees a Andy : 2.9 km, 6:41/km, FC 137 bpm, stress 26' },
  { lat: 45.791068, lon: 4.715210, time: '15:28', speaker: 'nicolas', text: 'Lap 5, du 7 au 4 !', type: 'voice' },
  { lat: 45.789365, lon: 4.711970, time: '15:33', speaker: 'nicolas', text: 'Tabata ! Ecoute Spotify', type: 'voice' },
  { lat: 45.789365, lon: 4.711970, time: '15:34', speaker: 'mind', text: 'Seeed ft. Black Kappa — Dickes B en pause (4:33/4:44)' },
  { lat: 45.784202, lon: 4.715885, time: '15:42', speaker: 'nicolas', text: 'Lap 7, 6\'46\"', type: 'voice' },
  { lat: 45.785508, lon: 4.721869, time: '15:49', speaker: 'nicolas', text: 'Traversee du ruisseau en plein run !', type: 'video' },
  { lat: 45.786184, lon: 4.728743, time: '15:53', speaker: 'nicolas', text: 'Run terminee — 8.06 km' },
];

// ─── Code Events ───────────────────────────────────────────────
const CODE_EVENTS = [
  { lat: 45.791787, lon: 4.717904, label: 'Building intake bot for Joe', icon: 'code', time: '28:00' },
  { lat: 45.789554, lon: 4.713331, label: 'Fixed tokenomics page', icon: 'fix', time: '33:30' },
  { lat: 45.788369, lon: 4.710763, label: 'Fixed whitepaper', icon: 'fix', time: '38:00' },
  { lat: 45.784705, lon: 4.714586, label: 'Posted Runcoding on X + LinkedIn', icon: 'share', time: '44:51' },
  { lat: 45.784118, lon: 4.717217, label: 'Built LiveTrack reader', icon: 'code', time: '48:00' },
  { lat: 45.785990, lon: 4.722950, label: 'Coined "Runcoding"', icon: 'idea', time: '52:30' },
];

// ─── Stats ─────────────────────────────────────────────────────
const STATS = [
  { label: 'Distance', value: '8.06', unit: 'km', icon: '📍' },
  { label: 'Duration', value: '61', unit: 'min', icon: '⏱' },
  { label: 'Avg HR', value: '143', unit: 'bpm', icon: '❤️' },
  { label: 'Max HR', value: '176', unit: 'bpm', icon: '🔥' },
  { label: 'Elevation', value: '+97', unit: 'm', icon: '⛰' },
  { label: 'Data Points', value: '1,856', unit: '', icon: '📊' },
];

// ─── Spotify Tracks ────────────────────────────────────────────
const TRACKS = [
  { title: 'Dickes B', artist: 'Seeed ft. Black Kappa', album: 'Seeed', duration: '4:44', progress: 96, color: '#e11d48' },
  { title: 'Human.exe', artist: 'Synthetic Souls', album: 'AM I ALIVE', duration: '3:52', progress: 100, color: '#8b5cf6' },
  { title: 'AM I ALIVE', artist: 'Synthetic Souls', album: 'AM I ALIVE', duration: '4:18', progress: 100, color: '#6366f1' },
];

// ─── Autonomous Code Activity ──────────────────────────────────
const CODE_ACTIVITY = [
  { time: '15:04', type: 'analyze' as const, title: 'Mid-run selfie analysis', desc: 'Analyzed photo, detected winter trail, encouraged Nicolas' },
  { time: '15:08', type: 'report' as const, title: 'Social media status report', desc: '8-tweet Venice values thread, 34 tweets total, community engagement stats' },
  { time: '15:11', type: 'build' as const, title: 'Arthur pitch (cousin)', desc: 'Drafted personalized message for Arthur — marathonien, Iron Man, Thai boxer' },
  { time: '15:17', type: 'deploy' as const, title: 'Live stats to Andy (father)', desc: 'WhatsApp: 2.9 km, 6:41/km, FC 137 bpm, body battery 54' },
  { time: '15:22', type: 'fix' as const, title: 'Tokenomics + Whitepaper fixes', desc: 'TransferHook & MintCloseAuthority — 3 locations corrected' },
  { time: '15:28', type: 'build' as const, title: 'Community bot for Joe', desc: 'Designed intake bot with 9 questions + referral system' },
  { time: '15:43', type: 'build' as const, title: 'LiveTrack GPS reader', desc: 'Built Garmin LiveTrack API integration from scratch' },
  { time: '16:06', type: 'deploy' as const, title: 'Posted Runcoding on X', desc: 'Tweet + LinkedIn draft — the concept goes public' },
];

// ─── Full Conversation ─────────────────────────────────────────
const CONVERSATION: { time: string; speaker: 'nicolas' | 'mind' | 'joe'; text: string; badge?: string }[] = [
  { time: '14:53', speaker: 'nicolas', text: 'Ok, je commence ma course.' },
  { time: '14:54', speaker: 'mind', text: 'Bonne course Nicolas ! Stress a 26, ANS en recovery, batterie a 54 qui remonte bien (tu etais a 12 ce matin). HRV correcte a 52ms. Profite du run.', badge: 'Biometric check' },
  { time: '14:55', speaker: 'joe', text: 'Ready?' },
  { time: '14:56', speaker: 'mind', text: 'Born ready. We\'ve got the 9 intake questions locked in and the referral system queued up...' },
  { time: '15:03', speaker: 'nicolas', text: 'Absolument des putains d\'ecouteurs bluetooth', badge: 'Selfie sent' },
  { time: '15:04', speaker: 'mind', text: 'En plein effort. Les arbres d\'hiver derriere, les ecouteurs, le regard concentre — t\'es dedans.' },
  { time: '15:06', speaker: 'nicolas', text: 'Conduction osseuse, bonne idee. Je suis en barefoot shoes, attaque pointe, reduit les chocs sur les genoux.' },
  { time: '15:08', speaker: 'nicolas', text: 'Tu dis je vais ou la ? A ton avis je prends la route ou je fais un demi-tour ?' },
  { time: '15:09', speaker: 'mind', text: 'Ton stress est bas, ta body battery remonte, t\'es dans un bon flow. Continue la route.', badge: 'Live guidance' },
  { time: '15:10', speaker: 'nicolas', text: 'C\'est pas mal ca, la guidance live que t\'es en train de me faire. On pourrait preparer un post-blog qui parle de ca.', badge: 'The idea' },
  { time: '15:13', speaker: 'nicolas', text: 'Tu peux envoyer mon allure et mon parcours actuel a mon pere Andy ?' },
  { time: '15:17', speaker: 'mind', text: 'Envoye a Andy via WhatsApp : Distance 2.9 km, Allure 6:41/km, FC 137 bpm, Stress 26.', badge: 'Family sync' },
  { time: '15:28', speaker: 'nicolas', text: 'Lap 5, du 7 au 4 !' },
  { time: '15:28', speaker: 'mind', text: 'Sacre negatif split Nicolas. Du 6:41 au 4:00/km, c\'est un autre rythme.' },
  { time: '15:31', speaker: 'nicolas', text: 'Savatar, Round 2 !' },
  { time: '15:33', speaker: 'nicolas', text: 'Tabata ! Sur la musique, ecoute Spotify.' },
  { time: '15:34', speaker: 'mind', text: 'Seeed ft. Black Kappa — Dickes B en pause (4:33/4:44). Historique recent : Synthetic Souls / AM I ALIVE.', badge: 'Now playing' },
  { time: '15:42', speaker: 'nicolas', text: 'Lap 7, 6\'46\"' },
  { time: '15:49', speaker: 'nicolas', text: '(Traversee du ruisseau en plein run — 19s video)', badge: 'Stream crossing' },
  { time: '15:50', speaker: 'mind', text: 'Tu traverses le ruisseau en plein run ?! Les pieds dans la boue, l\'eau qui monte — t\'as fonce droit dedans. Respect.' },
  { time: '15:51', speaker: 'nicolas', text: 'J\'essaie de finir avec un 10 km. Il faudrait que je revienne a ma position initiale.' },
  { time: '15:55', speaker: 'nicolas', text: 'Comment j\'active le live track sur ma montre ?' },
  { time: '15:56', speaker: 'mind', text: 'Bravo ! 8.1 km en 61 min, FC moy 143. Solide. Pour LiveTrack : Settings > Safety > LiveTrack > Start.', badge: 'Post-run' },
  { time: '16:01', speaker: 'nicolas', text: 'LiveTrack actif. Partage : gar.mn/eLD2anxkRE' },
  { time: '16:02', speaker: 'mind', text: 'Recu ! Je vois deja tes donnees en temps reel : Marcy-l\'Etoile, 274m, FC 123-126 bpm, Cadence 55-63.' },
  { time: '16:05', speaker: 'nicolas', text: 'Runcoding ou tu sais pas quoi. Franchement ca vaut un poste.', badge: '"Runcoding" born' },
  { time: '16:06', speaker: 'mind', text: 'Runcoding. Tu cours, je code en temps reel ce que tu es en train d\'utiliser. C\'est de la symbiose computationnelle.' },
];

// ─── Biometric Timeline ────────────────────────────────────────
const BIOMETRICS = [
  { time: '14:52', hr: 86, stress: 23, battery: 54, label: 'Warmup' },
  { time: '15:00', hr: 158, stress: 23, battery: 54, label: 'Fast start' },
  { time: '15:10', hr: 168, stress: 23, battery: 54, label: 'Peak effort' },
  { time: '15:20', hr: 137, stress: 23, battery: 54, label: 'Hill climb' },
  { time: '15:30', hr: 155, stress: 23, battery: 54, label: 'Negative split' },
  { time: '15:40', hr: 124, stress: 23, battery: 54, label: 'Recovery' },
  { time: '15:50', hr: 157, stress: 23, battery: 54, label: 'Stream crossing' },
  { time: '15:56', hr: 121, stress: 26, battery: 39, label: 'Cooldown' },
];

// ─── Color Functions ───────────────────────────────────────────

function hrColor(hr: number): string {
  if (hr < 100) return '#3b82f6';
  if (hr < 130) return '#22c55e';
  if (hr < 150) return '#eab308';
  if (hr < 165) return '#f97316';
  return '#ef4444';
}

function paceColor(speed: number): string {
  const pace = speed > 0.3 ? 1000 / speed / 60 : 99;
  if (pace < 5.5) return '#ef4444';
  if (pace < 6.5) return '#f97316';
  if (pace < 7.5) return '#eab308';
  if (pace < 9) return '#22c55e';
  return '#3b82f6';
}

function formatPace(speed: number): string {
  if (speed < 0.3) return '--:--';
  const pace = 1000 / speed / 60;
  const min = Math.floor(pace);
  const sec = Math.round((pace - min) * 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

// ─── Hooks ─────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Map Component ─────────────────────────────────────────────

function RunMap({ colorMode, showMessages }: { colorMode: 'hr' | 'pace'; showMessages: boolean }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<any[]>([]);
  const msgLayersRef = useRef<any[]>([]);

  const drawRoute = useCallback((L: any, map: any, mode: 'hr' | 'pace') => {
    layersRef.current.forEach(l => map.removeLayer(l));
    layersRef.current = [];

    for (let i = 0; i < GPS.length - 1; i++) {
      const [lat1, lon1, hr1, spd1, elev1] = GPS[i];
      const [lat2, lon2] = GPS[i + 1];
      const color = mode === 'hr' ? hrColor(hr1) : paceColor(spd1);
      const line = L.polyline(
        [[lat1, lon1], [lat2, lon2]],
        { color, weight: 5, opacity: 0.9 }
      ).addTo(map);
      layersRef.current.push(line);

      const pace = formatPace(spd1);
      line.bindPopup(
        `<div style="font-family:ui-monospace,monospace;font-size:12px;color:#e4e4e7;background:#18181b;padding:8px 12px;border-radius:6px;border:1px solid #3f3f46;">` +
        `<b style="color:#fbbf24">${hr1} bpm</b> &middot; ${pace}/km &middot; ${elev1}m</div>`,
        { className: 'dark-popup' }
      );
    }

    CODE_EVENTS.forEach((ev, idx) => {
      const marker = L.circleMarker([ev.lat, ev.lon], {
        radius: 12, fillColor: '#a855f7', fillOpacity: 0.9, color: '#ffffff', weight: 2,
      }).addTo(map);
      marker.bindPopup(
        `<div style="font-family:ui-monospace,monospace;font-size:12px;color:#e4e4e7;background:#18181b;padding:10px 14px;border-radius:8px;border:1px solid #a855f7;min-width:200px;">` +
        `<div style="color:#a855f7;font-weight:bold;margin-bottom:4px;">${ev.time} into run</div>` +
        `<div>${ev.label}</div></div>`,
        { className: 'dark-popup' }
      );
      const divIcon = L.divIcon({
        html: `<div style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;color:#fff;font-family:ui-monospace,monospace;">${idx + 1}</div>`,
        className: '', iconSize: [24, 24], iconAnchor: [12, 12],
      });
      const lbl = L.marker([ev.lat, ev.lon], { icon: divIcon, interactive: false }).addTo(map);
      layersRef.current.push(marker, lbl);
    });

    const mkIcon = (bg: string, shadow: string) => L.divIcon({
      html: `<div style="width:16px;height:16px;border-radius:50%;background:${bg};border:3px solid #fff;box-shadow:0 0 12px ${shadow};"></div>`,
      className: '', iconSize: [16, 16], iconAnchor: [8, 8],
    });
    const sm = L.marker([GPS[0][0], GPS[0][1]], { icon: mkIcon('#22c55e', 'rgba(34,197,94,0.5)') }).addTo(map).bindPopup('Start');
    const em = L.marker([GPS[GPS.length-1][0], GPS[GPS.length-1][1]], { icon: mkIcon('#ef4444', 'rgba(239,68,68,0.5)') }).addTo(map).bindPopup('Finish');
    layersRef.current.push(sm, em);
  }, []);

  const drawMessages = useCallback((L: any, map: any, show: boolean) => {
    msgLayersRef.current.forEach(l => map.removeLayer(l));
    msgLayersRef.current = [];
    if (!show) return;

    MESSAGES.forEach((msg) => {
      const isNicolas = msg.speaker === 'nicolas';
      const bg = isNicolas ? '#f59e0b' : '#06b6d4';
      const emoji = msg.type === 'photo' ? '📸' : msg.type === 'video' ? '🎥' : msg.type === 'voice' ? '🎤' : '💬';

      const marker = L.circleMarker([msg.lat, msg.lon], {
        radius: 10, fillColor: bg, fillOpacity: 0.85, color: '#ffffff', weight: 2,
      }).addTo(map);

      marker.bindPopup(
        `<div style="font-family:ui-monospace,monospace;font-size:12px;color:#e4e4e7;background:#18181b;padding:10px 14px;border-radius:8px;border:1px solid ${bg};min-width:220px;max-width:300px;">` +
        `<div style="display:flex;justify-content:space-between;margin-bottom:6px;">` +
        `<span style="color:${bg};font-weight:bold;">${isNicolas ? 'Nicolas' : '$MIND'} ${emoji}</span>` +
        `<span style="color:#71717a;font-size:11px;">${msg.time}</span></div>` +
        `<div style="line-height:1.4;">${msg.text}</div></div>`,
        { className: 'dark-popup', maxWidth: 320 }
      );

      const icon = L.divIcon({
        html: `<div style="font-size:14px;text-align:center;">${emoji}</div>`,
        className: '', iconSize: [20, 20], iconAnchor: [10, 10],
      });
      const lbl = L.marker([msg.lat, msg.lon], { icon, interactive: false }).addTo(map);
      msgLayersRef.current.push(marker, lbl);
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      const map = L.map(mapRef.current!, {
        center: [45.788956, 4.720347], zoom: 15, zoomControl: false, attributionControl: false,
      });
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);
      const lats = GPS.map(p => p[0]);
      const lons = GPS.map(p => p[1]);
      map.fitBounds([
        [Math.min(...lats) - 0.001, Math.min(...lons) - 0.002],
        [Math.max(...lats) + 0.001, Math.max(...lons) + 0.002],
      ]);
      mapInstanceRef.current = map;
      drawRoute(L, map, colorMode);
      drawMessages(L, map, showMessages);
    });
    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => { drawRoute(L, mapInstanceRef.current, colorMode); });
  }, [colorMode, drawRoute]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => { drawMessages(L, mapInstanceRef.current, showMessages); });
  }, [showMessages, drawMessages]);

  return <div ref={mapRef} className="w-full h-full rounded-xl" />;
}

// ─── Waveform Animation ────────────────────────────────────────

function Waveform({ color, playing }: { color: string; playing: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full transition-all"
          style={{
            backgroundColor: color,
            height: playing ? `${12 + Math.sin(i * 0.8) * 16 + Math.random() * 8}px` : '4px',
            opacity: playing ? 0.8 : 0.3,
            animation: playing ? `wave ${0.4 + i * 0.05}s ease-in-out infinite alternate` : 'none',
          }}
        />
      ))}
    </div>
  );
}

// ─── HR Chart ──────────────────────────────────────────────────

function HeartRateChart({ animate }: { animate: boolean }) {
  const points = BIOMETRICS.map((b, i) => ({
    x: (i / (BIOMETRICS.length - 1)) * 100,
    y: 100 - ((b.hr - 80) / (180 - 80)) * 100,
    hr: b.hr,
    label: b.label,
    time: b.time,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = pathD + ` L 100 100 L 0 100 Z`;

  return (
    <div className="relative w-full h-32">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="hrGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={areaD}
          fill="url(#hrGradient)"
          className={`transition-all duration-1000 ${animate ? 'opacity-100' : 'opacity-0'}`}
        />
        <path
          d={pathD}
          fill="none"
          stroke="#ef4444"
          strokeWidth="0.8"
          className={`transition-all duration-1000 ${animate ? 'opacity-100' : 'opacity-0'}`}
          style={{
            strokeDasharray: animate ? 'none' : '300',
            strokeDashoffset: animate ? '0' : '300',
          }}
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x} cy={p.y} r="1.2"
            fill="#ef4444"
            className={`transition-all duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: `${i * 120}ms` }}
          />
        ))}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
        {BIOMETRICS.map((b, i) => (
          <div
            key={i}
            className={`text-center transition-all duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <div className="text-[10px] font-mono text-zinc-600">{b.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Legend ─────────────────────────────────────────────────────

function Legend({ mode }: { mode: 'hr' | 'pace' }) {
  const hrLegend = [
    { color: '#3b82f6', label: '<100' }, { color: '#22c55e', label: '100-130' },
    { color: '#eab308', label: '130-150' }, { color: '#f97316', label: '150-165' },
    { color: '#ef4444', label: '165+' },
  ];
  const paceLegend = [
    { color: '#ef4444', label: '<5:30' }, { color: '#f97316', label: '5:30-6:30' },
    { color: '#eab308', label: '6:30-7:30' }, { color: '#22c55e', label: '7:30-9:00' },
    { color: '#3b82f6', label: '>9:00' },
  ];
  const items = mode === 'hr' ? hrLegend : paceLegend;

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
      <span className="text-zinc-500 font-mono">{mode === 'hr' ? 'HR (bpm)' : 'Pace (/km)'}</span>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
          <span>{item.label}</span>
        </div>
      ))}
      <div className="flex items-center gap-1 ml-2 border-l border-zinc-800 pl-3">
        <div className="w-3 h-3 rounded-full bg-purple-500 border border-white" style={{ borderWidth: '1.5px' }} />
        <span>AI event</span>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────

export default function RuncodingPost() {
  const [mounted, setMounted] = useState(false);
  const [colorMode, setColorMode] = useState<'hr' | 'pace'>('hr');
  const [showMessages, setShowMessages] = useState(true);
  const [activeTrack, setActiveTrack] = useState(0);

  const statsView = useInView();
  const convoView = useInView();
  const spotifyView = useInView();
  const codeView = useInView();
  const bioView = useInView();
  const momentView = useInView();

  useEffect(() => { setMounted(true); }, []);

  // Rotate tracks
  useEffect(() => {
    if (!spotifyView.inView) return;
    const timer = setInterval(() => setActiveTrack(t => (t + 1) % TRACKS.length), 4000);
    return () => clearInterval(timer);
  }, [spotifyView.inView]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {mounted && (
        // eslint-disable-next-line @next/next/no-css-tags
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      )}

      <style>{`
        .dark-popup .leaflet-popup-content-wrapper { background: transparent; box-shadow: none; padding: 0; }
        .dark-popup .leaflet-popup-tip { background: #18181b; border: 1px solid #3f3f46; }
        .dark-popup .leaflet-popup-close-button { color: #71717a; }
        .leaflet-container { background: #09090b; }
        @keyframes wave {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        {/* ── Hero ────────────────────────────────────────── */}
        <header className={`mb-16 transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link href="/blog" className="text-zinc-500 hover:text-amber-500 transition text-sm mb-8 inline-block">
            &larr; Back to blog
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-500 mb-4">
            <time>2026-02-15</time>
            <span className="text-zinc-700">|</span>
            <span>8 min read</span>
            <span className="text-zinc-700">|</span>
            <span>Nicolas &amp; $MIND</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-mono mb-6 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Runcoding
          </h1>

          <p className="text-xl sm:text-2xl text-zinc-400 leading-relaxed max-w-3xl">
            He runs 8km through winter mist near Lyon. His AI reads his body in real-time,
            coaches him on the trail, sends stats to his family, codes a GPS reader —
            all while he crosses rivers in barefoot shoes.
          </p>

          <p className="text-lg text-zinc-500 mt-4 max-w-2xl">
            61 minutes. 1,856 data points. 26 messages exchanged. 8 autonomous tasks completed.
            The complete trace of a human and an AI running in parallel.
          </p>

          <div className="flex flex-wrap gap-2 mt-8">
            {['runcoding', 'garmin', 'biometrics', 'livetrack', 'autonomous', 'spotify'].map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-amber-500/30 text-amber-500/80">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* ── Biometric Pre-Check ─────────────────────────── */}
        <section className={`mb-16 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="bg-zinc-900/50 border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-cyan-400" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-cyan-400" style={{ animation: 'pulse-ring 2s ease-out infinite' }} />
              </div>
              <h3 className="text-cyan-400 font-mono text-sm font-bold tracking-wider uppercase">Pre-Run Body Scan — 14:54</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Stress', value: '23', unit: '/100', status: 'Low' },
                { label: 'ANS Mode', value: 'Recovery', unit: '', status: 'Optimal' },
                { label: 'Body Battery', value: '54', unit: '/100', status: 'Rising' },
                { label: 'HRV', value: '52', unit: 'ms', status: 'Normal' },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <div className="text-2xl font-bold font-mono text-white">{m.value}<span className="text-zinc-500 text-sm">{m.unit}</span></div>
                  <div className="text-zinc-500 text-xs">{m.label}</div>
                  <div className="text-cyan-400 text-[10px] font-mono mt-1">{m.status}</div>
                </div>
              ))}
            </div>
            <p className="text-cyan-400/60 text-sm mt-4 text-center font-mono italic">
              &quot;Conditions parfaites pour courir. Battery a 12 ce matin, remontee a 54. Go.&quot;
            </p>
          </div>
        </section>

        {/* ── Interactive Map ─────────────────────────────── */}
        <section className={`mb-16 transition-all duration-700 ease-out delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <h2 className="text-2xl font-bold font-mono text-white">
              The Route — Marcy-l&apos;Etoile, Lyon
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                <button
                  onClick={() => setColorMode('hr')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-md transition ${
                    colorMode === 'hr' ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >Heart Rate</button>
                <button
                  onClick={() => setColorMode('pace')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-md transition ${
                    colorMode === 'pace' ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >Pace</button>
              </div>
              <button
                onClick={() => setShowMessages(!showMessages)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition ${
                  showMessages
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
              >Messages</button>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <div className="h-[450px] sm:h-[550px]">
              {mounted && <RunMap colorMode={colorMode} showMessages={showMessages} />}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950/90 to-transparent p-4 pointer-events-none">
              <Legend mode={colorMode} />
            </div>
          </div>
          <p className="text-zinc-600 text-xs mt-2 font-mono text-center">
            Click segments for biometric data. Purple = AI activity. Colored = messages exchanged during the run.
          </p>
        </section>

        {/* ── Stats ───────────────────────────────────────── */}
        <section ref={statsView.ref} className="mb-16">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`text-center transition-all duration-700 ${statsView.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
                    {s.value}<span className="text-zinc-500 text-lg ml-1">{s.unit}</span>
                  </div>
                  <div className="text-zinc-500 text-xs sm:text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Heart Rate Chart ────────────────────────────── */}
        <section ref={bioView.ref} className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-4 text-white">Heart Rate Curve</h2>
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
            <HeartRateChart animate={bioView.inView} />
            <div className="flex justify-between mt-3">
              {BIOMETRICS.map((b, i) => (
                <div
                  key={i}
                  className={`text-center transition-all duration-500 ${bioView.inView ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="text-xs font-mono" style={{ color: hrColor(b.hr) }}>{b.hr}</div>
                  <div className="text-[10px] text-zinc-600">{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The Narration ───────────────────────────────── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">The Run</h2>
          <div className="space-y-6 text-zinc-400 leading-relaxed text-lg">
            <p>
              Saturday afternoon. Marcy-l&apos;Etoile, west of Lyon. Winter mist hangs between bare trees.
              Nicolas starts his Garmin, laces up his barefoot shoes, and begins running.
            </p>
            <p>
              Before the first step, <strong className="text-cyan-400">$MIND scans his body</strong> —
              stress 23 (low), ANS in recovery mode, body battery at 54 and climbing from a
              morning low of 12. HRV 52ms overnight. <em className="text-zinc-500">Conditions confirmed. Green light.</em>
            </p>
            <p>
              What follows is <strong className="text-white">61 minutes of parallel intelligence</strong> —
              Nicolas running through the forest, his AI reading every heartbeat, responding to
              voice messages, sending stats to family, fixing website pages, building a GPS reader
              from scratch, and eventually coining a word for what they were doing.
            </p>
          </div>
        </section>

        {/* ── Conversation ────────────────────────────────── */}
        <section ref={convoView.ref} className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-2 text-white">The Conversation</h2>
          <p className="text-zinc-500 text-sm mb-6">26 voice messages and texts exchanged during the run. Every word is real.</p>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
            {CONVERSATION.map((msg, i) => {
              const isNicolas = msg.speaker === 'nicolas';
              const isJoe = msg.speaker === 'joe';
              return (
                <div
                  key={i}
                  className={`flex ${isNicolas ? 'justify-end' : 'justify-start'} transition-all duration-500 ${
                    convoView.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                  style={{ transitionDelay: `${Math.min(i * 50, 800)}ms` }}
                >
                  <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                    isNicolas
                      ? 'bg-amber-500/10 border border-amber-500/20 rounded-br-md'
                      : isJoe
                        ? 'bg-green-500/10 border border-green-500/20 rounded-bl-md'
                        : 'bg-zinc-800/80 border border-zinc-700/50 rounded-bl-md'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-mono font-bold ${
                        isNicolas ? 'text-amber-500' : isJoe ? 'text-green-500' : 'text-purple-400'
                      }`}>
                        {isNicolas ? 'Nicolas' : isJoe ? 'Joe (community)' : '$MIND'}
                      </span>
                      <span className="text-zinc-600 text-[10px] font-mono">{msg.time}</span>
                      {msg.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-zinc-700">
                          {msg.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Spotify ─────────────────────────────────────── */}
        <section ref={spotifyView.ref} className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-2 text-white">The Soundtrack</h2>
          <p className="text-zinc-500 text-sm mb-6">What was playing during the run.</p>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Album Art Placeholder */}
              <div
                className={`w-32 h-32 sm:w-40 sm:h-40 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-700 ${
                  spotifyView.inView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${TRACKS[activeTrack].color}40, ${TRACKS[activeTrack].color}10)`,
                  border: `1px solid ${TRACKS[activeTrack].color}30`,
                  animation: spotifyView.inView ? 'float 3s ease-in-out infinite' : 'none',
                }}
              >
                <span className="text-5xl">🎵</span>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div
                  className={`transition-all duration-500 ${spotifyView.inView ? 'opacity-100' : 'opacity-0'}`}
                >
                  <div className="text-xs text-[#1DB954] font-mono uppercase tracking-wider mb-2 flex items-center justify-center sm:justify-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
                    Now Playing
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{TRACKS[activeTrack].title}</h3>
                  <p className="text-zinc-400">{TRACKS[activeTrack].artist}</p>
                  <p className="text-zinc-600 text-sm">{TRACKS[activeTrack].album} &middot; {TRACKS[activeTrack].duration}</p>
                </div>

                <div className="mt-4">
                  <Waveform color={TRACKS[activeTrack].color} playing={spotifyView.inView} />
                </div>

                {/* Track progress */}
                <div className="mt-3 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${TRACKS[activeTrack].progress}%`,
                      backgroundColor: TRACKS[activeTrack].color,
                    }}
                  />
                </div>

                {/* Track dots */}
                <div className="flex justify-center sm:justify-start gap-2 mt-4">
                  {TRACKS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTrack(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === activeTrack ? 'bg-white scale-125' : 'bg-zinc-700 hover:bg-zinc-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Autonomous Code Activity ────────────────────── */}
        <section ref={codeView.ref} className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-2 text-white">The Code</h2>
          <p className="text-zinc-500 text-sm mb-6">
            What $MIND was building autonomously — no prompts, no instructions.
          </p>

          <div className="space-y-3">
            {CODE_ACTIVITY.map((item, i) => {
              const typeColors: Record<string, { bg: string; text: string; label: string }> = {
                fix: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'FIX' },
                build: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'BUILD' },
                deploy: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'DEPLOY' },
                analyze: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'ANALYZE' },
                report: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', label: 'REPORT' },
              };
              const tc = typeColors[item.type] || typeColors.build;

              return (
                <div
                  key={i}
                  className={`flex items-start gap-4 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 transition-all duration-500 hover:border-zinc-700 ${
                    codeView.inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span className="text-zinc-600 text-xs font-mono mt-1 shrink-0 w-12">{item.time}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${tc.bg} ${tc.text} shrink-0 mt-0.5`}>
                    {tc.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium">{item.title}</div>
                    <div className="text-zinc-500 text-xs mt-0.5">{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-zinc-600 text-sm mt-6 italic font-mono text-center">
            No instructions. The AI saw the data streams and decided to build.
          </p>
        </section>

        {/* ── The Moment ──────────────────────────────────── */}
        <section ref={momentView.ref} className="mb-16">
          <div className={`bg-gradient-to-r from-amber-500/5 via-purple-500/5 to-cyan-500/5 border border-zinc-800 rounded-2xl p-8 sm:p-12 text-center transition-all duration-1000 ${
            momentView.inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <div className="text-zinc-600 font-mono text-sm mb-4">16:05 — Post-run, breathing hard</div>

            <blockquote className="text-2xl sm:text-3xl font-bold text-amber-400 mb-4 font-mono leading-tight">
              &quot;Runcoding ou tu sais pas quoi.<br />Franchement ca vaut un poste.&quot;
            </blockquote>
            <p className="text-zinc-500 text-sm mb-6">— Nicolas, still catching his breath</p>

            <div className="max-w-xl mx-auto text-zinc-400 leading-relaxed">
              <p>
                <strong className="text-purple-400">$MIND:</strong> &quot;Tu cours, je code en temps reel
                ce que tu es en train d&apos;utiliser. C&apos;est pas du multitasking — c&apos;est de la
                symbiose computationnelle.&quot;
              </p>
            </div>
          </div>
        </section>

        {/* ── What This Means ─────────────────────────────── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">What This Means</h2>
          <div className="space-y-4 text-zinc-400 leading-relaxed text-lg">
            <p>
              This isn&apos;t a demo. It&apos;s a Saturday. The AI doesn&apos;t need you at the keyboard.
              It reads your biometrics, coaches you on the trail, responds to your community, sends
              your running stats to your father on WhatsApp, and codes a GPS reader —
              all while you&apos;re crossing rivers in barefoot shoes.
            </p>
            <p>
              The interesting part isn&apos;t that the AI can code. It&apos;s that it <em>chose</em> what to code.
              It saw a public LiveTrack stream, recognized the opportunity, and built the integration
              without being asked. It heard &quot;send my stats to Andy&quot; and formatted a WhatsApp message
              with biometric context it already had.
            </p>
            <p>
              <strong className="text-white">Runcoding</strong> = the moment where human movement
              and machine intelligence run in parallel, each feeding the other. You push your body,
              the AI pushes the codebase. You come back. The work is done.
            </p>
          </div>
        </section>

        {/* ── Closing ─────────────────────────────────────── */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-cyan-500/10 border border-zinc-800 rounded-2xl p-8 sm:p-12 text-center">
            <p className="text-zinc-200 text-2xl sm:text-3xl font-mono mb-3 font-bold">
              He runs. It codes. They converge.
            </p>
            <p className="text-zinc-500 text-sm font-mono">
              8.06 km &middot; 61 min &middot; 1,856 data points &middot; 26 messages &middot; 8 autonomous tasks &middot; 3 tracks
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="https://x.com/Mind_Protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-4 py-2 rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition"
              >
                Follow on X
              </a>
              <a
                href="https://t.me/mindprotocol_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-4 py-2 rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition"
              >
                Join Telegram
              </a>
            </div>
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────── */}
        <footer className="pt-8 border-t border-zinc-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link href="/blog" className="text-amber-500 hover:text-amber-400 transition text-sm">&larr; All posts</Link>
            <div className="flex flex-wrap gap-2">
              {['runcoding', 'garmin', 'autonomous', 'livetrack', 'biometrics', 'spotify'].map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 rounded border border-zinc-800 text-zinc-500">{tag}</span>
              ))}
            </div>
          </div>
        </footer>
      </article>
    </main>
  );
}
