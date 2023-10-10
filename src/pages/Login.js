import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import img from '../images/login.jpg';

export default function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if(!formIsValid()){
      return;
    }
    axios.post("http://localhost:5000/api/login", {username, password})
      .then(res => {
        if(res.data.success){
          sessionStorage.setItem("spbysptoken", res.data.data.token);
          sessionStorage.setItem("spbyspuser", res.data.data.user);
          toast.success(res.data.message);
          navigate('/');
        } else {
          console.log(res.data.error);
          toast.error(res.data.error);
        };
      })
      .catch (err => {
        console.log(err);
        toast.error("Server Error");
      })
  };

  const formIsValid = () => {
    if(username === '' || username === null){
      toast.error("Username cannot be empty");
      return false;
    }
    if(password === '' || password === null){
      toast.error("Password cannot be empty");
      return false;
    }
    return true;
  };

  return (
    <div className="w3-container w3-row w3-margin-top">
      <div className="w3-quarter">&nbsp;</div>
      <div className="w3-quarter w3-margin-top ">
        <div className="w3-container w3-white w3-cursive">
          <br/><br/>
          <h2>Login</h2>
        </div>
        <form className="w3-container w3-padding-top w3-white" onSubmit={handleSubmit}>
          <div className="w3-margin-top">
            <label className="w3-text-indigo"><b>User Name<span className="w3-text-red"> *</span></b></label>
            <input className="w3-input w3-border w3-light-grey" type="text" onChange={e => setUsername(e.target.value)}/>
          </div>
          <div className="w3-margin-top">
            <label className="w3-text-indigo w3-margin-top"><b>Password<span className="w3-text-red"> *</span></b></label>
            <input className="w3-input w3-border w3-light-grey" type="password" onChange={e => setPassword(e.target.value)}/>
          </div>
          <button type="submit" className="w3-btn w3-blue w3-margin-top w3-margin-bottom" style={{width:'100%'}}>Login</button>
        </form>
      </div>
      <div className="w3-quarter">
        <br/><br/>
        <img id="imglogin" src={img} alt="" style={{width:'150%'}}/>
        </div>
    </div>
  );
}
