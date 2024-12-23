// src/components/CourseList.js
import React, { useState, useEffect } from "react";

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  return (
    <div>
      <h2>Course List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Program Type</th>
            <th>Price</th>
            <th>Schedules</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <td>{course.program.name}</td>
              <td>{course.price}</td>
              <td>
                {course.schedules?.map((schedule) => (
                  <div key={schedule.id}>
                    <p>
                      {schedule.month} {schedule.year}
                    </p>
                    <p>Module {schedule.module_number}</p>
                    <p>
                      Start: {schedule.start_date} - End: {schedule.end_date}
                    </p>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseList;
