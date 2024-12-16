import "./all.css";
import React, { useState, useEffect } from "react";
import { Bar, Line, Scatter, Pie, Doughnut } from 'react-chartjs-2';import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import { db } from './firebase';
import Modal from "react-modal";
import Header from "./Header";
import topBg from './top1.png';
import CsvUploader from "./CsvUploader"; 
import Map from "./map"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCab, faFilter, faFloppyDisk, faMagnifyingGlass, faPen, faRectangleList, faTicket, faTrashCan, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title,Tooltip, Legend } from 'chart.js';
import { faMapLocation } from "@fortawesome/free-solid-svg-icons/faMapLocation";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LandingPage = () => {
  const [records, setRecords] = useState([]);
  const [ticketNumber, setTicketNumber] = useState("");
  const [dateOfApprehension, setDateOfApprehension] = useState("");
  const [timeOfApprehension, setTimeOfApprehension] = useState("");
  const [nameOfDriver, setNameOfDriver] = useState("");
  const [placeOfViolation, setPlaceOfViolation] = useState("");
  const [violationType, setViolationType] = useState("");
  const [fineStatus, setFineStatus] = useState("");
  const [apprehendingOfficer, setApprehendingOfficer] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [vehicleClassification, setVehicleClassification] = useState("");

  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);
  
  const [formState, setFormState] = useState({
    ticketNumber: "",
    dateOfApprehension: "",
    timeOfApprehension: "",
    nameOfDriver: "",
    placeOfViolation: "",  
    violationType: "",
    fineStatus: "",
    apprehendingOfficer: "",
    gender: "",
    age: "",
    vehicleClassification: ""
  });

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleCsvData = (data) => {
    setRecords(data);
  };

  const [genderData, setGenderData] = useState({ Male: 0, Female: 0 });
  const [ageData, setAgeData] = useState([0, 0, 0, 0, 0]); // [0-18, 19-30, 31-40, 41-50, 51+]
  const [fineStatusData, setFineStatusData] = useState({ Paid: 0, Unpaid: 0 });
  const [vehicleClassificationData, setVehicleClassificationData] = useState({});//doughnut
  const [violationTypeData, setViolationTypeData] = useState({});//doughnut
  const [vehicleClassificationDataC, setVehicleClassificationDataC] = useState({}); //card
  const [violationTypeDataC, setViolationTypeDataC] = useState({});//card



  const [filteredData, setFilteredData] = useState([]);
// Function to fetch data for gender, fine status, and age groups
const fetchDemographicData = async (dataList) => {
  // Process gender data
  const genderCounts = dataList.reduce(
    (acc, record) => {
      if (record.gender === "Male") acc.Male += 1;
      if (record.gender === "Female") acc.Female += 1;
      return acc;
    },
    { Male: 0, Female: 0 }
  );
  setGenderData(genderCounts);

  // Process fine status data
  const fineStatusCounts = dataList.reduce(
    (acc, record) => {
      if (record.fineStatus === "Paid") acc.Paid += 1;
      if (record.fineStatus === "Unpaid") acc.Unpaid += 1;
      return acc;
    },
    { Paid: 0, Unpaid: 0 }
  );
  setFineStatusData(fineStatusCounts);

  // Process age data (grouping by age ranges)
  const ageCounts = [0, 0, 0, 0, 0]; // [0-18, 19-30, 31-40, 41-50, 51+]
  dataList.forEach((record) => {
    const age = record.age;
    if (age >= 0 && age <= 18) ageCounts[0] += 1;
    else if (age >= 19 && age <= 30) ageCounts[1] += 1;
    else if (age >= 31 && age <= 40) ageCounts[2] += 1;
    else if (age >= 41 && age <= 50) ageCounts[3] += 1;
    else if (age >= 51) ageCounts[4] += 1;
  });
  setAgeData(ageCounts);
};

