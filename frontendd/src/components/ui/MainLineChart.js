import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function MainLineChart() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`https://erengunduzzz.pythonanywhere.com/price/`)
                if (!response.ok) {
                    throw new Error(`HTTP error. Status ${response.status}`)
                }
                const jsonData = await response.json()
                const percData = jsonData.map((item, index) => {
                    if (index === 0) {
                        return { date: item.date, spPrice: 0, afaPrice: 0 }; // First month is 0% change
                    } else {
                        const firstSp = jsonData[0].spPrice;
                        const firstAfa = jsonData[0].afaPrice;
                        return {
                            date: item.date,
                            spPrice: (((item.spPrice - firstSp) / firstSp) * 100).toFixed(2),
                            afaPrice: (((item.afaPrice - firstAfa) / firstAfa) * 100).toFixed(2)
                        };
                    }
                });
                setData(percData)
            } catch (error) {
                console.error('Error fetching data', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return <div>Loading...</div>;
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const date = new Date(payload[0].payload.date);
            const options = { month: 'long', year: 'numeric' };
            const formattedDate = date.toLocaleDateString('tr-TR', options);
            return (
                <div className="tooltip p-2 border rounded bg-white shadow-lg">
                    <p style={{ fontWeight: 'bold' }}>{formattedDate} ($)</p>
                    <p style={{ color: '#e60073' }}>AFA Getiri: {payload[0].payload.afaPrice}%</p>
                    <p style={{ color: '#4c4fff' }}>S&P Getiri: {payload[0].payload.spPrice}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className='max-w-4xl h-80 mx-auto flex items-center justify-center mb-4'>
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 8, right: 40, left: 40, bottom: 0 }}>
                    <XAxis dataKey="date" hide={true} tickLine={false} axisLine={false} tickMargin={8} interval={0} allowDuplicatedCategory={false} tickFormatter={(date) => { const options = { month: 'short', year: 'numeric' }; return new Date(date).toLocaleDateString(undefined, options); }} />
                    <YAxis yAxisId='afa' hide={true} orientation='left' type='number' domain={[-10, 50]} />
                    <YAxis yAxisId='sp' hide={true} orientation='right' type='number' domain={[-10, 50]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line yAxisId='afa' type='monotone' dataKey='afaPrice' stroke='#e60073' strokeWidth={3} dot={false} />
                    <Line yAxisId='sp' type='monotone' dataKey='spPrice' stroke='#4c4fff' strokeWidth={3} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default MainLineChart