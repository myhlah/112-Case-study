import React from "react";
import "./all.css";
import Header from "./Header";
import topBg from './topbg.jpg';


const LandingPage = () => {

  return (
    <div className="app-container">
      {/* Header Section */}
     <Header/>

      {/* Main Section */}
      <main className="main-section">
        <div className="top-section">
          <div className="placeholder large">
            <img src={topBg} alt="Logo"  className="banner" />

          </div>
        </div>
        <div className="bottom-section">
          <div className="placeholder medium"></div>
          <div className="placeholder medium"></div>
          <div className="placeholder small"></div>
          <div className="placeholder small"></div>
        </div>
      </main>

      {/* Records Section */}
      <section className="records-section">
        <div className="records-header">
          <h2>Records</h2>
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <button>
              <i className="fa fa-search"></i>
            </button>
          </div>
        </div>
        <table className="records-table">
          <thead>
            <tr>
              <th>Driver</th>
              <th>Violation</th>
              <th>Penalty</th>
              <th>Date & Time</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan C. Santos</td>
              <td>Truck Ban</td>
              <td>-</td>
              <td>12/03/2023 3:30 PM</td>
              <td>Mahayayhay Avenue, Iligan City</td>
              <td>Paid</td>
            </tr>
            <tr>
              <td>Juan C. Santos</td>
              <td>Truck Ban</td>
              <td>-</td>
              <td>12/03/2023 3:30 PM</td>
              <td>Mahayayhay Avenue, Iligan City</td>
              <td>Paid</td>
            </tr>
            <tr>
              <td>Juan C. Santos</td>
              <td>Truck Ban</td>
              <td>-</td>
              <td>12/03/2023 3:30 PM</td>
              <td>Mahayayhay Avenue, Iligan City</td>
              <td>Paid</td>
            </tr>
            <tr>
              <td>Juan C. Santos</td>
              <td>Truck Ban</td>
              <td>-</td>
              <td>12/03/2023 3:30 PM</td>
              <td>Mahayayhay Avenue, Iligan City</td>
              <td>Paid</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};


export default LandingPage;