// Function to fetch data for doughnut charts
const fetchDoughnutData = async (dataList) => {
  // Process vehicle classification data
  const vehicleCounts = {};
  dataList.forEach((record) => {
    const vehicle = record.vehicleClassification;
    if (vehicle) {
      vehicleCounts[vehicle] = vehicleCounts[vehicle] ? vehicleCounts[vehicle] + 1 : 1;
    }
  });
  setVehicleClassificationData(vehicleCounts);

  // Process violation type data dynamically
  const violationCounts = {};
  dataList.forEach((record) => {
    const violation = record.violationType;
    if (violation) {
      violationCounts[violation] = violationCounts[violation] ? violationCounts[violation] + 1 : 1;
    }
  });
  setViolationTypeData(violationCounts);
};

// Function to fetch data for cards
const fetchCardData = async (dataList) => {
  // Process vehicle classification data for cards
  const vehicleCountsC = {};
  dataList.forEach((record) => {
    const vehicle = record.vehicleClassification;
    if (vehicle) {
      vehicleCountsC[vehicle] = vehicleCountsC[vehicle] ? vehicleCountsC[vehicle] + 1 : 1;
    }
  });
  const highestVehicleClassification = Object.keys(vehicleCountsC).reduce((a, b) =>
    vehicleCountsC[a] > vehicleCountsC[b] ? a : b
  );
  const highestVehicleCountC = vehicleCountsC[highestVehicleClassification];
  setMostCommonVehicle({ count: highestVehicleCountC, classification: highestVehicleClassification });

  // Process violation type data for cards
  const violationCountsC = {};
  dataList.forEach((record) => {
    const violation = record.violationType;
    if (violation) {
      violationCountsC[violation] = violationCountsC[violation] ? violationCountsC[violation] + 1 : 1;
    }
  });
  const highestViolationTypeC = Object.keys(violationCountsC).reduce((a, b) =>
    violationCountsC[a] > violationCountsC[b] ? a : b
  );
  const highestViolationCount = violationCountsC[highestViolationTypeC];
  setMostCommonViolation({ count: highestViolationCount, type: highestViolationTypeC });

  // Calculate the total number of violations per place of violation
  const placeCounts = {};
  dataList.forEach((record) => {
    const place = record.placeOfViolation;
    if (place) {
      placeCounts[place] = placeCounts[place] ? placeCounts[place] + 1 : 1;
    }
  });
  const top3Places = Object.entries(placeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([place, count]) => ({ place, count }));
  setTop3Places(top3Places);
};

// Main fetch function
const fetchData = async () => {
  const recordsCollection = collection(db, "records");
  const recordsSnapshot = await getDocs(recordsCollection);
  const dataList = recordsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  setRecords(dataList);
  setFilteredData(dataList);

  // Fetch data for different purposes
  fetchDemographicData(dataList);
  fetchDoughnutData(dataList);
  fetchCardData(dataList);
};

useEffect(() => {
  fetchData();
}, []);

const [mostCommonViolation, setMostCommonViolation] = useState({ count: 0, type: "" });
const [mostCommonVehicle, setMostCommonVehicle] = useState({ count: 0, classification: "" });
const [top3Places, setTop3Places] = useState([]);
const totalViolations = records.length; // Use `records` state to calculate this.





  const handleDelete = async (id) => {
    const recordsDocRef = doc(db, "records", id);
    try {
      await deleteDoc(recordsDocRef);
      setRecords(records.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (selectedData) {
        const recordDocRef = doc(db, "records", selectedData.id);
        await updateDoc(recordDocRef, formState);
        alert("Data updated successfully!");
      } else {
        await addDoc(collection(db, "records"), formState);
        alert("Data added successfully!");
      }
  
      setFormState({
        ticketNumber: "",
        dateOfApprehension: "",
        timeOfApprehension: "",
        nameOfDriver: "",
        gender: "",
        age: "",
        vehicleClassification: "",
        placeOfViolation: "",
        violationType: "",
        fineStatus: "",
        apprehendingOfficer: ""
      });
      setSelectedData(null);
      closeModal();
    } catch (error) {
      console.error("Error adding/updating document: ", error);
    }
  };

  const handleEdit = (record) => {
    setSelectedData(record);
    setFormState({
      ticketNumber: record.ticketNumber,
      dateOfApprehension: record.dateOfApprehension,
      timeOfApprehension: record.timeOfApprehension,
      nameOfDriver: record.nameOfDriver,
      gender: record.gender,
      age: record.age,
      vehicleClassification: record.vehicleClassification,
      placeOfViolation: record.placeOfViolation,
      violationType: record.violationType,
      fineStatus: record.fineStatus,
      apprehendingOfficer: record.apprehendingOfficer
    });
    openModal();
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [filterField, setFilterField] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentPageData = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

const goToNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage((prevPage) => prevPage + 1);
  }
};

