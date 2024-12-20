import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const dummyData = [
    { date: '2024-01-01', spPrice: 472.65, afaPrice: 0.0163 },
    { date: '2024-02-01', spPrice: 489.20, afaPrice: 0.0168 },
    { date: '2024-03-01', spPrice: 512.85, afaPrice: 0.0174 },
    { date: '2024-04-01', spPrice: 522.36, afaPrice: 0.0178 },
    { date: '2024-05-01', spPrice: 500.35, afaPrice: 0.0173 },
    { date: '2024-06-01', spPrice: 527.8, afaPrice: 0.0178 },
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
        const firstSp = dummyData[0].spPrice;
        const firstAfa = dummyData[0].afaPrice;
        return {
            date: item.date,
            spPrice: (((item.spPrice - firstSp) / firstSp) * 100).toFixed(2),
            afaPrice: (((item.afaPrice - firstAfa) / firstAfa) * 100).toFixed(2)
        };
    }
});


function MainLineChart() {
    return (
        <div className='max-w-4xl h-80 mx-auto flex items-center justify-center mb-4'>
            <ResponsiveContainer>
                <LineChart data={perc_data} margin={{ top: 8, right: 40, left: 40, bottom: 0 }}>
                    <XAxis dataKey="date" hide={true} tickLine={false} axisLine={false} tickMargin={8} interval={0} allowDuplicatedCategory={false} tickFormatter={(date) => { const options = { month: 'short', year: 'numeric' }; return new Date(date).toLocaleDateString(undefined, options); }} />
                    <YAxis yAxisId='afa' hide={true} orientation='left' type='number' domain={[-10, 50]} />
                    <YAxis yAxisId='sp' hide={true} orientation='right' type='number' domain={[-10, 50]} />
                    <Tooltip />
                    <Line yAxisId='afa' type='monotone' dataKey='afaPrice' stroke='#e60073' strokeWidth={3} dot={false} />
                    <Line yAxisId='sp' type='monotone' dataKey='spPrice' stroke='#4c4fff' strokeWidth={3} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default MainLineChart