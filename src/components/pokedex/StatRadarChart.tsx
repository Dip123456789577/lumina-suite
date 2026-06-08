import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface StatItem {
  subject: string;
  A: number;
  fullMark: number;
}

interface StatRadarChartProps {
  stats: {
    hp: number;
    attack: number;
    defense: number;
    "special-attack": number;
    "special-defense": number;
    speed: number;
  };
  color?: string;
}

const formatStatName = (name: string) => {
  switch (name) {
    case "hp":
      return "HP";
    case "attack":
      return "ATK";
    case "defense":
      return "DEF";
    case "special-attack":
      return "SPA";
    case "special-defense":
      return "SPD";
    case "speed":
      return "SPE";
    default:
      return name.toUpperCase();
  }
};

export function StatRadarChart({ stats, color = "#A98FF3" }: StatRadarChartProps) {
  const data: StatItem[] = Object.entries(stats).map(([key, value]) => ({
    subject: formatStatName(key),
    A: value,
    fullMark: 255, // Max base stat is technically 255 (Blissey HP)
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 255]} tick={false} axisLine={false} />
          <Radar name="Stats" dataKey="A" stroke={color} fill={color} fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
