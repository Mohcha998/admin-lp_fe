// src/contexts/StudentContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const StudentContext = createContext();

export const useStudent = () => {
  return useContext(StudentContext);
};

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all students
  const fetchStudents = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await axiosInstance.get("/students");
      setStudents(response.data);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch students";
      console.error("Error fetching students:", errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudent = async (id) => {
    try {
      const response = await axiosInstance.get(`/students/${id}`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch student";
      console.error("Error fetching student:", errorMsg);
      setError(errorMsg);
      throw err;
    }
  };

  // Add a new student
  const addStudent = async (data) => {
    setError(null); // Reset error state
    try {
      const response = await axiosInstance.post("/students", data);
      setStudents((prevStudents) => [...prevStudents, response.data]);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to add student";
      console.error("Error adding student:", errorMsg);
      setError(errorMsg);
      throw err;
    }
  };

  // Update student data
  const updateStudent = async (id, data) => {
    setError(null);
    try {
      const response = await axiosInstance.put(`/students/${id}`, data);
      const updatedStudent = response.data;

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === updatedStudent.id ? updatedStudent : student
        )
      );

      return updatedStudent;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update student";
      console.error("Error updating student:", errorMsg);
      setError(errorMsg);
      throw err;
    }
  };

  // Delete student by ID
  const deleteStudent = async (id) => {
    setError(null); // Reset error state
    try {
      await axiosInstance.delete(`/students/${id}`);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== id)
      );
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to delete student";
      console.error("Error deleting student:", errorMsg);
      setError(errorMsg);
      throw err;
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []); // Empty dependency array to run once

  return (
    <StudentContext.Provider
      value={{
        students,
        loading,
        error,
        fetchStudents,
        fetchStudent,
        addStudent,
        updateStudent,
        deleteStudent,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
