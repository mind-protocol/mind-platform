// DOCS: docs/connectome/flow_canvas/IMPLEMENTATION_Connectome_Flow_Canvas_Code_Structure_With_React_Flow_And_Zones.md

export type LabelAnchor = {
  edge_id: string;
  x: number;
  y: number;
  visible: boolean;
};

export const compute_label_anchors = (
  anchors: LabelAnchor[],
  zoom: number
): LabelAnchor[] => {
  const used: { x: number; y: number }[] = [];
  return anchors.map((anchor) => {
    let offsetX = 0;
    let offsetY = 0;
    for (let i = 0; i < used.length; i += 1) {
      const other = used[i];
      const dx = Math.abs(anchor.x + offsetX - other.x);
      const dy = Math.abs(anchor.y + offsetY - other.y);
      if (dx < 18 && dy < 18) {
        offsetY += 18;
      }
    }
    const next = {
      ...anchor,
      x: anchor.x + offsetX,
      y: anchor.y + offsetY,
      visible: zoom >= 0.8,
    };
    used.push({ x: next.x, y: next.y });
    return next;
  });
};
