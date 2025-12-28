"use client";

// DOCS: docs/connectome/node_kit/IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md

type EnergyBadgeProps = {
  value?: number;
};

const bucket_for_energy = (energy?: number) => {
  if (energy === undefined || energy === null) {
    return "energy-low";
  }
  if (energy < 0.1) {
    return "energy-low";
  }
  if (energy < 0.3) {
    return "energy-mid";
  }
  if (energy < 0.6) {
    return "energy-high";
  }
  return "energy-peak";
};

export default function EnergyBadge({ value }: EnergyBadgeProps) {
  const className = bucket_for_energy(value);
  const display = value === undefined || value === null ? "?" : value.toFixed(2);
  return (
    <div className={`energy-badge ${className}`}>
      <span>Energy</span>
      <strong>{display}</strong>
    </div>
  );
}
