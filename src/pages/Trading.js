import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

export default function Trading() {

  const [purDate, setPurDate] = useState(null);
  const [purRate, setPurRate] = useState(0);
  const [purQty, setPurQty] = useState(0);
  const [saleDate, setSaleDate] = useState(null);
  const [saleRate, setSaleRate] = useState(0);
  const [saleQty, setSaleQty] = useState(0);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/forselect")
      .then(res => {
        if(!res.data.success){
          toast.error(res.data.error);
        } else {
          setOptions(res.data.data);
        }
      })
      .catch(err => {
        toast.error("Error gettings Companies from server");
      });
  }, []);

  const openTab = (tabId) => {
    var i;
    var x = document.getElementsByClassName("tab");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    document.getElementById(tabId).style.display = "block";
  }

  const handlePurchase = (event) => {
    event.preventDefault();
    if (!validPurchase()) {
      return;
    }
    console.log(sessionStorage.getItem("spbysptoken"))
    axios.post("http://localhost:5000/api/buy", { 
      shareid:selectedOption.value, 
      buydate: purDate, 
      buyrate: purRate, 
      buyqty: purQty 
    },
    {
      headers:{
        token:sessionStorage.getItem("spbysptoken")

      }
    } 
    )
      .then(res => {
        alert("No Error");
        if (res.data.success) {
          console.log(res.data);
          toast.success(res.data.message);
          navigate('/');
        } else {
          console.log(res.data);
          toast.error(res.data.error);
        };
      })
      .catch(err => {
        alert("error");
        toast.error(err);
      })
  };

  const validPurchase = () => {
    if(selectedOption === null){
      toast.error("Please select a company");
      return false;
    } else {console.log(selectedOption.value)}
    if(purDate === null){
      toast.error("Please enter a date of Purchase");
      return false;
    };
    if (purRate === '' || purRate === null) {
      toast.error("Please enter Purchase Rate");
      return false;
    };
    if(!parseFloat(purRate)){
      toast.error("Rate entered is not a valid number");
      return false;
    };
    if (purQty === '' || purQty === null) {
      toast.error("Please enter Purchase Qty");
      return false;
    };
    if(!parseInt(purQty)){
      toast.error("Qty entered is not a valid number");
      return false;
    };
    return true;
  };

  const handleSale = (event) => {
    event.preventDefault();
    if (!validSale()) {
      return;
    }
    toast.info("Form data saved");
    // axios.post("http://localhost:5000/api/login", { username, password })
    //   .then(res => {
    //     console.log(res.data);
    //     if (res.data.success) {
    //       sessionStorage.setItem("spbysptoken", res.data.data.token);
    //       sessionStorage.setItem("spbyspuser", res.data.data.user);
    //       toast.success(res.data.message);
    //       navigate('/');
    //     } else {
    //       toast.error(res.data.error);
    //     };
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     toast.error("Error creating user");
    //   })
  };

  const validSale = () => {
    if(selectedOption === null){
      toast.error("Please select a company");
      return false;
    };
    if(saleDate === null){
      toast.error("Please enter a date of Sale");
      return false;
    };
    if (saleRate === '' || saleRate === null) {
      toast.error("Please enter Sale Rate");
      return false;
    };
    if(!parseFloat(saleRate)){
      toast.error("Sale Rate entered is not a valid number");
      return false;
    };
    if (saleQty === '' || saleQty === null) {
      toast.error("Please enter Sale Qty");
      return false;
    };
    if(!parseInt(saleQty)){
      toast.error("Sale Qty entered is not a valid number");
      return false;
    };
    return true;
  };

  return (
    <div className="w3-container w3-margin w3-row" style={{ paddingTop: '2%' }}>
      <div className="w3-third">&nbsp;</div>
      <div className="w3-third w3-pale-blue">
        <div className="w3-bar w3-light-blue">
          <button className="w3-bar-item w3-button w3-hover-blue" onClick={() => { openTab('Buy') }}>Buy</button>
          <button className="w3-bar-item w3-button w3-hover-blue" onClick={() => { openTab('Sell') }}>Sell</button>
        </div>
        <div id="Buy" className="w3-container tab w3-card">
          <h2>Purchase Details</h2>
          <form className="w3-container w3-pale-blue" onSubmit={handlePurchase}>
            <div>
              <label className="w3-text-indigo"><b>Select Share<span className="w3-text-red"> *</span></b></label>
              <Select
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}>
              </Select>
            </div>
            <div className="w3-margin-top">
              <label className="w3-text-indigo w3-margin-top"><b>Purchase Date<span className="w3-text-red"> *</span></b></label>
              <input className="w3-input w3-border" type="date" onChange={e => setPurDate(e.target.value)} />
            </div>
            <div className="w3-margin-top">
              <label className="w3-text-indigo w3-margin-top"><b>Purchase Rate<span className="w3-text-red"> *</span></b></label>
              <input className="w3-input w3-border" type="text" onChange={e => setPurRate(e.target.value)} />
            </div>
            <div className="w3-margin-top">
              <label className="w3-text-indigo w3-margin-top"><b>Purchase Qty<span className="w3-text-red"> *</span></b></label>
              <input className="w3-input w3-border" type="text" onChange={e => setPurQty(e.target.value)} />
            </div>
            <button type="submit" className="w3-btn w3-blue w3-margin-top w3-margin-bottom" style={{ width: '100%' }}>Save</button>
          </form>
        </div>
        <div id="Sell" className="w3-container tab w3-card" style={{ display: 'none' }}>
        <h2>Sale Details</h2>
          <form className="w3-container w3-pale-blue" onSubmit={handleSale}>
            <div>
              <label className="w3-text-indigo"><b>Select Share<span className="w3-text-red"> *</span></b></label>
              <Select
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}/>
            </div>
            <div className="w3-margin-top">
              <label className="w3-text-indigo w3-margin-top"><b>Sale Date<span className="w3-text-red"> *</span></b></label>
              <input className="w3-input w3-border" type="date" onChange={e => setSaleDate(e.target.value)} />
            </div>
            <div className="w3-margin-top">
              <label className="w3-text-indigo w3-margin-top"><b>Sale Rate<span className="w3-text-red"> *</span></b></label>
              <input className="w3-input w3-border" type="text" onChange={e => setSaleRate(e.target.value)} />
            </div>
            <div className="w3-margin-top">
              <label className="w3-text-indigo w3-margin-top"><b>Sale Qty<span className="w3-text-red"> *</span></b></label>
              <input className="w3-input w3-border" type="text" onChange={e => setSaleQty(e.target.value)} />
            </div>
            <button type="submit" className="w3-btn w3-blue w3-margin-top w3-margin-bottom" style={{ width: '100%' }}>Save</button>
          </form>
        </div>
      </div>
      <div className="w3-third">&nbsp;</div>
    </div>
  );
}