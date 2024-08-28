  import React, { useState, useEffect, useRef } from "react";
  import currencyData from "../assets/country-currency.json"; 

  const CurrencyConverter = () => {
    const [selectedCurrencyFrom, setSelectedCurrencyFrom] = useState("");
    const [inputAmount, setInputAmount] = useState(0);
    const [convertedAmount, setConvertedAmount] = useState(0);
    const [rateToUSD, setRateToUSD] = useState(1);
    const [rateToSelectedCurrency, setRateToSelectedCurrency] = useState(1);
    const [currencies, setCurrencies] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [openOptionsFrom, setOpenOptionsFrom] = useState(false);
    const [valueFrom, setValueFrom] = useState("");
    const wrapperRef = useRef(null);
    const [showResult, setShowResult] = useState(false); 
    useEffect(() => {
      const allCurrencies = currencyData
        .map((country) => {
          const currencyCode = country.currencies
            ? Object.keys(country.currencies)[0]
            : null;
          if (currencyCode && country.currencies[currencyCode]) {
            return {
              ...country,
              code: currencyCode,
              ...country.currencies[currencyCode],
            };
          }
          return null;
        })
        .filter((currency) => currency !== null);
      setCurrencies(allCurrencies);
      if (allCurrencies.length > 0) {
        setSelectedCurrencyFrom(allCurrencies[0]);
      }
    }, []);

    const handleAmountChange = (e) => {
      const amount = parseFloat(e.target.value);
      setInputAmount(amount);
    };

    const handleConvert = () => {
      setShowResult(true); 
      const selectedCurrencyObj = currencies.find(
        (curr) => curr.code === selectedCurrencyFrom.code
      );
      const rateToUSD = selectedCurrencyObj
        ? parseFloat(selectedCurrencyObj.rateToUSD)
        : 1;

      setConvertedAmount(inputAmount * rateToUSD);
      setRateToUSD(rateToUSD);
      setRateToSelectedCurrency(1 / rateToUSD);
    };

    const handleOpenOptionsFrom = () => {
      setOpenOptionsFrom(true);
    };

    const handleSelectFrom = (country) => {
      setSelectedCurrencyFrom(country);
      setOpenOptionsFrom(false);
      setFiltered([]);
      setValueFrom("");
    };

    const handleInputFrom = (e) => {
      const inputValue = e.target.value.toLowerCase();
      setValueFrom(inputValue);
      const filteredData = currencies.filter((fil) =>
        fil.name.toLowerCase().includes(inputValue)
      );
      setFiltered(filteredData);
    };

    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        onOutsideClick();
      }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const onOutsideClick = () => {
      setOpenOptionsFrom(false);
      setFiltered([]);
      setValueFrom("");
    };

    return (
      <div className="flex flex-col items-center  space-y-4 mt-36">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <label className="font-semibold" htmlFor="amount">
              Amount
            </label>
            <input
              type="number"
              value={inputAmount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="border rounded p-3 w-40 outline-slate-300"
            />
          </div>

          <div className="flex flex-col relative">
            <label className="font-semibold" htmlFor="selectFrom">
              From{" "}
            </label>
            <div
              className="border rounded p-3 flex items-center justify-between cursor-pointer w-80"
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
                    {selectedCurrencyFrom.currencies &&
                    Object.keys(selectedCurrencyFrom.currencies).length > 0
                      ? `${Object.keys(selectedCurrencyFrom.currencies)[0]} - ${
                          selectedCurrencyFrom.currencies[
                            Object.keys(selectedCurrencyFrom.currencies)[0]
                          ].name
                        }`
                      : selectedCurrencyFrom.name}
                  </span>
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              )}
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 9-7 7-7-7"
                />
              </svg>
            </div>
            {openOptionsFrom && (
              <ul className="absolute z-10 bg-white border rounded shadow-lg max-h-60 overflow-auto mt-2 w-80 ">
                {filtered.length > 0 && valueFrom
                  ? filtered.map((country, index) => (
                      <li
                        key={index}
                        className="flex gap-3 items-center cursor-pointer hover:bg-slate-300 p-2"
                        onClick={() => handleSelectFrom(country)}
                      >
                        <img
                          className="w-5 h-5"
                          src={country.flag}
                          alt={`${country.name} flag`}
                          width={20}
                        />
                        {country.currencies && (
                          <span>
                            {Object.keys(country.currencies).join(", ")} -{" "}
                            {Object.values(country.currencies)[0].name}
                          </span>
                        )}
                      </li>
                    ))
                  : currencies.map((country, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectFrom(country)}
                        className=" w-72 flex items-center cursor-pointer p-2 hover:bg-slate-300"
                      >
                        <img
                          className="w-5 h-5 mr-2"
                          src={country.flag}
                          alt={`${country.name} flag`}
                          width={20}
                        />
                        {country.currencies && (
                          <span>
                            {Object.keys(country.currencies).join(", ")} -{" "}
                            {Object.values(country.currencies)[0].name}
                          </span>
                        )}
                      </li>
                    ))}
              </ul>
            )}
          </div>
          <div className="rounded-3xl p-2 mt-4  border-slate-300 cursor-pointer transition-all active:bg-gray-200">
            <svg
              className="w-[30px] h-[30px] text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="0.8"
                d="M4 16h13M4 16l4-4m-4 4 4 4M20 8H7m13 0-4 4m4-4-4-4"
              />
            </svg>
          </div>
          <div className="flex flex-col relative">
            <label className="font-semibold" htmlFor="selectTo">
              To
            </label>
            <div className="border rounded p-3 flex items-center justify-between w-72 cursor-pointer">
              <div className="flex items-center ">
                <img
                  className="w-5 h-5 mr-2"
                  src="https://flagcdn.com/w320/us.png"
                  alt="usd "
                  width={20}
                />
                <span>USD - United States Dollar</span>
              </div>
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 9-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

    <div className="flex items-center justify-between w-1/2 ">
        {showResult && 
        <div className=" transition-opacity duration-1000 ease-in-out opacity-80 flex flex-col gap-4">
          <p>{inputAmount} {selectedCurrencyFrom.code} =</p>
          <h2 className=" font-semibold text-6xl text-gray-700">{convertedAmount.toFixed(2)} USD</h2>
          <p className="text-sm">
            1 {selectedCurrencyFrom.code} = {rateToUSD.toFixed(4)} USD
          </p>
          <p className="text-sm">
            1 USD = {rateToSelectedCurrency.toFixed(4)}{" "}
            {selectedCurrencyFrom.code}
          </p>
        </div>}
        <button
          onClick={handleConvert}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
        >
          Convert
        </button>
        </div>
      </div>
    );
  };

  export default CurrencyConverter;
