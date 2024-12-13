'use client'

import { useState, useEffect } from 'react'
import { StockTable } from '../components/StockTable.js'
<<<<<<< HEAD
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
=======

export default function Home() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/stocks/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        return response.json()
      })
      .then(data => {
        console.log(data)
        setStocks(data)
        setLoading(false)
      })
      .catch(error => {
        setError('Error fetching data. Please try again later.')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>
>>>>>>> origin/main
  }

  return (
    <main className="container mx-auto py-10 bg-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-red-600">Ak Portföy Yabancı Hisse Senedi Fonu (AFA)</h1>
<<<<<<< HEAD
      <StockTable year={parsedYear} month={parsedMonth} />
    </main>
  );
=======
      <StockTable stocks={stocks} />
    </main>
  )
>>>>>>> origin/main
}

