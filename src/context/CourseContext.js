import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axiosInstance from "../api/axiosInstance";

export const CourseContext = createContext();

export const useCourse = () => {
  return useContext(CourseContext);
};

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [coursesByDate, setCoursesByDate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/courses");
      setCourses(response.data);
    } catch (err) {
      setError("Failed to fetch courses.");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCoursesByDate = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/courses_date");
      setCoursesByDate(response.data);
    } catch (err) {
      setError("Failed to fetch courses by date.");
      console.error("Error fetching courses by date:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDiscount = useCallback(async (voucherCode) => {
    try {
      const response = await axiosInstance.post("/discount-voc", {
        voucher_code: voucherCode,
      });
      return response.data.diskon;
    } catch (err) {
      console.error("Error fetching discount:", err);
      throw new Error("Invalid or expired voucher");
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchCoursesByDate();
  }, [fetchCourses, fetchCoursesByDate]);

  return (
    <CourseContext.Provider
      value={{
        courses,
        coursesByDate,
        loading,
        error,
        fetchCourses,
        fetchCoursesByDate,
        fetchDiscount,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
