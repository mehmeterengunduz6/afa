import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const PUBLIC_TOKEN = 'pk_Db8lXWjYSgmuij8XOmk7iw'; // Replace with your actual public token
const DEFAULT_FLAG_URL = '/us-flag.svg';

const StockModal = ({ stock, onClose }) => {
  useEffect(() => {
    // Any additional logic can be added here if needed
  }, [stock]);

  const data = Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    price: Math.floor(Math.random() * 100),
  }));

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
            <LineChart data={data}>
              <XAxis dataKey="month" />
              <YAxis hide={true} />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#000" strokeWidth={3} />
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
