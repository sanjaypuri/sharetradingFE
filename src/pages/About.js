import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


export default function About() {

  const token = sessionStorage.getItem("spbysptoken")
  const baseURL = "http://localhost:5000/api/"
  const apiURL = "https://www.alphavantage.co/query"
  const headers = {
    headers : {
      'token' : token
    }
  }
  



  const [portfolioTableData , setPortfolioTableData] = useState([])
  const [loading,setLoading] = useState(true)
  

  useEffect(() => {
    if (!token) return;

    const fetchapidata = async (item) => {
      const params = {
        params: {
          function: 'TIME_SERIES_DAILY',
          apikey: 'YSX0K9U097FUH83Z',
          symbol: item.symbol,
        },
      };
      
      try {
        const response = await axios.get(apiURL, params);

        console.log(response.data)
        
        if (!response.data || !response.data["Time Series (Daily)"]) {
          throw new Error("Data not available");
        }
    
        const datesArray = Object.keys(response.data["Time Series (Daily)"]);
        datesArray.sort((a, b) => new Date(b) - new Date(a));
        const mostRecentDate = datesArray[0];
        let closingValue = response.data["Time Series (Daily)"][mostRecentDate]["4. close"];
        return closingValue;
      } catch (error) {
        console.error(`Error fetching data`, error);
        return null; 
      }
    };

  
    const getData = async () => {
      const response = await axios.get(baseURL + "portfolio", headers);
      let x = response.data.portfolio;
      let promises = x.map(item => fetchapidata(item));
      let closingValues = await Promise.all(promises);
      console.log(promises)
      const updatedState = x.map((item, index) => ({
        ...item,
        closingValue: closingValues[index],
        currentValue: closingValues[index] * item.qty,
      }));
      setPortfolioTableData(updatedState);
      setLoading(false);
    };
  
    if (loading) {
      getData();
    }
  }, [baseURL, token, headers, loading]);
  

  

  return (
    <div>
      {token ? (
        <>
          <div className="w3-center w3-margin-bottom w3-margin-top" style={{ fontSize: '2.5rem' }}>Portfolio</div>
          <table className="w3-table w3-bordered" style={{ width: '75%', marginLeft: 'auto', marginRight: 'auto' }}>
            <thead>
              <tr>
                <th>Shares</th>
                <th style={{ textAlign: 'right', width: '15%' }}>Qty in hand</th>
                <th style={{ textAlign: 'right', width: '15%' }}>Average Cost</th>
                <th style={{ textAlign: 'right', width: '20%' }}>Purchase Value</th>
                <th style={{ textAlign: 'right', width: '15%' }}>Last Closing</th>
                <th style={{ textAlign: 'right', width: '15%' }}>Current Value</th>
              </tr>
            </thead>
            <tbody>
              {

              }
              {portfolioTableData.map((record,index) => (
                <tr>
                  <td>{record.company}</td>
                  <td style={{ textAlign: 'right' }}>{record.qty}</td>
                  <td style={{ textAlign: 'right' }}>{(parseFloat(record.avgcost) / record.qty).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right' }}>{parseFloat(record.avgcost).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right' }}>{record.closingValue}</td>
                  <td style={{ textAlign: 'right' }}>{record.currentValue}</td>
                </tr>
              ))} 
              {/* <tr>
                <td colSpan='3' style={{ textAlign: 'right' }}>Total Portfolio Value</td>
                <th style={{ textAlign: 'right' }}>{getTotal().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</th>
              </tr> */}
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