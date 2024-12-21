import React from "react";
import { Card } from './card.js'

function PriceCard() {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 justify-center gap-2 mb-4'>
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
  )
}

export default PriceCard