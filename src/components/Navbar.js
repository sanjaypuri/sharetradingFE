import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {

  const navigate = useNavigate();
  const token = sessionStorage.getItem("spbysptoken")
  const user = sessionStorage.getItem("spbyspuser")

  const handleLogout = () => {
    sessionStorage.removeItem("spbysptoken");
    sessionStorage.removeItem("spbyspuser");
    navigate('/');
  };

  return (
    <div className="w3-bar w3-border w3-light-blue">
      <span className="w3-bar-item w3-cursive" style={{ textShadow: "1px 1px 0 #444", fontSize: '1rem' }}>Share Trading Portfolio</span>
      {token ? (
        <>
          <Link to="/" className="w3-bar-item w3-button w3-hover-blue">Home</Link>
          <Link to="/trading" className="w3-bar-item w3-button w3-hover-blue">Trading Details</Link>
          <span className="w3-bar-item w3-button w3-right w3-hover-blue" onClick={handleLogout}>Log out</span>
          <span className="w3-bar-item w3-right w3-text-indigo">Welcome<b> {user}</b></span>
        </>
      ) : (
        <>
          <Link to="/signup" className="w3-bar-item w3-button w3-right w3-hover-blue">Sign up</Link>
          <Link to="/login" className="w3-bar-item w3-button w3-right w3-hover-blue">Log in</Link>
        </>
      )}
    </div>
  );
}
