'use client'

import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Card } from "./ui/card"
import { Percentage } from './ui/percentage'
import StockModal from './StockModal'
import { motion } from 'motion/react'

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
          setCurrentStocks(data);
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

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-red-600 mb-8">Stocks for {year}-{month}</h1>
        <div className="space-y-4">
          {currentStocks.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleCardClick(stock, e.currentTarget)}
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
                      <p className="text-sm text-gray-500">{stock.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{stock.weight.toFixed(2)}%</p>
                    <Percentage value={stock.weight} className="w-24" />
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

