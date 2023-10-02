import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

export default function Trading() {

  const [companies, setCompanies] = useState([]);
  const [companyP, setCompanyP] = useState(0);
  const [companyS, setCompanyS] = useState(0);
  const [purDate, setPurDate] = useState(null);
  const [purRate, setPurRate] = useState(0);
  const [purQty, setPurQty] = useState(0);
  const [saleDate, setSaleDate] = useState(null);
  const [saleRate, setSaleRate] = useState(0);
  const [saleQty, setSaleQty] = useState(0);
  // const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  // let options = [
  //   { value: 'chocolate', label: 'Chocolate' },
  //   { value: 'strawberry', label: 'Strawberry' },
  //   { value: 'vanilla', label: 'Vanilla' },
  // ];
  useEffect(() => {
    console.log(options);
    axios.get("http://localhost:5000/api/companies")
      .then(res => {
        if(!res.data.success){
          toast.error(res.data.error);
        } else {
          setCompanies(res.data.data);
          loadCompanies(companies)
        }
        
        
      })
      .catch(err => {
        toast.error("Error gettings Companies from server");
      });
  }, []);

  const loadCompanies = (companies_) => {
        console.log(companies_)
        let newOptions = companies_.map(company => ({
          value: company.id,
          age: company.company
        }));
        
        setOptions(newOptions)
  }

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

  const validPurchase = () => {
    alert(options[0].value)
    if(companyP === 0){
      toast.error("Please select a company");
      return false;
    };
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

  const handleChangeP = (companyID) => {
    setCompanyP(companyID);
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
    if(companyS === 0){
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

  const handleChangeS = (companyID) => {
    setCompanyS(companyID);
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
              <Select
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}
              />
              
              <label className="w3-text-indigo"><b>Select Share<span className="w3-text-red"> *</span></b></label>
              <select className="w3-select w3-border w3-light-grey" name="option" onChange={e =>{handleChangeP(e.target.value)}}>
                <option value="" disabled selected>Choose your option</option>
                {
                  companies.map(function fn(company) {
                    return (
                      <option value={company.id}>{company.company}</option>
                    );
                  })
                }
              </select>
            </div>
            <div className="w3-margin-top">
              <label className="w3-text-indigo w3-margin-top"><b>Purchase Date<span className="w3-text-red"> *</span></b></label>
              <input className="w3-input w3-border w3-light-grey" type="date" onChange={e => setPurDate(e.target.value)} />
            </div>
            <div className="w3-margin-top">
              <label className="w3-text-indigo w3-margin-top"><b>Purchase Rate<span className="w3-text-red"> *</span></b></label>
              <input className="w3-input w3-border w3-light-grey" type="text" onChange={e => setPurRate(e.target.value)} />
            </div>
            <div className="w3-margin-top">
              <label className="w3-text-indigo w3-margin-top"><b>Purchase Qty<span className="w3-text-red"> *</span></b></label>
              <input className="w3-input w3-border w3-light-grey" type="text" onChange={e => setPurQty(e.target.value)} />
            </div>
            <button type="submit" className="w3-btn w3-blue w3-margin-top w3-margin-bottom" style={{ width: '100%' }}>Save</button>
          </form>
        </div>
        <div id="Sell" className="w3-container tab w3-card" style={{ display: 'none' }}>
        <h2>Sale Details</h2>
          <form className="w3-container w3-pale-blue" onSubmit={handleSale}>
            <div>
              <label className="w3-text-indigo"><b>Select Share<span className="w3-text-red"> *</span></b></label>
              <select className="w3-select w3-border w3-light-grey" name="option" onChange={e =>{handleChangeS(e.target.value)}}>
                <option value="" disabled selected>Choose your option</option>
                {
                  companies.map(function fn(company) {
                    return (
                      <option value={company.id}>{company.company}</option>
                    );
                  })
                }
              </select>
            </div>
            <div className="w3-margin-top">
              <label className="w3-text-indigo w3-margin-top"><b>Sale Date<span className="w3-text-red"> *</span></b></label>
              <input className="w3-input w3-border w3-light-grey" type="date" onChange={e => setSaleDate(e.target.value)} />
            </div>
            <div className="w3-margin-top">
              <label className="w3-text-indigo w3-margin-top"><b>Sale Rate<span className="w3-text-red"> *</span></b></label>
              <input className="w3-input w3-border w3-light-grey" type="text" onChange={e => setSaleRate(e.target.value)} />
            </div>
            <div className="w3-margin-top">
              <label className="w3-text-indigo w3-margin-top"><b>Sale Qty<span className="w3-text-red"> *</span></b></label>
              <input className="w3-input w3-border w3-light-grey" type="text" onChange={e => setSaleQty(e.target.value)} />
            </div>
            <button type="submit" className="w3-btn w3-blue w3-margin-top w3-margin-bottom" style={{ width: '100%' }}>Save</button>
          </form>
        </div>
      </div>
      <div className="w3-third">&nbsp;</div>
    </div>
  );
}