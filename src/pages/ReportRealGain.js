import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function ReportRealGain() {

  const token = sessionStorage.getItem("spbysptoken")
  const [records, setRecords] = useState([]);
  const redstyle = { textAlign: 'right', color:'red' };
  const greenstyle = { textAlign: 'right', color:'green' };

  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:5000/api/realgain", {
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

  // function toDateString(date) {
  //   const mydate = new Date(date);
  //   let month = ["-Jan-", "-Feb-", "-Mar-", "-Apr-", "-May-", "-Jun-", "-Jul-", "-Aug-", "-Sep-", "-Oct-", "-Nov-", "-Dec-"];
  //   let str = "";
  //   if (mydate.getDate() < 10) {
  //     str += "0" + mydate.getDate();
  //   } else {
  //     str += mydate.getDate();
  //   }
  //   str += month[mydate.getMonth()];
  //   str += mydate.getFullYear();
  //   return str;
  // }

  const getTotalSale = () => {
    const totalCost = records.reduce((total, record) => total + record.salevalue, 0);
      return totalCost;
  };

  const getTotalGain = () => {
    const totalCost = records.reduce((total, record) => total + record.gain, 0);
      return totalCost;
  };

  return (
    <div>
      <div className="w3-center w3-margin-bottom w3-margin-top" style={{ fontSize: '2.5rem' }}>
        Realized Gain
      </div>
      <table className="w3-table w3-bordered" style={{ width: '60%', marginLeft: 'auto', marginRight: 'auto' }}>
        <tr>
          <th>Shares</th>
          <th style={{ textAlign: 'right' }}>Qty Sold</th>
          <th style={{ textAlign: 'right' }}>Avg Sale Price</th>
          <th style={{ textAlign: 'right' }}>Avg Purchase Price</th>
          <th style={{ textAlign: 'right' }}>Total Sale Value</th>
          <th style={{ textAlign: 'right' }}>Realized Gain</th>
        </tr>
        {records.map((record) => (
          <tr>
            <td>{record.company}</td>
            <td style={{ textAlign: 'right' }}>{record.qty}</td>
            <td style={{ textAlign: 'right' }}>{record.salerate.toFixed(2)}</td>
            <td style={{ textAlign: 'right' }}>{record.purrate.toFixed(2)}</td>
            <td style={{ textAlign: 'right' }}>{record.salevalue.toFixed(2)}</td>
            <td style={record.gain < 0 ? redstyle : greenstyle}><b>{record.gain.toFixed(2)}</b></td>
          </tr>
        ))}
        <tr>
          <td colspan='4' style={{ textAlign: 'right' }}>Totals</td>
          <th style={{ textAlign: 'right' }}>{getTotalSale().toFixed(2)}</th>
          <th style={getTotalGain() < 0 ? redstyle : greenstyle}>{getTotalGain().toFixed(2)}</th>
        </tr>
      </table>
    </div>
  );
}
