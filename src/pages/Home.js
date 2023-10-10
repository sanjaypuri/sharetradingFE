import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
export default function Home() {

  const token = sessionStorage.getItem("spbysptoken")
  const baseHeaders = {
    headers: {
      'token': token
    }
  }

  const [loading, setLoading] = useState(true);
  // const [totalGain, setTotalGain] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalRelisedGain, setTotalRealisedGain] = useState(0);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    if (!token) {
      return
    };
    if (loading) {
      getCardInfo();
      getTableInfo();
      setLoading(false);
    };
  }, []);

  const getCardInfo = () => {
    axios.get("http://localhost:5000/api/home/purchasessum", baseHeaders)
      .then(res => {
        if (!res.data.success) {
          toast.error(res.data.error);
        } else {
          setTotalPurchases(res.data.data[0].totalpurchases);
          axios.get("http://localhost:5000/api/home/salessum", baseHeaders)
            .then(res => {
              if (!res.data.success) {
                toast.error(res.data.error);
              } else {
                setTotalSales(res.data.data[0].totalsales);
                axios.get("http://localhost:5000/api/home/realisedprofit", baseHeaders)
                  .then(res => {
                    // console.log(res.data);
                    if (!res.data.success) {
                      toast.error(res.data.error);
                    } else {
                      setTotalRealisedGain(res.data.realisedprofit);
                    };
                  })
                  .catch(err => {
                    console.log(err);
                    if (err.message === "Request aborted") {
                      ;
                    } else {
                      toast.error("Server Error");
                    };
                  });
              };
            })
            .catch(err => {
              console.log(err);
              if (err.message === "Request aborted") {
                ;
              } else {
                toast.error("Server Error");
              };
            });
        };
      })
      .catch(err => {
        console.log(err);
        if (err.message === "Request aborted") {
          ;
        } else {
          toast.error("Server Error");
        };
      });
  };

  const getTableInfo = () => {
    axios.get("http://localhost:5000/api/home/portfolio", baseHeaders)
      .then(res => {
        // console.log(res.data);
        if (!res.data.success) {
          toast.error(res.data.error);
        } else {
          setPortfolio(res.data.data);
          console.log(res.data.data);
        }
      })
      .catch(err => {
        console.log(err);
        if (err.message === "Request aborted") {
          ;
        } else {
          toast.error("Server Error");
        };
      });
  };

  const totalPurchaseValue = () => {
    const total = portfolio.reduce((total, record) =>
      total + record.value, 0);
    return total;
  };

  const convert2D = (num) => {
    // alert(num);
    try{
      const x = num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return x
    } catch(err) {
      if(err){
        return 0;
      }
    };
  };

  return (
    <div>
      {token ? (
        <>
          <div className=" w3-margin-top" style={{
            display: 'flex',
            justifyContent: 'space-around',
            color: 'white'
          }}>
            <div className="w3-card w3-blue w3-center w3-round-large" style={{ width: '20%' }}>
              Total Purchased:<br />
              {convert2D(totalPurchases)}
            </div>
            <div className="w3-card w3-blue w3-center w3-round-large" style={{ width: '20%' }}>
              Total Sold:<br />
              {convert2D(totalSales)}
            </div>
            <div id="gain" className={
              totalRelisedGain > 0 ?
                "w3-card w3-green w3-center w3-round-large w3-text-white"
                :
                totalRelisedGain < 0 ?
                  "w3-card w3-red w3-center w3-round-large w3-text-white"
                  :
                  "w3-card w3-blue w3-center w3-round-large w3-text-white"
            }
              style={{ width: '20%' }}>
              Total Realized Profit:<br />
              {convert2D(totalRelisedGain)}
            </div>
          </div>
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
              {portfolio.map((record) => (
                <tr>
                  <td>{record.share}</td>
                  <td style={{ textAlign: 'right', width: '15%' }}>{record.qty}</td>
                  <td style={{ textAlign: 'right', width: '15%' }}>{convert2D(record.avgrate)}</td>
                  <td style={{ textAlign: 'right', width: '20%' }}>{convert2D(record.value)}</td>
                  <td style={{ textAlign: 'right', width: '15%' }}>{convert2D(record.currentrate)}</td>
                  <td style={{ textAlign: 'right', width: '15%' }}>{convert2D(record.currentvalue)}</td>
                </tr>
              ))};
              <tr>
                <td colSpan='3' style={{ textAlign: 'right' }}>Total Portfolio Value</td>
                <th style={{ textAlign: 'right' }}>{convert2D(totalPurchaseValue())}</th>
                <td>&nbsp;</td>
                <th style={{ textAlign: 'right' }}>Total Current Value</th>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <>
          <h1 style={{ textAlign: 'center', marginTop: '5%' }}>Please login to use the Portfolio Tracker</h1>
        </>
      )
      }
    </div >
  );

}
