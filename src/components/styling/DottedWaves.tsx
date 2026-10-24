
const segments = Array.from({ length: 180 }, (_, i) => {
  const random = (n: number) => {
    const value = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return value - Math.floor(value);
  };

  const x = random(1) * 1440;
  const y = random(2) * 900;
  const length = 4 + random(3) * 18;
  const curve = (random(4) - 0.5) * 12;
  const endY = (random(5) - 0.5) * 10;

  return {
    d: `M ${x} ${y} q ${length / 2} ${curve} ${length} ${endY}`,
    opacity: 0.15 + random(6) * 0.25,
  };
});

export default function DottedWaves() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 z-0 h-screen w-full text-black/30"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      {segments.map((segment, i) => (
        <path
          key={i}
          d={segment.d}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={segment.opacity}
        />
      ))}
    </svg>
  );
}
