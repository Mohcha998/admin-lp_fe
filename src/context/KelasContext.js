import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const KelasContext = createContext();

export const useKelas = () => {
  return useContext(KelasContext);
};

export const KelasProvider = ({ children }) => {
  const [kelas, setKelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const response = await axiosInstance.get("/kelas");
        setKelas(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching kelas:", error);
        setError("Failed to load classes.");
        setLoading(false);
      }
    };

    fetchKelas();
  }, []);

  return (
    <KelasContext.Provider value={{ kelas, loading, error }}>
      {children}
    </KelasContext.Provider>
  );
};
