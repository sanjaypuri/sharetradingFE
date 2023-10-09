import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function Home() {

  const token = sessionStorage.getItem("spbysptoken")
  const tokenHeader = {
    headers: {
      'token': token
    }
  }
  const dataUrl = "http://localhost:5000/api/portfolio"
  const apiUrl = "https://www.alphavantage.co/query"

  const [portfolio, setPortfolio] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [profit, setProfit] = useState([]);
  const [totalGain, setTotalGain] = useState(0);
  // const [list, setList] = useState([{"id":""}]);
  // const [current, setCurrent] = useState([]);

  const fetchapidata = async (item) => {
    const apiParams = {
      params: {
        function: 'TIME_SERIES_DAILY',
        apikey: 'YSX0K9U097FUH83Z',
        symbol: item.symbol,
      },
    };
    try {
      const response = await axios.get(apiUrl, apiParams);
      if (!response.data || !response.data["Time Series (Daily)"]) {
        throw new Error("Data not available");
      }
      const datesArray = Object.keys(response.data["Time Series (Daily)"]);
      datesArray.sort((a, b) => new Date(b) - new Date(a));
      const mostRecentDate = datesArray[0];
      let closingValue = response.data["Time Series (Daily)"][mostRecentDate]["4. close"];
      return closingValue;
    } catch(err) {
      console.error(`Error fetching data`, err);
    }
  };

  const getData = async () => {
    const res = await axios.get(dataUrl, tokenHeader);
    if (!res.data.success) {
      toast.error(res.data.error);
    } else {
      let portfolioData = res.data.portfolio
      let transactionsData = res.data.transactions
      let gainData = res.data.gain
      let marketData = portfolioData.map(item => fetchapidata(item));
      let closingValues = await Promise.all(marketData);
      console.log(closingValues);
      const updatedPortfolioData = portfolioData.map((item, index) => ({
        ...item,
        closingValue: closingValues[index],
        currentValue: closingValues[index] * parseInt(item.qty),
        unrealGain: (closingValues[index]-parseFloat(item.avgrate))*parseInt(item.qty)
      }));
      console.log(updatedPortfolioData);
      console.log(gainData);
      setPortfolio(updatedPortfolioData);
      setTransactions(transactionsData);
      setProfit(gainData);
    }
    // await axios.get(dataUrl, tokenHeader, [])
      // .then(res => {
      //   if (!res.data.success) {
      //     toast.error(res.data.error);
      //   } else {
      //     let portfolioData = res.data.portfolio
      //     let marketData = portfolioData.map(item => fetchapidata(item));
      //     let closingValues = await Promise.all(marketData);
      //     const updatedPortfolioData = portfolioData.map((item, index) => ({
      //       ...item,
      //       closingValue: closingValues[index],
      //       currentValue: closingValues[index] * parseInt(item.qty),
      //       unrealGain: (closingValues[index]-parseFloat(item.avgrate))*parseInt(item.qty)
      //     }));
      //     setPortfolio(updatedPortfolioData);
      //     setTransactions(res.data.transactions);
      //     setProfit(res.data.gain);
      //   };
      // })
      // .catch(err => {
      //   if (err.message === "Request aborted") {
      //     ;
      //   } else {
      //     console.log(err);
      //     toast.error("Server Error...");
      //   };
      // })
  }

  useEffect(() => {
    if (!token) return;
    getData();
    getRealGain();
  }, []);

  const getTotalPurchaseValue = () => {
    const totalCost = portfolio.reduce((total, record) => total + parseFloat(record.avgcost), 0);
    return totalCost;
  };

  const getTotalCurrentValue = () => {
    const totalCost = portfolio.reduce((total, record) => total + record.currentValue, 0);
    return totalCost;
  };

  const getTotalUnrealGain = () => {
    const totalCost = portfolio.reduce((total, record) => total + record.unrealGain, 0);
    return totalCost;
  };

  const getPurchase = (total, record) => {
    if (record.qty >= 0) {
      return total + parseFloat(record.amount);
    } else {
      return total;
    }
  };

  const getGain = (total, record) => {
    // if (record.qty >= 0) {
      return -1*(total + parseFloat(record.amount));
    // } else {
      // return total;
    // }
  };

  const getSale = (total, record) => {
    if (record.qty < 0) {
      return total + -1 * parseFloat(record.amount);
    } else {
      return total;
    }
  };

  const getRealGain = () => {
    console.log(profit)
    const gain = profit.reduce((total, record) => total + parseFloat(record.amount), 0);
    if (gain === 0) {
      setTotalGain(gain);
    } else {
      setTotalGain(-1 * gain);
    }
  };

  // const portfolioList = () => {
  //   let mylist = [];
  //   portfolio.map((record) => mylist.push(JSON.parse(`{"id":${record.shareid}}`)));
  //   setList(mylist);
  //   console.log(list);
  // };

  // function dateToString(date){
  //   let str = "";
  //   str += date.getFullYear()+"-";
  //   if(date.getMonth()+1 < 10){
  //     str += '0'+(date.getMonth()+1)
  //   } else {
  //     str += (date.getMonth()+1)
  //   }
  //   str += "-"
  //   if(date.getDate() < 10){
  //     str += '0'+date.getDate()
  //   } else {
  //     str += parseInt(date.getDate())-1
  //   }
  //   return str;
  // };

  // const collectData = (record) => {
  //   let market = [];
  //   axios.get(`http://localhost:5000/api/symbol/${record.shareid}`, [])
  // .then (res => {
  //   const symbol = res.data.data[0].symbol;
  //   const mydate = new Date();
  //   mydate.setDate(mydate.getDate()-1);
  //   const yesterday = dateToString(mydate);
  // setDateStr(yesterday);
  // axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=YSX0K9U097FUH83Z`)
  // .then(res => {
  //   const closing = res.data['Time Series (Daily)'][yesterday]['4. close'];
  //   market.push(JSON.parse(`{"id":${record.shareid}, "symbol":"${symbol}", "closing":"${closing}"}`));
  //   setCurrent(market);
  //   console.log(market);
  //   // setLastClose(res.data['Time Series (Daily)'][dateStr]['4. close']);
  //   // setSymbol(res.data['Meta Data']['2. Symbol']);
  //   // console.log("symbol",symbol, "closing", closing);
  // }
  // ) 
  // .catch(err => {
  //   console.log(err);
  // })

  // });

  // console.log(record.shareid)
  // fetch(`http://localhost:5000/api/symbol/${record.shareid}`)
  // .then((res) => res.json())
  // .then((data) => data.data[0].symbol); //setPasswords(data.data));
  // };

  // const handleShowGain = () => {
  //   // portfolioList();
  //   const mydata = portfolio.map(collectData);
  // };

  return (
    <div>
      {token ? (
        <>
          <div className=" w3-margin-top" style={{
            display: 'flex',
            justifyContent: 'space-around'
          }}>
            <div className="w3-card w3-blue w3-center w3-round-large" style={{ width: '20%' }}>
              <p>Total Purchased:<br />{transactions.reduce(getPurchase, 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="w3-card w3-blue w3-center w3-round-large" style={{ width: '20%' }}>
              <p>Total Sold:<br />{transactions.reduce(getSale, 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div id="gain" className={
              totalGain > 0 ?
                "w3-card w3-green w3-center w3-round-large w3-text-white"
                :
                totalGain < 0 ?
                  "w3-card w3-red w3-center w3-round-large w3-text-white"
                  :
                  "w3-card w3-blue w3-center w3-round-large w3-text-white"
            }
              style={{ width: '20%' }}>
              <p>Total Realized Profit:<br />{profit.reduce(getGain, 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              {/* <p>Total Realized Profit:<br />{totalGain.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p> */}
            </div>
          </div>
          <div className="w3-center w3-margin-bottom w3-margin-top" style={{ fontSize: '2.5rem' }}>Portfolio</div>
          <table className="w3-table w3-bordered" style={{ width: '75%', marginLeft: 'auto', marginRight: 'auto' }}>
            <thead>
              <tr>
                <th>Shares</th>
                <th style={{ textAlign: 'right' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Average Cost</th>
                <th style={{ textAlign: 'right' }}>Purchase Value</th>
                <th style={{ textAlign: 'right' }}>Last Closing</th>
                <th style={{ textAlign: 'right' }}>Current Value</th>
                <th style={{ textAlign: 'right' }}>Unrealised Gain</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((record) => (
                <tr>
                  <td>{record.company}</td>
                  <td style={{ textAlign: 'right' }}>{record.qty}</td>
                  <td style={{ textAlign: 'right' }}>{(parseFloat(record.avgcost) / record.qty).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right' }}>{parseFloat(record.avgcost).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right' }}>{parseFloat(record.closingValue).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right' }}>{parseFloat(record.currentValue).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right' }}>{parseFloat(record.unrealGain).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
              <tr>
                <td colSpan='3' style={{ textAlign: 'right' }}>Total Portfolio Value</td>
                <th style={{ textAlign: 'right' }}>{getTotalPurchaseValue().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</th>
                <td>&nbsp;</td>
                <th style={{ textAlign: 'right' }}>{getTotalCurrentValue().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</th>
                <th style={{ textAlign: 'right' }}>{getTotalUnrealGain().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</th>
              </tr>
            </tbody>
          </table>
          {/* <button type="button" onClick={handleShowGain}>Click me</button> */}
        </>
      ) : (
        <>
          <h1 style={{ textAlign: 'center', marginTop: '5%' }}>Please login to use the Portfolio Tracker</h1>
        </>
      )}
    </div>
  );
}
