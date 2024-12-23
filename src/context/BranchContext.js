import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const BranchContext = createContext();

export const useBranch = () => {
  return useContext(BranchContext);
};

export const BranchProvider = ({ children }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get("/branches");
        setBranches(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching branches:", error);
        setError("Failed to load branches.");
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  return (
    <BranchContext.Provider value={{ branches, loading, error }}>
      {children}
    </BranchContext.Provider>
  );
};
