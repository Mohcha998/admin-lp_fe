import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const ProspectContext = createContext();

export const useProspect = () => {
  return useContext(ProspectContext);
};

export const ProspectProvider = ({ children }) => {
  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserParentData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token not found. Please log in.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user-parent",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setParentData(response.data.parent);
      setError(null);
    } catch (error) {
      console.error("Error fetching user parent data:", error);
      setError("Failed to fetch parent data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserParentData();
  }, []);

  return (
    <ProspectContext.Provider
      value={{
        parentData,
        loading,
        error,
        fetchUserParentData,
      }}
    >
      {children}
    </ProspectContext.Provider>
  );
};
