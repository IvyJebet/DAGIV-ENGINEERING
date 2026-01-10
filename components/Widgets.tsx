import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const dataCost = [
  { name: 'Jan', maintenance: 4000, fuel: 2400 },
  { name: 'Feb', maintenance: 3000, fuel: 1398 },
  { name: 'Mar', maintenance: 2000, fuel: 9800 },
  { name: 'Apr', maintenance: 2780, fuel: 3908 },
  { name: 'May', maintenance: 1890, fuel: 4800 },
  { name: 'Jun', maintenance: 2390, fuel: 3800 },
];

const dataStatus = [
  { name: 'Active', value: 12 },
  { name: 'Idle', value: 3 },
  { name: 'Maintenance', value: 2 },
  { name: 'Transit', value: 1 },
];

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6'];

export const CostChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={dataCost} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
      <XAxis dataKey="name" stroke="#94a3b8" />
      <YAxis stroke="#94a3b8" />
      <Tooltip 
        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} 
        itemStyle={{ color: '#f8fafc' }}
      />
      <Legend />
      <Bar dataKey="fuel" stackId="a" fill="#eab308" name="Fuel (KES)" />
      <Bar dataKey="maintenance" stackId="a" fill="#64748b" name="Maintenance (KES)" />
    </BarChart>
  </ResponsiveContainer>
);

export const FleetStatusChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={dataStatus}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
      >
        {dataStatus.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
      <Legend verticalAlign="bottom" height={36}/>
    </PieChart>
  </ResponsiveContainer>
);

export const UptimeChart = () => (
  <ResponsiveContainer width="100%" height={200}>
     <LineChart data={[
         {name: 'W1', uptime: 98}, {name: 'W2', uptime: 96}, {name: 'W3', uptime: 99}, {name: 'W4', uptime: 92}
     ]}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis domain={[80, 100]} stroke="#94a3b8" />
        <Tooltip contentStyle={{ backgroundColor: '#0f172a' }} />
        <Line type="monotone" dataKey="uptime" stroke="#eab308" strokeWidth={3} dot={{r: 4}} />
     </LineChart>
  </ResponsiveContainer>
);