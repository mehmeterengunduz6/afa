import React, { useEffect, useState } from "react";
import { Card } from './card.js';

function PriceCard() {
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch('https://erengunduzzz.pythonanywhere.com/price/');
        if (!response.ok) {
          throw new Error('Failed to fetch price data');
        }
        const data = await response.json();
        calculatePercentageChanges(data);
      } catch (error) {
        console.error('Error fetching price data:', error);
      } finally {
        setLoading(false);
      }
    };

    const calculatePercentageChanges = (data) => {
      const latestPrice = data[data.length - 1]; // Assuming the last entry is the latest
      const calculatedData = {};

      const monthsAgo = [1, 3, 6, 12]; // 1 month, 3 months, 6 months, 1 year
      monthsAgo.forEach(month => {
        const targetDate = new Date(latestPrice.date);
        targetDate.setMonth(targetDate.getMonth() - month);
        const targetPrice = data.find(item => new Date(item.date).getTime() === targetDate.getTime());

        if (targetPrice) {
          const percentageChangeAFA = ((latestPrice.afaPrice - targetPrice.afaPrice) / targetPrice.afaPrice) * 100;
          const percentageChangeSP500 = ((latestPrice.spPrice - targetPrice.spPrice) / targetPrice.spPrice) * 100;

          calculatedData[`${month}_month`] = {
            AFA: percentageChangeAFA.toFixed(2),
            SP500: percentageChangeSP500.toFixed(2),
          };
        }
      });

      setPriceData(calculatedData);
    };

    fetchPriceData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 justify-center gap-2 mb-4'>
      {Object.keys(priceData).map((key) => {
        const { AFA, SP500 } = priceData[key];
        return (
          <Card className='p-3 text-center price-card' key={key}>
            <h1 className='text-sm font-bold card-title'>
              {key.replace('_month', ' ay')}
            </h1>
            <p className='text-sm card-afa-text'>
              AFA: {AFA}%
            </p>
            <p className='text-sm card-sp500-text'>
              S&P 500: {SP500}%
            </p>
          </Card>
        );
      })}
    </div>
  );
}

export default PriceCard;