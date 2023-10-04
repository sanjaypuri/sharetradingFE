import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function ReportAllSold() {

  const token = sessionStorage.getItem("spbysptoken")
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:5000/api/allsale", {
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
        if(err.message === "Request aborted"){
          ;
        } else{
          toast.error("Server Error");
        };
      });
  });

  function toDateString(date) {
    const mydate = new Date(date);
    let month = ["-Jan-", "-Feb-", "-Mar-", "-Apr-", "-May-", "-Jun-", "-Jul-", "-Aug-", "-Sep-", "-Oct-", "-Nov-", "-Dec-"];
    let str = "";
    if (mydate.getDate() < 10) {
      str += "0" + mydate.getDate();
    } else {
      str += mydate.getDate();
    }
    str += month[mydate.getMonth()];
    str += mydate.getFullYear();
    return str;
  }

  const getTotal = () => {
    const totalCost = records.reduce((total, record) => total + -1*parseFloat(record.amount), 0);
      return totalCost;
  };

  return (
    <div>
      <div className="w3-center w3-margin-bottom w3-margin-top" style={{ fontSize: '2.5rem' }}>
        Sold Shares History
      </div>
      <table className="w3-table w3-bordered" style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
        <tr>
          <th>Shares</th>
          <th>Purchase Date</th>
          <th style={{ textAlign: 'right' }}>Qty</th>
          <th style={{ textAlign: 'right' }}>Rate</th>
          <th style={{ textAlign: 'right' }}>Sold Value</th>
        </tr>
        {records.map((record) => (
          <tr className="w3-hover-pale-blue">
            <td>{record.company}</td>
            <td>{toDateString(record.tdate)}</td>
            <td style={{ textAlign: 'right' }}>{-1*(record.qty)}</td>
            <td style={{ textAlign: 'right' }}>{parseFloat(record.rate).toFixed(2)}</td>
            <td style={{ textAlign: 'right' }}>{-1*(parseFloat(record.amount).toFixed(2))}</td>
          </tr>
        ))}
        <tr>
          <td colspan='4' style={{ textAlign: 'right' }}>Total Sold Value</td>
          <th style={{ textAlign: 'right' }}>{getTotal().toFixed(2)}</th>
        </tr>
      </table>
    </div>
  );
}
