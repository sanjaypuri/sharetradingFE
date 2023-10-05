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
    window.location.reload();
  };

  return (
    <div className="w3-bar w3-border w3-light-blue">
      <span className="w3-bar-item w3-cursive" style={{ textShadow: "1px 1px 0 #444", fontSize: '1rem' }}>Share Trading Portfolio</span>
      {token ? (
        <>
          <Link to="/" className="w3-bar-item w3-button w3-hover-blue">Home</Link>
          <div className="w3-dropdown-hover">
            <button className="w3-button w3-hover-blue">Trading Details</button>
            <div className="w3-dropdown-content w3-bar-block w3-card-4">
              <Link to="/buy" className="w3-bar-item w3-button w3-hover-blue">Buy</Link>
              <Link to="/sell" className="w3-bar-item w3-button w3-hover-blue">Sell</Link>
            </div>
          </div>
          <div className="w3-dropdown-hover">
            <button className="w3-button w3-hover-blue">Trading Reports</button>
            <div className="w3-dropdown-content w3-bar-block w3-card-4">
              <Link to="/allbuy" className="w3-bar-item w3-button w3-hover-blue">All Purchases</Link>
              <Link to="/allsale" className="w3-bar-item w3-button w3-hover-blue">All Sales</Link>
              {/* <Link to="/realgain" className="w3-bar-item w3-button w3-hover-blue">Realized Gain</Link> */}
            </div>
          </div>
          <Link to="/about" className="w3-bar-item w3-button w3-hover-blue">About</Link>
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
