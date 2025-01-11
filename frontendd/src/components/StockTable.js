'use client'

import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Card } from "./ui/card"
import StockModal from './StockModal'
import { motion } from 'motion/react'

const PUBLIC_TOKEN = 'pk_Db8lXWjYSgmuij8XOmk7iw'; // Replace with your actual public token
const DEFAULT_FLAG_URL = '/us-flag.svg';

export function StockTable({ year, month }) {
  const [currentStocks, setCurrentStocks] = useState([]);
  const [previousStocks, setPreviousStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [cardPosition, setCardPosition] = useState(null);
  const observer = useRef();

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://erengunduzzz.pythonanywhere.com/${year}/${month}/`);
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

    const fetchPreviousMonthStocks = async () => {
      const previousMonth = month === 1 ? 12 : month - 1;
      const previousYear = month === 1 ? year - 1 : year
      try {
        const response = await fetch(`https://erengunduzzz.pythonanywhere.com/${previousYear}/${previousMonth}/`)
        if (response.redirected) {
          window.location.href = response.url
        } else {
          const data = await response.json()
          const filteredData = data.filter(stock => stock.is_AFA === true)
          setPreviousStocks(filteredData)
        }
      } catch (error) {
        console.error('Error fetching previous stocks', error);
      }
    }

    fetchStocks();
    fetchPreviousMonthStocks()
  }, [year, month]);

  const calculatePercentageChange = (currentWeight, previousWeight) => {
    if (previousWeight === 0) return 0
    return ((currentWeight - previousWeight) / previousWeight) * 100
  }

  const getWeightChangeColor = (change) => {
    return change > 0 ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100'
  }

  const handleCardClick = (stock, cardElement) => {
    const { top, left, width, height } = cardElement.getBoundingClientRect();
    setCardPosition({ top, left, width, height });
    setSelectedStock(stock);
  };

  const handleCloseModal = () => {
    setSelectedStock(null);
    setCardPosition(null);
  };

  const formatDate = () => {
    const date = new Date(year, month - 1);
    const options = {month: 'long', year: 'numeric'};
    return date.toLocaleDateString('tr-TR', options);
  }

  return (
    <div>
      <div>
        <div className='flex items-baseline space-x-1 text-center mb-8'>
          <h1 className="text-xl font-bold text-gray-900 text-afa">AFA Portföy Dağılımı: {formatDate(year, month)}</h1>
          <h1 className='text-sm font-semibold text-gray-400 text-update'>(Last Updated: 07/01/2025)</h1>
        </div>
        <div className="flex flex-wrap -m-2">
          {currentStocks.map((stock, index) => {
            const previousStock = previousStocks.find(s => s.symbol === stock.symbol);
            const previousWeight = previousStock ? previousStock.weight : 0;
            const change = calculatePercentageChange(stock.weight, previousWeight);
            const changeColor = getWeightChangeColor(change);
            return (
              <motion.div
                key={stock.symbol}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleCardClick(stock, e.currentTarget)}
                className='w-full sm:w-1/2 px-2 mb-4'
              >
                <Card className="p-6 flex items-center cursor-pointer card-stock">
                  <div className="mr-4">
                    <Card className="w-10 h-10 flex items-center justify-center bg-white rounded-full">
                      <span className="text-lg font-semibold text-black text-number">{index + 1}</span>
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
                        <p className="text-sm text-gray-500 whitespace-nowrap">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center text-xs font-medium ${changeColor} p-1 rounded-md`}>
                        <span>%{change.toFixed(2)}</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 mt-1 text-number">%{stock.weight.toFixed(2)}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
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

