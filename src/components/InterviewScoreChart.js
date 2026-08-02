"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function scoreColor(score) {
  if (score >= 75) return "var(--success)";
  if (score >= 50) return "var(--warning)";
  return "var(--danger)";
}

export default function InterviewScoreChart({ score, answeredCount }) {
  const data = [
    { name: "Score attained", value: score },
    { name: "Gap to close", value: 100 - score },
  ];

  const filledColor = scoreColor(score);

  return (
    <div className="relative h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius="70%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            <Cell fill={filledColor} />
            <Cell fill="var(--border)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-mono text-3xl font-semibold text-ink">
          {score}
        </span>
        <span className="text-xs text-ink-secondary">avg / 100</span>
        <span className="text-xs text-ink-secondary mt-1">
          {answeredCount} answered
        </span>
      </div>
    </div>
  );
}
