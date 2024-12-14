import React from "react";
import iciT from './iciT.png';
const Header = () => {
  return (
  <header className="header">
    <div className="logo">
      <img src={iciT} alt="Logo" />
    </div>
    <h4 className="title">ILIGAN CITATION TICKET DATA MANAGEMENT</h4>
    <nav className="nav">
      <a href="#home">Home</a>
      <a href="#map">Map</a>
      <a href="#records">Records</a>
    </nav>
  </header>
  );
};

export default Header;
