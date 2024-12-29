// src/hooks/useNasaImages.js
import { useEffect, useState } from "react";
import axios from "axios";

export function useNasaImages() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ensure you have these environment variables set in your .env file
  const nasaAPIKey = import.meta.env.VITE_NASA_API_KEY;
  const apiUrl = import.meta.env.VITE_NASA_API_URL; // e.g., 'https://api.nasa.gov/EPIC/api/natural'
  const apiPng = import.meta.env.VITE_NASA_API_PNG; // e.g., 'https://api.nasa.gov/EPIC/archive/natural/'

  useEffect(() => {
    const fetchNasaData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(apiUrl, {
          params: { api_key: nasaAPIKey },
        });

        if (response.data) {
          const formattedData = response.data.map((item) => {
            const date = item.date.split(" ")[0].replaceAll("-", "/");
            const imageUrl = `${apiPng}${date}/png/${item.image}.png?api_key=${nasaAPIKey}`;
            return { ...item, imageUrl };
          });

          setPhotos(formattedData);
          console.log("Fetched NASA Photos:", formattedData);
          setError(null); // Clear any previous errors on success
        }
      } catch (err) {
        console.error("Error fetching NASA data:", err);
        setError("Failed to fetch data from NASA API. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNasaData();
  }, [apiUrl, nasaAPIKey, apiPng]);

  return { photos, loading, error };
}
