import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import moment from 'moment';

export default function Buy() {

  const token = sessionStorage.getItem("spbysptoken")
  const navigate = useNavigate();

  const [purDate, setPurDate] = useState(null);
  const [purRate, setPurRate] = useState(0);
  const [purQty, setPurQty] = useState(0);
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

  const handlePurchase = (event) => {
    event.preventDefault();
    if (!validPurchase()) {
      return;
    }
    axios.post("http://localhost:5000/api/buy", { 
      shareid:selectedOption.value, 
      buydate: purDate, 
      buyrate: purRate, 
      buyqty: purQty 
    },
    {
      headers:{
        token:token
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

  const validPurchase = () => {
    const today = moment();
    if(selectedOption === null){
      toast.error("Please select a company");
      return false;
    }
    if(purDate === null){
      toast.error("Please enter a date of Purchase");
      return false;
    };
    if(purDate > today.format("YYYY-MM-DD")){
      toast.error("Purchase date should be of after today")
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

  return (
    <div className="w3-container w3-margin w3-row" style={{ paddingTop: '2%' }}>
      <div className="w3-third">&nbsp;</div>
      <div className="w3-third w3-pale-blue">
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
      </div>
      <div className="w3-third">&nbsp;</div>
    </div>
  );
}