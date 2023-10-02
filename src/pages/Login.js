import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        console.log(res.data);
        if(res.data.success){
          sessionStorage.setItem("spbysptoken", res.data.data.token);
          sessionStorage.setItem("spbyspuser", res.data.data.user);
          toast.success(res.data.message);
          navigate('/');
        } else {
          toast.error(res.data.error);
        };
      })
      .catch (err => {
        console.log(err);
        toast.error("Error creating user");
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
      <div className="w3-third">&nbsp;</div>
      <div className="w3-third w3-card-4 w3-margin-top">
        <div className="w3-container w3-blue w3-cursive">
          <h2>Login</h2>
        </div>
        <form className="w3-container w3-padding-top w3-pale-blue" onSubmit={handleSubmit}>
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
      <div className="w3-third">&nbsp;</div>
    </div>
  );
}
