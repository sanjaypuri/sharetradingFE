import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import moment from 'moment';

export default function Sell() {

  const token = sessionStorage.getItem("spbysptoken")

  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [company, setCompany] = useState(null);
  const [saledate, setSaledate] = useState(null);
  const [saleqty, setSaleqty] = useState(null);
  const [saleprice, setSaleprice] = useState(null);
  const [max, setMax] = useState(0);

  useEffect(() => {
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

  const handleClick = (data) => {
    setCompany(data.company);
    setMax(data.qtyinhand);
    document.getElementById('id01').style.display = 'block';
    document.getElementById('saledate').value = null;
    document.getElementById('saleprice').value = null;
    setSaledate("");
    setSaleprice("");
    setSaleqty(data.qtyinhand);
  };

  const handleCloseModel = () => {
    document.getElementById('id01').style.display = 'none'
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (!validForm()) {
      return;
    }
    axios.post("http://localhost:5000/api/sell", {
      selldate: saledate,
      sellrate: saleprice,
      sellqty: saleqty,
      company: company
    },
      {
        headers: {
          token: sessionStorage.getItem("spbysptoken")
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
        console.log(err);
        toast.error(err);
      })
  };

  const validForm = () => {
    alert(saleprice);
    const today = moment();
    if (saledate === null || saledate === "") {
      toast.error("Please enter a date of Sale");
      return false;
    };
    if (saledate > today.format("YYYY-MM-DD")) {
      toast.error("Sale date should not be after today's date")
      return false;
    };
    if (saleprice === '' || saleprice === null) {
      toast.error("Please enter the Sale Price");
      return false;
    };
    if (!parseFloat(saleprice)) {
      toast.error("Price entered is not a valid number");
      return false;
    };
    if (saleqty === '' || saleqty === null) {
      toast.error("Please enter Sale Qty");
      return false;
    };
    if (!parseInt(saleqty)) {
      toast.error("Qty entered is not a valid number");
      return false;
    };
    if (parseInt(saleqty) > max) {
      toast.error("Sale Qty cannot be more that the available shares");
      return false;
    }
    return true;
  };

  const closeAlert = () => {
    document.getElementById("alert").style.display='none';
    document.getElementById("title").style.display="block";
  };

  return (
    <div>
      {/* <h3 className="w3-blue w3-center">Click on the below available share to sell</h3> */}
      <div id="alert" className="w3-panel w3-red w3-display-container">
        <span onClick={closeAlert}
          className="w3-button w3-red w3-large w3-display-topright">x</span>
        <p></p>
        <h3 className="w3-center">Click on the below available share to sell</h3>
        <p></p>
      </div>
      <div id="title" style={{display:'none'}}>
        <h2 className="w3-center">Sale Details</h2>
      </div>
      <table
        className="w3-table w3-bordered w3-hoverable"
        style={{
          width: '50%',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
        <tr>
          <th>Shares</th>
          <th style={{ textAlign: 'right', width: '20%' }}>Qty in Hand</th>
          <th style={{ textAlign: 'right', width: '20%' }}>Purchase Value</th>
        </tr>
        {records.map((record) => (
          <tr class="w3-hover-pale-blue" onClick={() => { handleClick(record) }}>
            <td>{record.company}</td>
            <td style={{ textAlign: 'right' }}>{record.qtyinhand}</td>
            <td style={{ textAlign: 'right' }}>{record.cost.toFixed(2)}</td>
          </tr>
        ))}
      </table>
      <div id="id01" class="w3-modal">
        <div className="w3-modal-content" style={{ width: '35%' }}>
          <div className="w3-container">
            <span onClick={handleCloseModel} class="w3-button w3-display-topright">&times;</span>
            <h5 className="w3-center w3-text-blue">{company}</h5>
            {/* <h6 className="w3-center w3-text-blue">Purchased date {dateDDMMMYYYY(buydate)}</h6> */}
            <form className="w3-container w3-padding">
              <label className="w3-text-blue"><b>Date of Sale</b></label>
              <input id="saledate" className="w3-input w3-border" type="date" onChange={(e) => { setSaledate(e.target.value) }} />
              <label className="w3-text-blue"><b>Sale Price</b></label>
              <input id="saleprice" className="w3-input w3-border" type="text" onChange={(e) => { setSaleprice(e.target.value) }} />
              <label className="w3-text-blue"><b>Sale Qty</b></label>
              <input id="saleqty" className="w3-input w3-border" value={saleqty} type="number" onChange={(e) => { setSaleqty(e.target.value) }} />
              <button className="w3-btn w3-blue w3-margin-top" style={{ width: '100%' }} onClick={handleSave} >Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
