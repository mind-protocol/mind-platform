// DOCS: docs/connectome/edge_kit/IMPLEMENTATION_Connectome_Edge_Kit_Component_Map_And_Render_Tokens.md

export const pulse_strength_from_energy = (energy_delta?: number) => {
  if (energy_delta === undefined || energy_delta === null) {
    return 0.4;
  }
  const clamped = Math.max(0, Math.min(1, energy_delta));
  return 0.4 + clamped * 0.6;
};
