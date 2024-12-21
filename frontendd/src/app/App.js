'use client'

import { useState, useEffect } from 'react'
import { StockTable } from '../components/StockTable.js'
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/ui/Header'
import PriceCard from '../components/ui/PriceCard'
import MainLineChart from '../components/ui/MainLineChart'

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  )
}

function Home() {
  const year = 2024;
  const month = 11;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setLoading(false);
  }, []);

  return (
    <main className="container mx-auto py-8 bg-white">
      <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Header />
          <MainLineChart />
          <PriceCard />
          <StockTable year={year} month={month} />
        </div>
      </div>
    </main>
  );
}

