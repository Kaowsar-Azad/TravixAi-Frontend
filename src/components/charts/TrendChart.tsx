"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function TrendChart({ basePrice = 1000, currencySymbol = "$" }: { basePrice?: number; currencySymbol?: string }) {
  const data = [
    { month: 'Jan', price: Math.round(basePrice * 1.0) },
    { month: 'Feb', price: Math.round(basePrice * 0.9) },
    { month: 'Mar', price: Math.round(basePrice * 0.8) },
    { month: 'Apr', price: Math.round(basePrice * 0.85) },
    { month: 'May', price: Math.round(basePrice * 1.15) },
    { month: 'Jun', price: Math.round(basePrice * 1.4) },
    { month: 'Jul', price: Math.round(basePrice * 1.5) },
  ];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3E7C74" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3E7C74" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4DCC9" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B6F76', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B6F76', fontSize: 12 }}
            tickFormatter={(value) => `${currencySymbol}${value}`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => [`${currencySymbol}${value}`, 'Avg Price']}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#3E7C74" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