const goToPreviousPage = () => {
  if (currentPage > 1) {
    setCurrentPage((prevPage) => prevPage - 1);
  }
};

const handlePageClick = (pageNumber) => {
  setCurrentPage(pageNumber);
};


  useEffect(() => {
    if (sortConfig.key) {
      const sortedData = [...filteredData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
      setFilteredData(sortedData);
    }
  }, [sortConfig, filteredData]);
  

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };


  //graphs
  const genderChartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Gender Distribution',
        data: genderData, // Example: [50, 30] for male and female counts
        backgroundColor: ['#4e73df', '#1cc88a'],
        borderColor: ['#4e73df', '#1cc88a'],
        borderWidth: 1,
      },
    ],
  };
  const fineStatusChartData = {
    labels: ['Paid', 'Unpaid'], 
    datasets: [
      {
        label: 'Fine Status Distribution',
        data: fineStatusData, // Example: [10, 20, 30, 40, 50] for each age group count
        backgroundColor: ['#4e73df', '#1cc88a'],
        borderColor: ['#4e73df', '#1cc88a'],
        borderWidth: 1,
      },
    ],
  };
  const ageChartData = {
    labels: ['0-18', '19-30', '31-40', '41-50', '51+'], // Age groups
    datasets: [
      {
        label: 'Age Distribution',
        data: ageData, // Example: [10, 20, 30, 40, 50] for each age group count
        backgroundColor: '#ff6384',
        borderColor: '#ff6384',
        borderWidth: 1,
      },
    ],
  };

  //search
  const [searchQuery, setSearchQuery] = useState("");
// Handle search input change
const handleSearchChange = (event) => {
  setSearchQuery(event.target.value);
  setCurrentPage(1); // Reset to first page when searching
};

