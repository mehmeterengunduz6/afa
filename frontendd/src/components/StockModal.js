import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const PUBLIC_TOKEN = 'pk_Db8lXWjYSgmuij8XOmk7iw'; // Replace with your actual public token
const DEFAULT_FLAG_URL = '/us-flag.svg';

const StockModal = ({ stock, onClose }) => {
  const [data, setData] = useState([]);
  const [isAfaTrueData, setIsAfaTrueData] = useState([]);
  const [isAfaFalseData, setIsAfaFalseData] = useState([]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`https://erengunduzzz.pythonanywhere.com/stocks/${stock.symbol}/`);
        if (response.ok) {
          const result = await response.json();
          
          // Get all unique dates
          const allDates = [...new Set(result.map(item => item.date))].sort();
          
          // Process data for AFA true and false
          const trueData = allDates.map(date => {
            const matchingItem = result.find(item => item.date === date && item.is_AFA === true);
            return {
              date: date,
              weight: matchingItem ? parseFloat(matchingItem.weight) : 0
            };
          });

          const falseData = allDates.map(date => {
            const matchingItem = result.find(item => item.date === date && item.is_AFA === false);
            return {
              date: date,
              weight: matchingItem ? parseFloat(matchingItem.weight) : 0
            };
          });

          setIsAfaTrueData(trueData);
          setIsAfaFalseData(falseData);
        } else {
          console.error('Failed to fetch stock data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (stock) fetchStockData();
  }, [stock]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <motion.div
        className="w-3/5 flex flex-col items-start justify-start bg-white p-6 relative rounded"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={`https://img.logo.dev/ticker/${stock.symbol.toLowerCase()}?token=${PUBLIC_TOKEN}`}
            alt={`${stock.name} logo`}
            className="w-10 h-10 rounded-full"
            onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_FLAG_URL; }}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{stock.symbol}</h2>
            <p className="text-lg text-gray-700">{stock.name}</p>
          </div>
        </div>
        <div className="w-full h-80">
          <ResponsiveContainer>
            <LineChart data={data} margin={{top: 0,right: 40,left: 40,bottom: 20}}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" hide={true} tickLine={false} axisLine={false} tickMargin={8} interval={0} allowDuplicatedCategory={false} tickFormatter={(date) => {
                const options = { month: 'short', year: 'numeric' }
                return new Date(date).toLocaleDateString(undefined, options)
              }} />
              <YAxis 
                hide={true} 
                type='number' 
                domain={[0, dataMax => Math.max(dataMax * 1.1, 0.1)]} 
              />
              <Tooltip />
              <Line type="monotone" dataKey="weight" data={isAfaTrueData} stroke="#e60073" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="weight" data={isAfaFalseData} stroke="#4c4fff" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

StockModal.propTypes = {
  stock: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default StockModal;