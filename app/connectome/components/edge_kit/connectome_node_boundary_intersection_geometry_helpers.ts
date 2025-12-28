// DOCS: docs/connectome/edge_kit/IMPLEMENTATION_Connectome_Edge_Kit_Component_Map_And_Render_Tokens.md

type Point = { x: number; y: number };

type Rect = { x: number; y: number; width: number; height: number };

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const intersect_line_with_rect = (
  start: Point,
  end: Point,
  rect: Rect
): Point => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dx === 0 && dy === 0) {
    return { x: rect.x, y: rect.y };
  }
  const tValues = [
    (rect.x - start.x) / dx,
    (rect.x + rect.width - start.x) / dx,
    (rect.y - start.y) / dy,
    (rect.y + rect.height - start.y) / dy,
  ].filter((t) => Number.isFinite(t) && t >= 0 && t <= 1);

  const t = tValues.length ? tValues.sort()[0] : 1;
  return {
    x: clamp(start.x + dx * t, rect.x, rect.x + rect.width),
    y: clamp(start.y + dy * t, rect.y, rect.y + rect.height),
  };
};
