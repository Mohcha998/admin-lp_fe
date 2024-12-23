import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axiosInstance from "../api/axiosInstance"; // Import axiosInstance

const ParentsContext = createContext();

export const useParents = () => {
  return useContext(ParentsContext);
};

export const ParentsProvider = ({ children }) => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingDoubleSub, setLoadingDoubleSub] = useState(false);
  const [loadingByUserId, setLoadingByUserId] = useState(false);
  const [error, setError] = useState(null);

  const fetchParents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/parents");
      setParents(response.data);
    } catch (err) {
      setError(err.message || "Error fetching parents data");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchParentByUserId = useCallback(async (userId) => {
    setLoadingByUserId(true);
    try {
      const response = await axiosInstance.get(`/parents/parent-uid`);
      setParents([response.data]);
    } catch (err) {
      setError(err.message || "Error fetching parent data by userId");
    } finally {
      setLoadingByUserId(false);
    }
  }, []);

  const addParent = async (parentData) => {
    setLoadingAdd(true);
    try {
      const response = await axiosInstance.post("/parents", parentData);
      setParents((prev) => [...prev, response.data]);
    } catch (err) {
      setError(err.message || "Error adding parent");
    } finally {
      setLoadingAdd(false);
    }
  };

  const updateParent = async (id, parentData) => {
    setLoadingUpdate(true);
    try {
      const response = await axiosInstance.put(`/parents/${id}`, parentData);
      setParents((prev) =>
        prev.map((parent) => (parent.id === id ? response.data : parent))
      );
    } catch (err) {
      setError(err.message || "Error updating parent");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const deleteParent = async (id) => {
    setLoadingDelete(true);
    try {
      await axiosInstance.delete(`/parents/${id}`);
      setParents((prev) => prev.filter((parent) => parent.id !== id));
    } catch (err) {
      setError(err.message || "Error deleting parent");
    } finally {
      setLoadingDelete(false);
    }
  };

  const addDoubleSubParents = async (fatherData, motherData) => {
    setLoadingDoubleSub(true);
    try {
      const response = await axiosInstance.post("/sub-parents", {
        father: fatherData,
        mother: motherData,
      });
      setParents((prev) => [
        ...prev,
        { father: response.data.father, mother: response.data.mother },
      ]);
    } catch (err) {
      setError(err.message || "Error saving double parent data");
    } finally {
      setLoadingDoubleSub(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, [fetchParents]);

  return (
    <ParentsContext.Provider
      value={{
        parents,
        loading,
        loadingAdd,
        loadingUpdate,
        loadingDelete,
        loadingDoubleSub,
        loadingByUserId,
        error,
        fetchParents,
        fetchParentByUserId,
        addParent,
        updateParent,
        deleteParent,
        addDoubleSubParents,
      }}
    >
      {children}
    </ParentsContext.Provider>
  );
};
