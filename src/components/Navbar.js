import React from 'react';
import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

export default function Navbar() {

  // const navigate = useNavigate();
  const token = sessionStorage.getItem("ftbyspToken")

  const handleLogout = () => {
    sessionStorage.removeItem("ftbyspToken");
    // navigate('/home');
  };

  return (
    <div className="w3-bar w3-border w3-blue">
      <span className="w3-bar-item w3-cursive" style={{ textShadow: "1px 1px 0 #444", fontSize: '1.3rem' }}>Share Trading Portfolio</span>
      {token ? (
        <>
          <Link to="/" className="w3-bar-item w3-button">Home</Link>
          <div className="w3-dropdown-hover">
            <button className="w3-button">Trading</button>
            <div className="w3-dropdown-content w3-bar-block w3-card-4">
              <a href="#" className="w3-bar-item w3-button">Buy</a>
              <a href="#" className="w3-bar-item w3-button">Sell</a>
            </div>
          </div>
          <a href="#" className="w3-bar-item w3-button w3-right" onClick={handleLogout}>Log out</a>
          <span className="w3-bar-item w3-right"><b>Welcome Sanjay Puri</b></span>
        </>
      ) : (
        <>
          <Link to="/signup" className="w3-bar-item w3-button w3-right">Sign up</Link>
          <Link to="/login" className="w3-bar-item w3-button w3-right">Log in</Link>
        </>
      )}
    </div>
  );
}
