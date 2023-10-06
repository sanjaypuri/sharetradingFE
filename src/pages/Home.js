import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function Home() {

  const token = sessionStorage.getItem("spbysptoken")

  const [portfolio, setPortfolio] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [profit, setProfit] = useState([]);
  const [totalGain, setTotalGain] = useState(0);

  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:5000/api/portfolio", {
      headers: {
        'token': token
      }
    }, [])
      .then(res => {
        if (!res.data.success) {
          toast.error(res.data.error);
        } else {
          setPortfolio(res.data.portfolio);
          setTransactions(res.data.transactions);
          setProfit(res.data.gain);
        };
      })
      .catch(err => {
        if (err.message === "Request aborted") {
          ;
        } else {
          toast.error("Server Error...");
        };
      })
    getRealGain();
  });

  const getTotal = () => {
    const totalCost = portfolio.reduce((total, record) => total + parseFloat(record.avgcost), 0);
    return totalCost;
  };

  const getPurchase = (total, record) => {
    if (record.qty >= 0) {
      return total + parseFloat(record.amount);
    } else {
      return total;
    }
  };

  const getSale = (total, record) => {
    if (record.qty < 0) {
      return total + -1 * parseFloat(record.amount);
    } else {
      return total;
    }
  };

  const getRealGain = () => {
    const gain = profit.reduce((total, record) => total + parseFloat(record.amount), 0);
    setTotalGain(-1 * gain);
  };

  return (
    <div>
      {token ? (
        <>
          <div className=" w3-margin-top" style={{
            display: 'flex',
            justifyContent: 'space-around'
          }}>
            <div className="w3-card w3-blue w3-center w3-round-large" style={{ width: '20%' }}>
              <p>Total Purchased: {transactions.reduce(getPurchase, 0).toFixed(2)}</p>
            </div>
            <div className="w3-card w3-blue w3-center w3-round-large" style={{ width: '20%' }}>
              <p>Total Sold: {transactions.reduce(getSale, 0).toFixed(2)}</p>
            </div>
            <div id="gain" className={
              totalGain >= 0 ?
                "w3-card w3-green w3-center w3-round-large w3-text-white"
                :
                "w3-card w3-red w3-center w3-round-large w3-text-white"
            }
              style={{ width: '20%' }}>
              <p>Total Realized Profit: {totalGain}</p>
            </div>
          </div>
          <div className="w3-center w3-margin-bottom w3-margin-top" style={{ fontSize: '2.5rem' }}>Portfolio</div>
          <table className="w3-table w3-bordered" style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
            <thead>
              <tr>
                <th>Shares</th>
                <th style={{ textAlign: 'right', width: '20%' }}>Qty in hand</th>
                <th style={{ textAlign: 'right', width: '20%' }}>Average Cost</th>
                <th style={{ textAlign: 'right', width: '25%' }}>Purchase Value</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((record) => (
                <tr>
                  <td>{record.company}</td>
                  <td style={{ textAlign: 'right' }}>{record.qty}</td>
                  <td style={{ textAlign: 'right' }}>{(parseFloat(record.avgcost) / record.qty).toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }}>{parseFloat(record.avgcost).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan='3' style={{ textAlign: 'right' }}>Total Portfolio Value</td>
                <th style={{ textAlign: 'right' }}>{getTotal().toFixed(2)}</th>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <>
          <h1 style={{ textAlign: 'center', marginTop: '5%' }}>Please login to use the Portfolio Tracker</h1>
        </>
      )}
    </div>
  );
}
