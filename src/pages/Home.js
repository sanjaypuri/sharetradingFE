import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function Home() {

  const token = sessionStorage.getItem("spbysptoken")
  const user = sessionStorage.getItem("spbyspuser")

  const [records, setRecords] = useState([]);

  useEffect(() => {
    if(!token) return;
    axios.get("http://localhost:5000/api/portfolio", {
      headers: {
        'token': token
      }
    })
      .then(res => {
        if (!res.data.success) {
          toast.error(res.data.error);
        } else {
          setRecords(res.data.data);
        };
      })
      .catch(err => {
        toast.error("Server Error");
      });
  });

  const getTotal = () => {
    const totalCost = records.reduce((total, record) => total + record.cost, 0);
      return totalCost;
  };

  return (
    <div>
      {token ? (
        <>
          <div className="w3-center w3-margin-bottom w3-margin-top" style={{ fontSize: '2.5rem' }}>Shares Portfolio for {user}</div>
          <table className="w3-table w3-bordered" style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
            <tr>
              <th>Shares</th>
              <th style={{ textAlign: 'right', width:'20%' }}>Qty in hand</th>
              <th style={{ textAlign: 'right', width:'20%' }}>Average Cost</th>
              <th style={{ textAlign: 'right', width:'25%' }}>Purchase Value</th>
            </tr>
            {records.map((record) => (
              <tr>
                <td>{record.company}</td>
                <td style={{ textAlign: 'right' }}>{record.qtyinhand}</td>
                <td style={{ textAlign: 'right' }}>{record.avgrate.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{record.cost.toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colspan='3' style={{ textAlign: 'right' }}>Total Purchase Value</td>
              <th  style={{ textAlign: 'right' }}>{getTotal().toFixed(2)}</th>
            </tr>
          </table>
        </>
      ) : (
        <>
        <h1 style={{textAlign:'center', marginTop:'5%'}}>Please login to use the Portfolio Tracker</h1>
        </>
      )}
    </div>
  );
}
