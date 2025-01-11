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
  const month = 12;
  const [oldestDate, setOldestDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch('https://erengunduzzz.pythonanywhere.com/price/');
        if (!response.ok) {
          throw new Error('Failed to fetch price data');
        }
        const data = await response.json();
        
        if (data.length > 0) {
          const dates = data.map(item => new Date(item.date));
          const oldest = new Date(Math.min(...dates));
          const options = {month: 'long', year: 'numeric'};
          setOldestDate(oldest.toLocaleDateString('tr-TR', options));
        } else {
          setOldestDate('No data available');
        }
      } catch (error) {
        console.error('Error fetching price data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
  }, []);

  if(loading) {
    return <div>Loading...</div>
  }

  return (
    <main className="container mx-auto py-8 bg-white">
      <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Header />
          <h1 className='text-xl font-bold'>{oldestDate}'ten beri Getiri:</h1>
          <MainLineChart />
          <PriceCard />
          <StockTable year={year} month={month} />
        </div>
      </div>
    </main>
  );
}

