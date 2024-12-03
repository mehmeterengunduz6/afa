'use client'

import { useState, useEffect } from 'react'
import { StockTable } from '../components/StockTable.js'

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
  }

  return (
    <main className="container mx-auto py-10 bg-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-red-600">Ak Portföy Yabancı Hisse Senedi Fonu (AFA)</h1>
      <StockTable stocks={stocks} />
    </main>
  )
}

