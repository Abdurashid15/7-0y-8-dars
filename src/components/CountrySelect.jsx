import React, { useState, useEffect, useRef } from 'react';
import currencyData from '../assets/country-currency.json'; // Adjust the path to your JSON file

const CurrencyConverter = () => {
  const [selectedCurrencyFrom, setSelectedCurrencyFrom] = useState('');
  const [inputAmount, setInputAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [openOptionsFrom, setOpenOptionsFrom] = useState(false);
  const [valueFrom, setValueFrom] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const allCurrencies = currencyData.map((country) => {
      const currencyCode = country.currencies ? Object.keys(country.currencies)[0] : null;
      if (currencyCode && country.currencies[currencyCode]) {
        return {
          ...country,
          code: currencyCode,
          ...country.currencies[currencyCode],
        };
      }
      return null;
    }).filter((currency) => currency !== null);
    setCurrencies(allCurrencies);
    if (allCurrencies.length > 0) {
      setSelectedCurrencyFrom(allCurrencies[0]);
    }
  }, []);

  const handleAmountChange = (e) => {
    const amount = parseFloat(e.target.value);
    setInputAmount(amount);
    const selectedCurrencyObj = currencies.find((curr) => curr.code === selectedCurrencyFrom.code);
    const rateToUSD = selectedCurrencyObj ? parseFloat(selectedCurrencyObj.rateToUSD) : 1;
    setConvertedAmount(amount * rateToUSD);
  };

  const handleOpenOptionsFrom = () => {
    setOpenOptionsFrom(true);
  };

  const handleSelectFrom = (country) => {
    setSelectedCurrencyFrom(country);
    setOpenOptionsFrom(false);
    setFiltered([]);
    setValueFrom('');
  };

  const handleInputFrom = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setValueFrom(inputValue);
    const filteredData = currencies.filter((fil) => fil.name.toLowerCase().includes(inputValue));
    setFiltered(filteredData);
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      onOutsideClick();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onOutsideClick = () => {
    setOpenOptionsFrom(false);
    setFiltered([]);
    setValueFrom('');
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          <label className="font-semibold" htmlFor="amount">Amount</label>
          <input
            type="number"
            value={inputAmount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className="border rounded p-2 w-40"
          />
        </div>

        <div className="flex flex-col relative">
          <label className="font-semibold" htmlFor="selectFrom">From</label>
          <div
            className="border rounded p-2 flex items-center justify-between cursor-pointer w-64"
            onClick={handleOpenOptionsFrom}
          >
            {openOptionsFrom ? (
              <input
                type="text"
                onChange={handleInputFrom}
                value={valueFrom}
                className="outline-none p-2 rounded"
                placeholder="Type to search..."
              />
            ) : (
              <div className="flex items-center">
                {selectedCurrencyFrom.flag && (
                  <img
                    className="w-5 h-5 mr-2"
                    src={selectedCurrencyFrom.flag}
                    alt={`${selectedCurrencyFrom.name} flag`}
                    width={20}
                  />
                )}
                <span>
                  {selectedCurrencyFrom.currencies && Object.keys(selectedCurrencyFrom.currencies).length > 0
                    ? `${Object.keys(selectedCurrencyFrom.currencies)[0]} - ${selectedCurrencyFrom.currencies[Object.keys(selectedCurrencyFrom.currencies)[0]].name}`
                    : selectedCurrencyFrom.name}
                </span>
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            )}
          </div>
          {openOptionsFrom && (
            <ul className="absolute z-10 bg-white border rounded shadow-lg max-h-60 overflow-auto mt-2 w-64">
              {filtered.length > 0 && valueFrom ? (
                filtered.map((country, index) => (
                  <li key={index} className="flex gap-3 items-center cursor-pointer hover:bg-slate-300 p-2" onClick={() => handleSelectFrom(country)}>
                    <img
                      className="w-5 h-5"
                      src={country.flag}
                      alt={`${country.name} flag`}
                      width={20}
                    />
                    {country.currencies && (
                      <span>
                        {Object.keys(country.currencies).join(', ')} - {Object.values(country.currencies)[0].name}
                      </span>
                    )}
                  </li>
                ))
              ) : (
                currencies.map((country, index) => (
                  <li key={index} onClick={() => handleSelectFrom(country)} className="flex items-center cursor-pointer p-2 hover:bg-slate-300">
                    <img
                      className="w-5 h-5 mr-2"
                      src={country.flag}
                      alt={`${country.name} flag`}
                      width={20}
                    />
                    {country.currencies && (
                      <span>
                        {Object.keys(country.currencies).join(', ')} - {Object.values(country.currencies)[0].name}
                      </span>
                    )}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div className="flex flex-col relative">
          <label className="font-semibold" htmlFor="selectTo">To</label>
          <div className="border rounded p-2 flex items-center justify-between w-64">
            <div className="flex items-center">
              <img
                className="w-5 h-5 mr-2"
                src="path/to/usd-flag.png"
                alt='usd '
                width={20}
              />
              <span>USD - United States Dollar</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="font-bold text-lg">{convertedAmount} USD</p>
      </div>
    </div>
  );
};

export default CurrencyConverter;
