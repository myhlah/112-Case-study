import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip, Marker, Popup } from "react-leaflet";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import "./all.css";
import iliganMap from './iliganmap.json'; // ph1.json
import "leaflet/dist/leaflet.css";

const MapPage = () => {
  const [records, setRecords] = useState([]);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(iliganMap);
  const violations = {};

  const handleCsvData = (data) => {
    setRecords(data);
  };

  useEffect(() => {
    setRecords(violations);
  }, [violations]);

  const handleOnHover = (e) => {
    const { name } = e.target.feature.properties;
    setSelectedBarangay(name);
  };

  const handleMouseOut = () => {
    setSelectedBarangay(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recordsCollection = collection(db, "records");
        const recordsSnapshot = await getDocs(recordsCollection);

        // Aggregate data: Count occurrences of each barangay
        const aggregatedData = recordsSnapshot.docs.reduce((acc, doc) => {
          const barangay = doc.data().barangay;
          const normalizedBarangay = barangay?.toUpperCase().trim(); // Normalize strings for consistency
          if (normalizedBarangay) {
            acc[normalizedBarangay] = (acc[normalizedBarangay] || 0) + 1;
          }
          return acc;
        }, {});

        setRecords(aggregatedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const getColor = (count) => {
    if (count > 1000) return '#800026';
    if (count > 500) return '#BD0026';
    if (count > 200) return '#E31A1C';
    if (count > 50) return '#FC4E2A';
    if (count > 20) return '#FD8D3C';
    if (count > 5) return '#FEB24C';
    if (count > 0) return '#FED976';
    return '#FFEDA0';
  };

  const normalizeString = (str) => {
    if (str) {
      return str.toUpperCase().trim();
    }
    return ''; // Return empty string if str is undefined
  };

  const violationCounts = records; // Already aggregated data

  geoJsonData.features.forEach(feature => {
    const barangayName = feature.properties.adm4_en; // Use the correct property for the barangay name
    feature.properties.violations = violationCounts[normalizeString(barangayName)] || 0; // Set violations for each barangay
  });

  return (
    <div className="map-page">
      <div className="map-description">
        <h3>Traffic Violation Map of Iligan City</h3>
        <p>Explore the traffic violation data for various barangays in Iligan City.</p>
        <p>This interactive map displays traffic violation data across the 44 barangays of Iligan City. 
          Each barangay is represented on the map, and you can hover over any barangay to view the number of traffic violations that have taken place there. 
          The data shown on the map helps to visualize the distribution of traffic violations throughout the city, 
          providing insights into areas with higher or lower rates of traffic offenses.
        </p>
        <p>
          Hover over each barangay to view the number of traffic violations that have taken place.
        </p>
        {selectedBarangay && (
          <div>
            <h4>{selectedBarangay}</h4>
            <p>Number of Violations: {records[normalizeString(selectedBarangay)] || 0}</p>
          </div>
        )}
      </div>
      <div style={{ flex: 2 }}>
        <MapContainer center={[8.1411, 124.3528]} zoom={10} style={{ height: '100%', width: '100%' }} className="leaflet-container">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
          />
          <GeoJSON
            data={iliganMap}
            onEachFeature={(feature, layer) => {
              const barangayName = normalizeString(feature.properties?.adm4_en);
              const violationsCount = violationCounts[barangayName] || 0; // Default to 0 if no violation count

              layer.on({
                mouseover: () => handleOnHover({ target: layer }),
                mouseout: handleMouseOut,
              });

              layer.setStyle({
                fillColor: getColor(violationsCount),
                weight: 2,
                opacity: 1,
                color: 'black',
                dashArray: '3',
                fillOpacity: 0.7,
              });

              layer.bindPopup(`<strong>${feature.properties.name}</strong><br>Violations: ${violationsCount}`);
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
