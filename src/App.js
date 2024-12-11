import React, { useState } from 'react';
import Add from './components/Add';
import DataList from './components/DataList';
import CsvUploader from './components/CsvUploader'; 
import './App.css'; 
import iciticket from './iciTicket-removebg-preview1.png';

function App() {
  const [view, setView] = useState('list','add');  // To toggle between views

  return (
    <div className="app-container">
      <div className="sidebar">
        <img src={iciticket} alt="Logo" className="logo-img" />
        <h4>Data Management</h4>
        <ul>
          {/*<li onClick={() => setView('dash')}>Dashboard</li>*/}
          <li onClick={() => setView('list')}>Data List</li>
          <li onClick={() => setView('add')}>Add Data</li>
        </ul>
      </div>

      <div className="main-content">
        <h2 className="centered-title">Citiation Ticket Data Management</h2>
        
        {view === 'add' && (
          <>
            <CsvUploader />
            <Add />
          </>
        )}

        {view === 'list' && 
        (
          <>
            <CsvUploader />
            <DataList />
          </>
         
        )}
      </div>
    </div>
  );
}

export default App;
