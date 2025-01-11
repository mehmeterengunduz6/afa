import React from "react";

function Header() {
    return (
        <div className='flex justify-center space-x-2 mb-4'>
            <h1 className='text-3xl font-bold text-red-600'>AFA</h1>
            <h1 className='text-3xl font-bold vs-text'>vs</h1>
            <h1 className='text-3xl font-bold text-blue-600'>S&P 500</h1>
        </div>
    );
}

export default Header;