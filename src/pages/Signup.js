import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {

  const navigate = useNavigate();

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [cpassword, setCpassword] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if(!formIsValid()){
      return;
    }
    axios.post("http://localhost:5000/api/newuser", {username, password})
      .then(res => {
        if(res.data.success){
          toast.success(res.data.message);
          navigate('/login');
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
    if(username.length < 3){
      toast.error("Username should atleast be three chacters long");
      return false;
    }
    if(password === '' || password === null){
      toast.error("Password cannot be empty");
      return false;
    }
    let validPassword = true;
    if (8 < password.length && password.length > 20){
      validPassword = false;
    };
    if(!(password.match(".*\\d.*"))){
      validPassword = false;
    };
    if(!(password.match(".*[a-z].*"))){
      validPassword = false;
    };
    if(!(password.match(".*[A-Z].*"))){
      validPassword = false;
    };
    if((password.match(".*[!@#$%^&():;<>,._+-=].*"))){
    }else{
      validPassword = false;
    }
    if(!validPassword){
      toast.error("A valid password must contain atleast one lowercase letter, one uppercase letter, one digit and one special charcter and password must be 8 to 20 characters long");
      return false;
    }
    if(cpassword === '' || cpassword === null){
      toast.error("Confirm Password cannot be empty");
      return false;
    }
    if(!(cpassword === password)){
      toast.error("password not matching with Confirm Password");
      return false;
    }
    return true;
  };

  return (
    <div class="w3-container w3-row w3-margin-top">
      <div className="w3-third">&nbsp;</div>
      <div className="w3-third w3-card-4 w3-margin-top">
        <div className="w3-container w3-blue w3-cursive">
          <h2>Register new User</h2>
        </div>

        <form className="w3-container w3-padding-top w3-pale-blue" onSubmit={handleSubmit}>
          <br/>
          <label className="w3-text-teal"><b>User Name</b></label>
          <input className="w3-input w3-border w3-light-grey" type="text" onChange={e => setUsername(e.target.value)}/>
          <br/>
          <label className="w3-text-teal w3-margin-top"><b>Password</b></label>
          <input className="w3-input w3-border w3-light-grey" type="password" onChange={e => setPassword(e.target.value)}/>
          <br/>
          <label className="w3-text-teal w3-margin-top"><b>Confirm Password</b></label>
          <input className="w3-input w3-border w3-light-grey" type="password" onChange={e => setCpassword(e.target.value)}/>
          <br/>
          <button type="submit" className="w3-btn w3-blue w3-margin-bottom" style={{width:'100%'}}>Register</button>
        </form>
      </div>
      <div className="w3-third">&nbsp;</div>
    </div>
  );
}
