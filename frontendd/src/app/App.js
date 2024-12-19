'use client'

import { useState, useEffect } from 'react'
import { StockTable } from '../components/StockTable.js'
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card } from '../components/ui/card.js';

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

  const perc_data = dummyData.map((item, index) => {
    if (index === 0) {
      return { date: item.date, spPrice: 0, afaPrice: 0 }; // First month is 0% change
    } else {
      const prevA = dummyData[index - 1].spPrice;
      const prevB = dummyData[index - 1].afaPrice;
      return {
        date: item.date,
        spPrice: (((item.spPrice - prevA) / prevA) * 100).toFixed(2),
        afaPrice: (((item.afaPrice - prevB) / prevB) * 100).toFixed(2)
      };
    }
  });

  return (
    <main className="container mx-auto py-8 bg-white">
      <div className='flex justify-center space-x-2 mb-4'>
        <h1 className='text-3xl font-bold text-red-600'>AFA</h1>
        <h1 className='text-3xl font-bold text-gray-900'>vs</h1>
        <h1 className='text-3xl font-bold text-blue-600'>S&P 500</h1>
      </div>
      <div className='max-w-2xl h-80 mx-auto flex items-center justify-center mb-4'>
        <ResponsiveContainer>
          <LineChart data={perc_data} margin={{ top: 8, right: 40, left: 40, bottom: 0 }}>
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} interval={0} allowDuplicatedCategory={false} tickFormatter={(date) => { const options = { month: 'short', year: 'numeric' }; return new Date(date).toLocaleDateString(undefined, options); }} />
            <YAxis yAxisId='afa' hide={true} orientation='left' type='number' domain={[-100, 100]} />
            <YAxis yAxisId='sp' hide={true} orientation='right' type='number' domain={[-100, 100]} />
            <Tooltip />
            <Line yAxisId='afa' type='monotone' dataKey='afaPrice' stroke='#e60073' strokeWidth={3} dot={false} />
            <Line yAxisId='sp' type='monotone' dataKey='spPrice' stroke='#4c4fff' strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className='flex justify-center gap-8'>
        <Card className='p-3 text-center'>
          <h1 className='text-sm font-bold'>
            6 month
          </h1>
          <p className='text-sm'>
            AFA: %12
          </p>
          <p className='text-sm'>
            S&P 500: %7.71
          </p>
        </Card>
        <Card className='p-3 text-center w-36'>
          <h1 className='text-sm font-bold'>
            1 year
          </h1>
          <p className='text-sm'>
            AFA: %27.65
          </p>
          <p className='text-sm'>
            S&P 500: %24.04
          </p>
        </Card><Card className='p-3 text-center w-36'>
          <h1 className='text-sm font-bold'>
            3 year
          </h1>
          <p className='text-sm'>
            AFA: %23.55
          </p>
          <p className='text-sm'>
            S&P 500: %42.5
          </p>
        </Card><Card className='p-3 text-center w-36'>
          <h1 className='text-sm font-bold'>
            5 year
          </h1>
          <p className='text-sm'>
            AFA: %75.32
          </p>
          <p className='text-sm'>
            S&P 500: %82.44
          </p>
        </Card>
      </div>
      <StockTable year={parsedYear} month={parsedMonth} />
    </main>
  );
}

