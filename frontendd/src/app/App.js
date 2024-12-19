'use client'

import { useState, useEffect } from 'react'
import { StockTable } from '../components/StockTable.js'
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to="/2024/11" />} />
      <Route path='/:year/:month' element={<Home />} />
    </Routes>
  )
}

function Home() {
  const { year, month } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setLoading(false);
  }, [year, month]);

  const parsedYear = parseInt(year, 10);
  const parsedMonth = parseInt(month, 10);

  if (isNaN(parsedYear) || isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
    return <div className="text-center mt-8 text-red-500">Invalid year or month</div>;
  }

  const dummyData = [
    { date: '2024-07-01', spPrice: 545.34, afaPrice: 0.019 },
    { date: '2024-08-01', spPrice: 543.01, afaPrice: 0.019 },
    { date: '2024-09-01', spPrice: 552.08, afaPrice: 0.0189 },
    { date: '2024-10-01', spPrice: 568.62, afaPrice: 0.0192 },
    { date: '2024-11-01', spPrice: 571.04, afaPrice: 0.0193 },
    { date: '2024-12-01', spPrice: 603.63, afaPrice: 0.02 }
  ]

  return (
    <main className="container mx-auto py-8 bg-white">
      <div className='flex justify-center space-x-2 mb-4'>
        <h1 className='text-3xl font-bold text-red-600'>AFA</h1>
        <h1 className='text-3xl font-bold text-gray-900'>vs</h1>
        <h1 className='text-3xl font-bold text-blue-600'>S&P 500</h1>
      </div>
      <div className='max-w-2xl h-80 mx-auto flex items-center justify-center'>
        <ResponsiveContainer>
          <LineChart data={dummyData} margin={{ top: 8, right: 40, left: 40, bottom: 0 }}>
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} interval={0} allowDuplicatedCategory={false} tickFormatter={(date) => { const options = { month: 'short', year: 'numeric' }; return new Date(date).toLocaleDateString(undefined, options); }} />
            <YAxis yAxisId='afa' hide={true} orientation='left' type='number' domain={[0.01,0.025]} />
            <YAxis yAxisId='sp' hide={true} orientation='right' type='number' domain={[250,750]} />
            <Tooltip />
            <Line yAxisId='afa' type='monotone' dataKey='afaPrice' stroke='#e60073' strokeWidth={3} dot={false} />
            <Line yAxisId='sp' type='monotone' dataKey='spPrice' stroke='#4c4fff' strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <StockTable year={parsedYear} month={parsedMonth} />
    </main>
  );
}

