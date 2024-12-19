'use client'

import { useState, useEffect } from 'react'
import { StockTable } from '../components/StockTable.js'
import { Routes, Route, useParams, Navigate } from 'react-router-dom';

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

 

  return (
    <main className="container mx-auto py-8 bg-white">
      <StockTable year={parsedYear} month={parsedMonth} />
    </main>
  );
}

