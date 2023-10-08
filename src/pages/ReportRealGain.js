import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function ReportRealGain() {

  const token = sessionStorage.getItem("spbysptoken")
  const [trecords, setTrecords] = useState([]);
  const [grecords, setGrecords] = useState([]);
  const redstyle = { textAlign: 'right', color:'red' };
  const greenstyle = { textAlign: 'right', color:'green' };

  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:5000/api/portfolio", {
      headers: {
        'token': token
      }
    })
      .then(res => {
        if (!res.data.success) {
          toast.error(res.data.error);
        } else {
          setTrecords(res.data.transactions);
          setGrecords(res.data.gain);
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

  const getQty = (shareid) => {
    const Qty = trecords.reduce((total, record) => 
    (record.shareid === shareid && record.qty < 0) ? total + record.qty : total, 0);
    return -1*Qty;
  };

  const getAvgSale = (shareid) => {
    const totalSaleValue = trecords.reduce((total, record) => 
    (record.shareid === shareid && record.qty < 0) ? total + parseFloat(record.amount) : total, 0);
    const totalSaleQty = trecords.reduce((total, record) => 
    (record.shareid === shareid && record.qty < 0) ? total + record.qty : total, 0);
      return totalSaleValue/totalSaleQty;
  };

  const getAvgPurchase = (shareid) => {
    const totalPurchaseValue = trecords.reduce((total, record) => 
    (record.shareid === shareid && record.qty > 0) ? total + parseFloat(record.amount) : total, 0);
    const totalPurchaseQty = trecords.reduce((total, record) => 
    (record.shareid === shareid && record.qty > 0) ? total + record.qty : total, 0);
      return totalPurchaseValue/totalPurchaseQty;
  };

  const getTotalSale = (shareid) => {
    const totalSaleValue = trecords.reduce((total, record) => 
    (record.shareid === shareid && record.qty < 0) ? total + parseFloat(record.amount) : total, 0);
      return -1*totalSaleValue;
  };

  const getTotalSaleAll = (shareid) => {
    const totalSaleValue = trecords.reduce((total, record) => 
    record.qty < 0 ? total + parseFloat(record.amount) : total, 0);
      return -1*totalSaleValue;
  };

  const getTotalGain = () => {
    const totalGain = grecords.reduce((total, record) => total + parseFloat(record.amount), 0);
      return -1*totalGain;
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
        {grecords.map((record) => (
          <tr>
            <td>{record.company}</td>
            <td style={{ textAlign: 'right' }}>{getQty(record.shareid).toLocaleString('en-IN', {minimumFractionDigits:0, maximumFractionDigits:0 })}</td>
            <td style={{ textAlign: 'right' }}>{(getAvgSale(record.shareid)).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2 })}</td>
            <td style={{ textAlign: 'right' }}>{(getAvgPurchase(record.shareid)).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2 })}</td>
            <td style={{ textAlign: 'right' }}>{(getTotalSale(record.shareid)).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2 })}</td>
            <td style={parseFloat(record.amount) >= 0 ? redstyle : greenstyle}><b>{(-1*parseFloat(record.amount)).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2 })}</b></td>
          </tr>
        ))}
        <tr>
          <td colspan='4' style={{ textAlign: 'right' }}>Totals</td>
          <th style={{ textAlign: 'right' }}>{getTotalSaleAll().toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2 })}</th>
          <th style={getTotalGain() < 0 ? redstyle : greenstyle}>{getTotalGain().toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2 })}</th>
        </tr>
      </table>
    </div>
  );
}
