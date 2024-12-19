'use client'

import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Card } from "./ui/card"
import StockModal from './StockModal'
import { motion } from 'motion/react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PUBLIC_TOKEN = 'pk_Db8lXWjYSgmuij8XOmk7iw'; // Replace with your actual public token
const DEFAULT_FLAG_URL = '/us-flag.svg';

export function StockTable({ year, month }) {
  const [currentStocks, setCurrentStocks] = useState([]);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [cardPosition, setCardPosition] = useState(null);
  const observer = useRef();

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/${year}/${month}/`);
        if (response.redirected) {
          window.location.href = response.url;
        } else {
          const data = await response.json();
          const filteredData = data.filter(stock => stock.is_AFA === true);
          setCurrentStocks(filteredData);
        }
      } catch (error) {
        console.error('Error fetching stocks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [year, month]);

  const loadMoreStocks = () => {
    if (loading) return;
    setLoading(true);
    const newStocks = currentStocks.slice(currentStocks.length, currentStocks.length + itemsPerPage);
    setCurrentStocks(prev => [...prev, ...newStocks]);
    setLoading(false);
  };

  const lastStockElementRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMoreStocks();
      }
    });
    if (node) observer.current.observe(node);
  };

  const handleCardClick = (stock, cardElement) => {
    const { top, left, width, height } = cardElement.getBoundingClientRect();
    setCardPosition({ top, left, width, height });
    setSelectedStock(stock);
  };

  const handleCloseModal = () => {
    setSelectedStock(null);
    setCardPosition(null);
  };

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
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className='flex justify-center space-x-2 mb-4'>
          <h1 className='text-3xl font-bold text-red-600'>AFA</h1>
          <h1 className='text-3xl font-bold text-gray-900'>vs</h1>
          <h1 className='text-3xl font-bold text-blue-600'>S&P 500</h1>
        </div>
        <div className='max-w-4xl h-80 mx-auto flex items-center justify-center mb-4'>
          <ResponsiveContainer>
            <LineChart data={perc_data} margin={{ top: 8, right: 40, left: 40, bottom: 0 }}>
              <XAxis dataKey="date" hide={true} tickLine={false} axisLine={false} tickMargin={8} interval={0} allowDuplicatedCategory={false} tickFormatter={(date) => { const options = { month: 'short', year: 'numeric' }; return new Date(date).toLocaleDateString(undefined, options); }} />
              <YAxis yAxisId='afa' hide={true} orientation='left' type='number' domain={[-10, 10]} />
              <YAxis yAxisId='sp' hide={true} orientation='right' type='number' domain={[-10, 10]} />
              <Tooltip />
              <Line yAxisId='afa' type='monotone' dataKey='afaPrice' stroke='#e60073' strokeWidth={3} dot={false} />
              <Line yAxisId='sp' type='monotone' dataKey='spPrice' stroke='#4c4fff' strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className='grid grid-cols-4 justify-center gap-2 mb-4'>
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
          <Card className='p-3 text-center'>
            <h1 className='text-sm font-bold'>
              1 year
            </h1>
            <p className='text-sm'>
              AFA: %27.65
            </p>
            <p className='text-sm'>
              S&P 500: %24.04
            </p>
          </Card><Card className='p-3 text-center'>
            <h1 className='text-sm font-bold'>
              3 year
            </h1>
            <p className='text-sm'>
              AFA: %23.55
            </p>
            <p className='text-sm'>
              S&P 500: %42.5
            </p>
          </Card><Card className='p-3 text-center'>
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
        <div className='flex items-baseline space-x-1 text-center mb-8'>
          <h1 className="text-xl font-bold text-gray-900">AFA Portföy Dağılımı: {year}-{month}</h1>
          <h1 className='text-sm font-semibold text-gray-400'>(Last Updated: 05/12/2024)</h1>
        </div>
        <div className="flex flex-wrap -m-2">
          {currentStocks.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleCardClick(stock, e.currentTarget)}
              className='w-full sm:w-1/2 px-2 mb-4'
            >
              <Card className="p-6 flex items-center cursor-pointer" ref={index === currentStocks.length - 1 ? lastStockElementRef : null}>
                <div className="mr-4">
                  <Card className="w-10 h-10 flex items-center justify-center bg-white rounded-full">
                    <span className="text-lg font-semibold text-black">{index + 1}</span>
                  </Card>
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-4">
                    <img
                      src={`https://img.logo.dev/ticker/${stock.symbol.toLowerCase()}?token=${PUBLIC_TOKEN}`}
                      alt={`${stock.name} logo`}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_FLAG_URL; }}
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{stock.symbol}</h2>
                      <p className="text-sm text-gray-500 whitespace-nowrap ">{stock.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{stock.weight.toFixed(2)}%</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        {loading && <div className="text-center mt-4">Loading more stocks...</div>}
      </div>
      {selectedStock && <StockModal stock={selectedStock} onClose={handleCloseModal} cardPosition={cardPosition} />}
    </div>
  )
}

StockTable.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
}

