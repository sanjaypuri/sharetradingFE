import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

export default function ReportAllSold() {

  const token = sessionStorage.getItem("spbysptoken")
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [shareid, setShareid] = useState('');
  const [recid, setRecid] = useState('');
  const [company, setCompany] = useState('');
  const [saledate, setSaledate] = useState('');
  const [salerate, setSalerate] = useState('');
  const [saleqty, setSaleqty] = useState('');

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
          setTransactions(res.data.transactions);
        };
      })
      .catch(err => {
        if (err.message === "Request aborted") {
          ;
        } else {
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

  function toDateStringforInput(date) {
    const mydate = new Date(date);
    let str = "";
    str += mydate.getFullYear() + "-";
    if (mydate.getMonth() + 1 < 10) {
      str += "0" + (mydate.getMonth() + 1) + "-";
    } else {
      str += (mydate.getMonth() + 1) + "-";
    }
    if (mydate.getDate() < 10) {
      str += "0" + mydate.getDate();
    } else {
      str += mydate.getDate();
    }
    return str;
  }

  const getTotal = () => {
    let i = 0;
    let total = 0;
    for (i = 0; i < transactions.length; i++) {
      if (transactions[i].qty < 0) {
        total += parseFloat(transactions[i].amount);
      }
    };
    return -1 * total;
  };

  const handleModal = (record) => {
    setRecid(record.id);
    setShareid(record.shareid);
    setCompany(record.company);
    setSalerate(parseFloat(record.rate));
    setSaleqty(record.qty);
    setSaledate(record.tdate);
    document.getElementById('id01').style.display = 'block';
    document.getElementById('saledate').value = toDateStringforInput(record.tdate)
    document.getElementById('saleprice').value = record.rate;
    document.getElementById('saleqty').value = -1 * record.qty;
    document.getElementById("saledate").disabled = true;
    document.getElementById("saleprice").disabled = true;
    document.getElementById("saleqty").disabled = true;
    document.getElementById("delete").disabled = false;
    document.getElementById("editsave").innerText = "Edit";
  };

  const handleCloseModal = () => {
    document.getElementById('id01').style.display = 'none';
  };

  const getMaxQty = (id) => {
    let i = 0;
    let total = 0;
    for (i = 0; i < transactions.length; i++) {
      if (transactions[i].shareid === id && transactions[i].qty > 0) {
        total += transactions[i].qty;
      }
    }
    return total;
  };

  const validForm = () => {
    const today = moment();
    if (saledate === null) {
      toast.error("Please enter a date of Sale");
      return false;
    };
    if (saledate > today.format("YYYY-MM-DD")) {
      toast.error("Sale date should not be after today")
      return false;
    };
    if (salerate === '' || salerate === null) {
      toast.error("Please enter Sale Rate");
      return false;
    };
    if (parseFloat(salerate) === 0) {
      toast.alert("Sale rate cannot be 0");
      return;
    }
    if (!parseFloat(salerate)) {
      toast.error("Rate entered is not a valid number");
      return false;
    };
    if (saleqty === '' || saleqty === null) {
      toast.error("Please enter Purchase Qty");
      return false;
    };
    if (parseInt(saleqty) === 0) {
      toast.alert("Sale qty cannot be 0");
      return;
    }
    if (!parseInt(saleqty)) {
      toast.error("Qty entered is not a valid number");
      return false;
    };
    const maxQty = getMaxQty(shareid);
    if (parseInt(saleqty) > maxQty) {
      toast.error("Sold qty cannot be more than Purchased qty")
      return false;
    }
    return true;
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (document.getElementById("editsave").innerText === "Edit") {
      document.getElementById("saledate").disabled = false;
      document.getElementById("saleprice").disabled = false;
      document.getElementById("saleqty").disabled = false;
      document.getElementById("delete").disabled = true;
      document.getElementById("editsave").innerText = "Save";
    } else {
      if (!validForm()) {
        return;
      }
      axios.put("http://localhost:5000/api/update", {
        shareid: shareid,
        tdate: saledate,
        qty: saleqty,
        rate: salerate,
        id: recid
      },
        {
          headers: {
            token: token
          }
        }
      )
        .then(res => {
          if (res.data.success) {
            toast.success(res.data.message);
            navigate('/');
          } else {
            toast.error(res.data.error);
          };
        })
        .catch(err => {
          toast.error(err);
        })
    };
  };

  const handleDelete = (event) => {
    event.preventDefault();
    axios.delete(`http://localhost:5000/api/delete/${recid}`,
      {
        headers: {
          token: token
        }
      }
    )
      .then(res => {
        console.log(res.data);
        if (res.data.success) {
          toast.success(res.data.message);
          navigate('/');
        } else {
          toast.error(res.data.error);
        };
      })
      .catch(err => {
        console.log(err);
        toast.error(err);
      })
  };

  return (
    <div>
      <div className="w3-center w3-margin-bottom w3-margin-top" style={{ fontSize: '2.5rem' }}>
        Shares Sold History
      </div>
      <table className="w3-table w3-bordered" style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
        <thead>
          <tr>
            <th>Shares</th>
            <th>Sold Date</th>
            <th style={{ textAlign: 'right' }}>Qty</th>
            <th style={{ textAlign: 'right' }}>Rate</th>
            <th style={{ textAlign: 'right' }}>Sold Value</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((record) => (
            <tr className="w3-hover-pale-blue" onClick={() => { handleModal(record) }}>
              {(record.qty < 0 ?
                (<>
                  <td>{record.company}</td>
                  <td>{toDateString(record.tdate)}</td>
                  <td style={{ textAlign: 'right' }}>{-1 * (record.qty)}</td>
                  <td style={{ textAlign: 'right' }}>{parseFloat(record.rate).toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }}>{(-1 * parseFloat(record.amount)).toFixed(2)}</td>
                </>
                ) : (
                  <>
                  </>
                ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan='4' style={{ textAlign: 'right' }}>Total Sold Value</td>
            <th style={{ textAlign: 'right' }}>{(getTotal()).toFixed(2)}</th>
          </tr>
        </tfoot>
      </table>
      <div id="id01" className="w3-modal">
        <div className="w3-modal-content" style={{ width: '35%' }}>
          <div className="w3-container">
            <span onClick={handleCloseModal} className="w3-button w3-display-topright">&times;</span>
            <h5 className="w3-center w3-text-blue">{company}</h5>
            <form className="w3-container w3-padding">
              <label className="w3-text-blue"><b>Sale Date</b></label>
              <input id="saledate" className="w3-input w3-border" type="date" onChange={(e) => { setSaledate(e.target.value) }} disabled />
              <label className="w3-text-blue"><b>Sale Price</b></label>
              <input id="saleprice" className="w3-input w3-border" type="text" onChange={(e) => { setSalerate(e.target.value) }} disabled />
              <label className="w3-text-blue"><b>Sale Qty</b></label>
              <input id="saleqty" className="w3-input w3-border" type="number" onChange={(e) => { setSaleqty(e.target.value) }} disabled />
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <button id="editsave" className="w3-btn w3-blue w3-margin-top w3-margin-right" style={{ width: '30%' }} onClick={handleSave} >Edit</button>
                <button id="delete" className="w3-btn w3-red w3-margin-top" style={{ width: '30%' }} onClick={handleDelete} >Delete</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
