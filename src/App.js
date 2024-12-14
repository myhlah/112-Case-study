import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import Login from './components/login'; 
//import Signup from './components/signup'; 
//import About from './components/about'
//import Header from './components/Header'; 
import LandingPage from './components/LandingPage'
import Map from './components/map'
//import Home from './components/login2';
function App() {
  return (
    <Router>
      <div className="App">
   
        <Routes>
          {/*<Route path="/" element={<Login />} /> 
          <Route path="/signup" element={<Signup />} /> 
          <Route path="/about" element={<About />} />
           <Route path="/login2" element={<Home />} />*/}
           <Route path="/" element={<LandingPage />} /> 
           <Route path="/map" element={<Map />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
