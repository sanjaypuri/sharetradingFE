import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

export default function ReportAllBuy() {

  const token = sessionStorage.getItem("spbysptoken")
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [shareid, setShareid] = useState('');
  const [recid, setRecid] = useState('');
  const [company, setCompany] = useState('');
  const [purchaseprice, setPurchaseprice] = useState('');
  const [purchaseqty, setPurchaseqty] = useState('');
  const [tdate, setTdate] = useState('');

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
        console.log(err);
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
    const myTotal = transactions.reduce((total, record) =>
      record.qty > 0 ? total + parseFloat(record.amount) : total,
      0);
    return myTotal;
  };

  const handleModal = (record) => {
    setRecid(record.id);
    setShareid(record.shareid);
    setCompany(record.company);
    setPurchaseprice(parseFloat(record.rate));
    setPurchaseqty(record.qty);
    setTdate(record.tdate);
    document.getElementById('id01').style.display = 'block';
    document.getElementById('purdate').value = toDateStringforInput(record.tdate)
    document.getElementById('purprice').value = record.rate;
    document.getElementById('purqty').value = record.qty;
    document.getElementById("purdate").disabled = true;
    document.getElementById("purprice").disabled = true;
    document.getElementById("purqty").disabled = true;
    document.getElementById("delete").disabled = false;
    document.getElementById("editsave").innerText = "Edit";
};

  const handleCloseModal = () => {
    document.getElementById('id01').style.display = 'none';
  };

  const getMinQty = (id) => {
    const Min = transactions.reduce((total, record) =>
      (record.shareid === id && record.qty < 0) ? total + record.qty : total,
      0);
    return -1*Min;
  };

  const validForm = () => {
    const today = moment();
    if (tdate === null) {
      toast.error("Please enter a date of Purchase");
      return false;
    };
    if (tdate > today.format("YYYY-MM-DD")) {
      toast.error("Purchase date should not be after today")
      return false;
    };
    if (purchaseprice === '' || purchaseprice === null) {
      toast.error("Please enter Purchase Rate");
      return false;
    };
    if (parseFloat(purchaseprice) === 0) {
      toast.error("Purchase Rate cannot be 0");
      return false;
    };
    if (!parseFloat(purchaseprice)) {
      toast.error("Rate entered is not a valid number");
      return false;
    };
    if (purchaseqty === '' || purchaseqty === null) {
      toast.error("Please enter Purchase Qty");
      return false;
    };
    if (parseInt(purchaseqty) === 0) {
      toast.error("Purchase Qty cannot be 0");
      return false;
    };
    if (!parseInt(purchaseqty)) {
      toast.error("Qty entered is not a valid number");
      return false;
    };
    const minQty = getMinQty(shareid);
    alert("min:" + minQty)
    if (parseInt(purchaseqty) < minQty) {
      toast.error("Qty bought cannot be less qty sold")
      return false;
    }
    return true;
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (document.getElementById("editsave").innerText === "Edit") {
      document.getElementById("purdate").disabled = false;
      document.getElementById("purprice").disabled = false;
      document.getElementById("purqty").disabled = false;
      document.getElementById("delete").disabled = true;
      document.getElementById("editsave").innerText = "Save";
    } else {
      if (!validForm()) {
        return;
      }
      axios.put("http://localhost:5000/api/update", {
        shareid: shareid,
        tdate: tdate,
        qty: purchaseqty,
        rate: purchaseprice,
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

  const getStock = (shareid) => {
    const stock = transactions.reduce((total, record) =>
      record.sharid === shareid ? total + parseFloat(record.qty) : total,
      0);
    return stock;
  };

  const handleDelete = (event) => {
    event.preventDefault();
    let stockinHand = getStock(shareid);
    if (purchaseqty > stockinHand) {
      toast.error("Shares already sold. Cannot delete.");
      return;
    }
    axios.delete(`http://localhost:5000/api/delete/${recid}`,
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

  return (
    <div>
      <div className="w3-center w3-margin-bottom w3-margin-top" style={{ fontSize: '2.5rem' }}>
        Purchased Shares History
      </div>
      <table className="w3-table w3-bordered" style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
        <tr>
          <th>Shares</th>
          <th>Purchase Date</th>
          <th style={{ textAlign: 'right' }}>Qty</th>
          <th style={{ textAlign: 'right' }}>Rate</th>
          <th style={{ textAlign: 'right' }}>Purchase Value</th>
        </tr>
        {transactions.map((record) => (
          <tr className="w3-hover-pale-blue" onClick={() => { handleModal(record) }}>
            {(record.qty > 0 ?
              (<>
                <td>{record.company}</td>
                <td>{toDateString(record.tdate)}</td>
                <td style={{ textAlign: 'right' }}>{record.qty}</td>
                <td style={{ textAlign: 'right' }}>{parseFloat(record.rate).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2 })}</td>
                <td style={{ textAlign: 'right' }}>{parseFloat(record.amount).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2 })}</td>
              </>
              ) : (
                <>
                </>
              ))}
          </tr>
        ))}
        <tr>
          <td colspan='4' style={{ textAlign: 'right' }}>Total Purchase Value</td>
          <th style={{ textAlign: 'right' }}>{getTotal().toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2 })}</th>
        </tr>
      </table>
      <div id="id01" className="w3-modal">
        <div className="w3-modal-content" style={{ width: '35%' }}>
          <div className="w3-container">
            <span onClick={handleCloseModal} className="w3-button w3-display-topright">&times;</span>
            <h5 className="w3-center w3-text-blue">{company}</h5>
            <form className="w3-container w3-padding">
              <label className="w3-text-blue"><b>Purchase Date</b></label>
              <input id="purdate" className="w3-input w3-border" type="date" onChange={(e) => { setTdate(e.target.value) }} disabled />
              <label className="w3-text-blue"><b>Purchase Price</b></label>
              <input id="purprice" className="w3-input w3-border" type="text" onChange={(e) => { setPurchaseprice(e.target.value) }} disabled />
              <label className="w3-text-blue"><b>Purchase Qty</b></label>
              <input id="purqty" className="w3-input w3-border" type="number" onChange={(e) => { setPurchaseqty(e.target.value) }} disabled />
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
