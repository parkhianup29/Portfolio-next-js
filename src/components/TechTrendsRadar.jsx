import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Example data format (customize your tech trends & scores)
const data = [
  { trend: 'React', score: 9 },
  { trend: 'AI/ML', score: 7 },
  { trend: 'Accessibility', score: 7 },
  { trend: 'Next.js', score: 6 },
  { trend: 'Docker', score: 5 },
  { trend: 'Vite', score: 8 },
];

const TechTrendsRadar = () => (
  <div style={{ marginTop: 24 }}>
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="trend" />

        <Radar name="Interest Level" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Tooltip />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

export default TechTrendsRadar;
