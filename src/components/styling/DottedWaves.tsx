
const random = (seed: number, salt: number) => {
  const value = Math.sin(seed * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const routeLines = Array.from({ length: 18 }, (_, i) => {
  const x = random(i, 1) * 1440;
  const y = random(i, 2) * 900;
  const length = 70 + random(i, 3) * 180;
  const bend = (random(i, 4) - 0.5) * 70;

  return {
    d: `M ${x} ${y} q ${length / 2} ${bend} ${length} ${(random(i, 5) - 0.5) * 50}`,
    opacity: 0.08 + random(i, 6) * 0.08,
  };
});

const waypoints = Array.from({ length: 46 }, (_, i) => ({
  cx: 28 + random(i, 7) * 1384,
  cy: 28 + random(i, 8) * 844,
  r: 1.5 + random(i, 9) * 2.5,
  opacity: 0.14 + random(i, 10) * 0.2,
}));

const clusters = Array.from({ length: 10 }, (_, i) => ({
  cx: random(i, 11) * 1440,
  cy: random(i, 12) * 900,
  rx: 45 + random(i, 13) * 100,
  ry: 28 + random(i, 14) * 70,
  rotation: random(i, 15) * 180,
}));

const icons = ["pin", "store", "heart", "tool", "sparkle"];

const iconPlacements = Array.from({ length: 16 }, (_, i) => ({
  icon: icons[i % icons.length],
  x: 42 + random(i, 16) * 1356,
  y: 42 + random(i, 17) * 816,
  size: 18 + random(i, 18) * 14,
  rotation: (random(i, 19) - 0.5) * 24,
  opacity: 0.07 + random(i, 20) * 0.1,
  color: i % 3 === 0 ? "#B11226" : "#8C6412",
}));

const orbitRings = Array.from({ length: 12 }, (_, i) => ({
  cx: random(i, 21) * 1440,
  cy: random(i, 22) * 900,
  radius: 16 + random(i, 23) * 28,
  rotation: random(i, 24) * 360,
  color: i % 3 === 0 ? "#B11226" : "#C89116",
}));

export default function DottedWaves() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 z-0 h-screen w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="suvidha-glow">
          <stop offset="0" stopColor="#B11226" stopOpacity="0.08" />
          <stop offset="1" stopColor="#B11226" stopOpacity="0" />
        </radialGradient>
        <pattern
          id="suvidha-base-dots"
          width="72"
          height="72"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="10" cy="12" r="1.1" fill="#B11226" opacity="0.12" />
          <circle cx="48" cy="42" r="0.9" fill="#C89116" opacity="0.16" />
          <circle cx="28" cy="64" r="0.6" fill="#B11226" opacity="0.08" />
        </pattern>
        <symbol id="icon-pin" viewBox="0 0 24 24">
          <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
          <circle cx="12" cy="10" r="2.25" />
        </symbol>
        <symbol id="icon-store" viewBox="0 0 24 24">
          <path d="M4 10v9h16v-9M3 10l2-6h14l2 6" />
          <path d="M3 10c.5 2 3.5 2 4.5 0 .75 2 3.75 2 4.5 0 .75 2 3.75 2 4.5 0 .75 2 3.75 4.5 0M9 19v-5h6v5" />
        </symbol>
        <symbol id="icon-heart" viewBox="0 0 24 24">
          <path d="M20.8 8.8c0 5.2-8.8 10-8.8 10S3.2 14 3.2 8.8A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8.8 1.8Z" />
        </symbol>
        <symbol id="icon-tool" viewBox="0 0 24 24">
          <path d="m14.7 6.3 3-3a4.5 4.5 0 0 0 0 6.4l-8.9 8.9a2 2 0 1 1-2.8-2.8l8.9-8.9a4.5 4.5 0 0 0 6.4 0l-3 3" />
        </symbol>
        <symbol id="icon-sparkle" viewBox="0 0 24 24">
          <path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3ZM19 16l.6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z" />
        </symbol>
      </defs>

      <rect width="100%" height="100%" fill="url(#suvidha-base-dots)" />

      {clusters.map((cluster, i) => (
        <ellipse
          key={`cluster-${i}`}
          cx={cluster.cx}
          cy={cluster.cy}
          rx={cluster.rx}
          ry={cluster.ry}
          fill="url(#suvidha-glow)"
          transform={`rotate(${cluster.rotation} ${cluster.cx} ${cluster.cy})`}
        />
      ))}

      {routeLines.map((line, i) => (
        <path
          key={i}
          d={line.d}
          stroke="#B11226"
          strokeWidth="1.25"
          strokeDasharray="1 9"
          strokeLinecap="round"
          opacity={line.opacity}
        />
      ))}

      {orbitRings.map((ring, i) => (
        <circle
          key={`ring-${i}`}
          cx={ring.cx}
          cy={ring.cy}
          r={ring.radius}
          stroke={ring.color}
          strokeWidth="0.8"
          strokeDasharray="1 7"
          strokeLinecap="round"
          opacity="0.1"
          transform={`rotate(${ring.rotation} ${ring.cx} ${ring.cy})`}
        />
      ))}

      {waypoints.map((point, i) => (
        <circle
          key={`waypoint-${i}`}
          cx={point.cx}
          cy={point.cy}
          r={point.r}
          fill={i % 4 === 0 ? "#B11226" : "#C89116"}
          opacity={point.opacity}
        />
      ))}

      {iconPlacements.map((placement, i) => (
        <g
          key={`icon-${i}`}
          transform={`translate(${placement.x} ${placement.y}) rotate(${placement.rotation})`}
          opacity={placement.opacity}
          color={placement.color}
        >
          <circle
            r={placement.size * 0.58}
            fill={placement.color}
            opacity="0.08"
          />
          <circle
            r={placement.size * 0.72}
            fill="none"
            stroke={placement.color}
            strokeWidth="0.7"
            strokeDasharray="1 5"
            opacity="0.45"
          />
          <use
            href={`#icon-${placement.icon}`}
            x={-placement.size / 2}
            y={-placement.size / 2}
            width={placement.size}
            height={placement.size}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}
    </svg>
  );
}
