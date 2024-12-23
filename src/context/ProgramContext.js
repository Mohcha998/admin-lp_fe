import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosInstance"; // Import axiosInstance

const ProgramContext = createContext();

export const useProgram = () => {
  return useContext(ProgramContext);
};

export const ProgramProvider = ({ children }) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch programs data from backend
  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/programs");
      setPrograms(response.data);
    } catch (err) {
      setError("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  // Submit course function
  const submitCourse = async (courseData) => {
    try {
      const response = await axiosInstance.post("/courses", courseData);
      return response.data;
    } catch (error) {
      console.error("Error submitting course:", error);
      throw new Error("Failed to submit course.");
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <ProgramContext.Provider value={{ programs, loading, error, submitCourse }}>
      {children}
    </ProgramContext.Provider>
  );
};