// Filter records based on the search query
const filteredRecords = records.filter((record) => {
  const lowerCaseQuery = searchQuery.toLowerCase();
  return (
    record.ticketNumber.toString().toLowerCase().includes(lowerCaseQuery) ||
    record.nameOfDriver.toLowerCase().includes(lowerCaseQuery) ||
    record.vehicleClassification.toLowerCase().includes(lowerCaseQuery) ||
    record.placeOfViolation.toLowerCase().includes(lowerCaseQuery) ||
    record.violationType.toLowerCase().includes(lowerCaseQuery) ||
    record.apprehendingOfficer.toLowerCase().includes(lowerCaseQuery)
  );
});
  


  return (
    <div className="app-container">
      <Header />

      <main className="main-section">
        <div className="top-section">
          <div className="placeholder large">
            <img src={topBg} alt="Logo" className="banner" />
          </div>
        </div>

        <div className="cards-container">
          <div className="card">
            <h3>Total Violations</h3>
            <p>{totalViolations}</p> {/* Display total violation count */}
            <FontAwesomeIcon icon={faTicket} size="2xl" rotation={90} style={{marginLeft:"260"}}/>
          </div>
          <div className="card">
          <h3>Highest Violation Type </h3>
          <p>{mostCommonViolation.count} for {mostCommonViolation.type}</p>
          <FontAwesomeIcon icon={faTicket} size="2xl" rotation={90} style={{marginLeft:"260"}}/>

            </div>
          <div className="card">
          <h3>Highest Vehicle Classification</h3>
          <p>{mostCommonVehicle.count} for {mostCommonVehicle.classification}</p>
          <FontAwesomeIcon icon={faCab} size="2xl" style={{marginLeft:"260"}}/>
            </div>

            <div className="card">
            <h3>Top 3 Places with Most Violations</h3>
                {top3Places.map((place, index) => (
                  <li key={index}>{place.place}: {place.count} violations</li>
                ))}
                <FontAwesomeIcon icon={faMapLocation}  size="2xl" style={{marginLeft:"260"}}/>
          </div>
        </div>

        <div className="bottom-section">
          <div className="placeholder medium">
            {/* Gender Distribution Bar Chart */}
            <h2>Gender Distribution</h2>
            <Bar data={genderChartData} />

          </div>
          <div className="placeholder medium">
            {/* Age Distribution Bar Chart */}
            <h2>Age Distribution</h2>
            <Bar data={ageChartData} />


          </div>
          <div className="placeholder medium">
            {/* fine status Distribution Bar Chart */}
            <h2>Fine Status Distribution</h2>
            <Bar data={fineStatusChartData} />
          </div>
          
        </div>
      </main>
      <main className="main-section">
  
        <div className="bottom-section1">

          <div className="placeholder medium1">
           {/* Vehicle Classification Donut Chart */}
           <h2>Vehicle Classification</h2>
           <Doughnut
        data={{
          labels: Object.keys(vehicleClassificationData),
          datasets: [
            {
              data: Object.values(vehicleClassificationData),
              backgroundColor: [
                "#ff6384",
                "#36a2eb",
                "#ffcd56",
                "#ff9f40",
                "#4e73df",
                "#1cc88a",
                "#f6c23e",
                "#36b9cc",
                "#f1f1f1",
                "#e74a3b",
                "#5a5b8c",
                "#e77d8e",
                "#3b8b8c",
                "#b9c3c9",
                "#abb2b9",
              ],
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "right", // You can adjust the position of the legend
            },
            tooltip: {
              enabled: true, // Enable tooltips to show more info on hover
            },
          },
        }}
      />
          </div>
          <div className="placeholder medium1">
           {/* violation type Donut Chart */}
           <h2>Violation Type</h2>
      <Doughnut
        data={{
          labels: Object.keys(violationTypeData), // Dynamic labels based on violation types
          datasets: [
            {
              data: Object.values(violationTypeData), // Data counts dynamically set from violationCounts
              backgroundColor: [
                "#ff6384", // Color for first category
                "#36a2eb", // Color for second category
                "#ffcd56", // Color for third category
                "#ff9f40", // Color for fourth category
                "#4caf50", // Additional colors for more categories (you can add more)
              ],
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "right", // You can adjust the position of the legend
            },
            tooltip: {
              enabled: true, // Enable tooltips to show more info on hover
            },
          },
        }}
      />
          </div>
          
        </div>
      </main>

      <section className="records-section">
        <div className="csv-uploader-section">
          <CsvUploader onCsvUpload={handleCsvData} />
        </div>
        <div className="records-header">
          <h2 className="recorh2"><FontAwesomeIcon icon={faRectangleList} style={{marginRight:"10"}} />Records
          <div className="search-bar">
            <input type="text" placeholder="Search..." value={searchQuery} onChange={handleSearchChange} className="search" /> <FontAwesomeIcon icon={faMagnifyingGlass} style={{marginLeft:"-50", marginTop:"30"}} />
          </div>
          </h2>
          <button onClick={openModal} className="adddata1"> <FontAwesomeIcon icon={faFilter} style={{color: "#05223e", marginRight:"10"}} />Filter</button>
          <button onClick={openModal} className="adddata"> <FontAwesomeIcon icon={faUserPlus} style={{color: "#ffffff", marginRight:"10"}} />Add Record</button>

        </div>

        <table className="records-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('ticketNumber')}>Ticket Number</th>
              <th onClick={() => handleSort('dateOfApprehension')}>Date of Apprehension</th>
              <th>Time of Apprehension</th>
              <th onClick={() => handleSort('nameOfDriver')}>Name of Driver</th>
              <th>Gender</th>
              <th onClick={() => handleSort('age')}>Age</th>
              <th onClick={() => handleSort('vehicleClassification')}>Vehicle Classification</th>
              <th onClick={() => handleSort('placeOfViolation')}>Place of Violation</th>
              <th>Violation Type</th>
              <th>Fine Status</th>
              <th onClick={() => handleSort('apprehendingOfficer')}>Apprehending Officer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.length > 0 ? (
              currentPageData.map((record, index) => (
                <tr key={record.id || index}>
                  <td>{record.ticketNumber}</td>
                  <td>{record.dateOfApprehension}</td>
                  <td>{record.timeOfApprehension}</td>
                  <td>{record.nameOfDriver}</td>
                  <td>{record.gender}</td>
                  <td>{record.age}</td>
                  <td>{record.vehicleClassification}</td>
                  <td>{record.placeOfViolation}</td>
                  <td>{record.violationType}</td>
                  <td>{record.fineStatus}</td>
                  <td>{record.apprehendingOfficer}</td>
                  <td>
                    <div className="buttons">
                      <button className="edit-button" onClick={() => handleEdit(record)}>
                        Edit <FontAwesomeIcon icon={faPen} style={{marginLeft:"5"}} /> 
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(record.id)}
                      >
                        Delete <FontAwesomeIcon icon={faTrashCan} style={{marginLeft:"5"}}   />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No records to display</td>
              </tr>
            )}
          </tbody>

        </table>
        <div className="pagination">
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => handlePageClick(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>

      </section>
 {/*  
<div className="records-section">
<Map onCsvUpload={handleCsvData} />
</div>*/}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Record"
        className="modal-content"
      >
        <h2>
          
          {selectedData ? "Edit Record" : "Add New Record"}</h2>
        <form onSubmit={handleSubmit} className="add-form">
          <label htmlFor="ticket-id">Ticket Number/ID</label>
          <input
            id="ticket-id"
            type="text"
            placeholder="Enter Ticket Number/ID"
            value={formState.ticketNumber}
            onChange={(e) => setFormState({ ...formState, ticketNumber: e.target.value })}
            required
          />

          <label htmlFor="date-of-apprehension">Date of Apprehension</label>
          <input 
            id="date-of-apprehension" 
            type="date" 
            value={formState.dateOfApprehension} 
            onChange={(e) => setFormState({ ...formState, dateOfApprehension: e.target.value })} 
            required 
          />

          <label htmlFor="time-of-apprehension">Time of Apprehension</label>
          <input
            id="time-of-apprehension"
            type="text"
            placeholder="Enter time (HH:MM:SS)"
            value={formState.timeOfApprehension}
            onChange={(e) => setFormState({ ...formState, timeOfApprehension: e.target.value })}
            required
          />

          <label htmlFor="driver-name">Name of Driver</label>
          <input 
            id="driver-name" 
            type="text" 
            placeholder="Enter Name of Driver" 
            value={formState.nameOfDriver} 
            onChange={(e) => setFormState({ ...formState, nameOfDriver: e.target.value })} 
            required 
          />

        <label htmlFor="gender">Gender</label>
            <select 
              id="gender" 
              value={formState.gender} 
              onChange={(e) => setFormState({ ...formState, gender: e.target.value })} 
              required 
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>

          <label htmlFor="age">Age</label>
          <input 
            id="age" 
            type="number" 
            placeholder="Enter Age" 
            value={formState.age} 
            onChange={(e) => setFormState({ ...formState, age: e.target.value })} 
            required 
          />

          <label htmlFor="classsification-of-vehicle">Classification of Vehicle</label>
              <select 
                id="classsification-of-vehicle" 
                value={formState.vehicleClassification} 
                onChange={(e) => setFormState({ ...formState, vehicleClassification: e.target.value })} 
                required 
              >
                <option value="" disabled>
                  Select classification of vehicle
                </option>
                <option value="PUV">PUV (Public Utility Vehicle)</option>
                <option value="Private">Private</option>
                <option value="Government">Government Vehicle</option>
                <option value="PUJ">PUJ (Public Utility Jeepney)</option>
                <option value="PUB">PUB (Public Utility Bus)</option>
                <option value="MC">Motorcycle</option>
                <option value="TRI">Tricycle</option>
              </select>

          <label htmlFor="place-of-violation">Place of Violation</label>
          <select 
            id="place-of-violation" 
            value={formState.placeOfViolation}  
            onChange={(e) => setFormState({ ...formState, placeOfViolation: e.target.value })} 
            required
          >
             <option value="" disabled>Select Place of Violation</option>
                <option value="Abuno">Abuno</option>
                <option value="Acmac-Mariano Badelles Sr.">Acmac-Mariano Badelles Sr.</option>
                <option value="Bagong Silang">Bagong Silang</option>
                <option value="Bonbonon">Bonbonon</option>
                <option value="Bunawan">Bunawan</option>
                <option value="Buru-un">Buru-un</option>
                <option value="Dalipuga">Dalipuga</option>
                <option value="Del Carmen">Del Carmen</option>
                <option value="Digkilaan">Digkilaan</option>
                <option value="Ditucalan">Ditucalan</option>
                <option value="Dulag">Dulag</option>
                <option value="Hinaplanon">Hinaplanon</option>
                <option value="Hindang">Hindang</option>
                <option value="Kabacsanan">Kabacsanan</option>
                <option value="Kalilangan">Kalilangan</option>
                <option value="Kiwalan">Kiwalan</option>
                <option value="Lanipao">Lanipao</option>
                <option value="Luinab">Luinab</option>
                <option value="Mahayahay">Mahayahay</option>
                <option value="Mainit">Mainit</option>
                <option value="Mandulog">Mandulog</option>
                <option value="Maria Cristina">Maria Cristina</option>
                <option value="Palao">Palao</option>
                <option value="Panoroganan">Panoroganan</option>
                <option value="Poblacion">Poblacion</option>
                <option value="Puga-an">Puga-an</option>
                <option value="Rogongon">Rogongon</option>
                <option value="San Miguel">San Miguel</option>
                <option value="San Roque">San Roque</option>
                <option value="Santa Elena">Santa Elena</option>
                <option value="Santa Filomena">Santa Filomena</option>
                <option value="Santiago">Santiago</option>
                <option value="Santo Rosario">Santo Rosario</option>
                <option value="Saray">Saray</option>
                <option value="Suarez">Suarez</option>
                <option value="Tambacan">Tambacan</option>
                <option value="Tibanga">Tibanga</option>
                <option value="Tipanoy">Tipanoy</option>
                <option value="Tomas L. Cabili (Tominobo Proper)">Tomas L. Cabili (Tominobo Proper)</option>
                <option value="Tubod">Tubod</option>
                <option value="Ubaldo Laya">Ubaldo Laya</option>
                <option value="Upper Hinaplanon">Upper Hinaplanon</option>
                <option value="Upper Tominobo">Upper Tominobo</option>
                <option value="Villa Verde">Villa Verde</option>
          </select>

          <label htmlFor="violation-type">Violation Type</label>
          <input 
            id="violation-type" 
            type="text" 
            placeholder="Enter Violation Type" 
            value={formState.violationType} 
            onChange={(e) => setFormState({ ...formState, violationType: e.target.value })} 
            required 
          />

        <label htmlFor="fine-status">Fine Status</label>
            <select 
              id="fine-status" 
              value={formState.fineStatus} 
              onChange={(e) => setFormState({ ...formState, fineStatus: e.target.value })} 
              required 
            >
              <option value="" disabled>
                Select Fine Status
              </option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>

          <label htmlFor="apprehending-officer">Apprehending Officer</label>
          <input 
            id="apprehending-officer" 
            type="text" 
            value={formState.apprehendingOfficer} 
            onChange={(e) => setFormState({ ...formState, apprehendingOfficer: e.target.value })} 
            required 
          />

          <button type="submit" className="submitadd">Submit<FontAwesomeIcon icon={faFloppyDisk} style={{color: "#ffffff", marginLeft:"10"}} /></button>
          <button type="button" className="close-modal-btn" onClick={closeModal}>Cancel <FontAwesomeIcon icon={faXmark} style={{color: "#ffffff", marginLeft:"10"}} /> </button>
        </form>
      </Modal>
    </div>
  );
};

export default LandingPage;