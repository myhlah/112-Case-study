import React from "react";
import iciT from './iciT.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons/faCircleInfo";
const Header = () => {
  return (
  <header className="header">
    <div className="logo">
      <img src={iciT} alt="Logo" />
    </div>
    <h4 className="title">ILIGAN CITATION TICKET DATA MANAGEMENT</h4>
    <nav className="nav">
      <a href="LandingPage">Home<FontAwesomeIcon icon={faHouse} style={{marginLeft:"10"}}  /></a>
      <a href="map">Map <FontAwesomeIcon icon={faLocationDot} style={{marginLeft:"10"}} /></a>
      <a href="about">About <FontAwesomeIcon icon={faCircleInfo} style={{marginLeft:"10"}}  /></a>
    </nav>
  </header>
  );
};

export default Header;
