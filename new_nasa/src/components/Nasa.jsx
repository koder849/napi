import { useEffect, useState } from "react";
import nasaLogo from "./../assets/nasa-6.svg";
import "../App.css";
import axios from "axios";

function Nasa() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const nasaAPIKey = import.meta.env.VITE_NASA_API_KEY;
  const apiUrl = import.meta.env.VITE_NASA_API_URL;
  const apiPng = import.meta.env.VITE_NASA_API_PNG;

  // Fetch data from NASA API
  const fetchNasaData = async () => {
    try {
      const response = await axios.get(apiUrl, {
        params: { api_key: nasaAPIKey },
      });

      if (response.data) {
        const formattedData = response.data.map((item) => {
          const date = item.date.split(" ")[0].replaceAll("-", "/");
          const imageUrl = `${apiPng}${date}/png/${item.image}.png?api_key=${nasaAPIKey}`;

          return {
            ...item,
            imageUrl,
          };
        });
        setData(formattedData);
        setError(null); // Clear error if data is fetched successfully
      }
    } catch (err) {
      console.error("Error fetching NASA data:", err);
      setError("Failed to fetch data from NASA API. Please try again later.");
    }
  };

  useEffect(() => {
    fetchNasaData();
  }, []);

  return (
    <>
      <div className="header">
        <a href="https://www.nasa.gov/" target="_blank" rel="noreferrer">
          <img src={nasaLogo} className="logo" alt="NASA logo" />
        </a>
        <h1>NASA EPIC Viewer</h1>
        <p>Explore daily Earth imagery from the DSCOVR EPIC instrument.</p>
      </div>

      {/* Only show error if the data isn't fetched */}
      {error && !data.length && <div className="error">{error}</div>}

      <div className="image-container">
        {data.map((item, index) => (
          <div key={index} className="image-card">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={`NASA image ${index + 1}`}
                className="photo"
              />
            ) : (
              <p>Image not available</p>
            )}

            <div className="metadata">
              <h3>{item.image}</h3>
              <p>
                <strong>Date:</strong> {item.date}
              </p>
              <p>
                <strong>Caption:</strong>{" "}
                {item.caption || "No caption available."}
              </p>
              <div className="metadata-block">
                <p>
                  <strong>Centroid Coordinates:</strong>{" "}
                  {`Lat: ${item.centroid_coordinates?.lat}, Lon: ${item.centroid_coordinates?.lon}`}
                </p>
                <p>
                  <strong>DSCOVR Position:</strong>{" "}
                  {JSON.stringify(item.dscovr_j2000_position)}
                </p>
                <p>
                  <strong>Lunar Position:</strong>{" "}
                  {JSON.stringify(item.lunar_j2000_position)}
                </p>
                <p>
                  <strong>Sun Position:</strong>{" "}
                  {JSON.stringify(item.sun_j2000_position)}
                </p>
                <p>
                  <strong>Attitude Quaternions:</strong>{" "}
                  {JSON.stringify(item.attitude_quaternions)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Nasa;
