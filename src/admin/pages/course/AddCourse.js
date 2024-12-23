import React, { useState } from "react";
import { useProgram } from "../../../context/ProgramContext";

const AddCourse = () => {
  const { programs, loading, error, submitCourse } = useProgram();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [price, setPrice] = useState("");
  const [scheduleType, setScheduleType] = useState(1); // 1 = modular, 2 = full
  const [schedule, setSchedule] = useState([
    { module: 1, months: [], start_date: "", end_date: "" },
  ]);
  const [scheduleSubmitted, setScheduleSubmitted] = useState(false);

  const handleScheduleChange = (index, e) => {
    const updatedSchedule = [...schedule];
    if (e.target.name === "start_date" || e.target.name === "end_date") {
      updatedSchedule[index][e.target.name] = e.target.value;
    } else if (e.target.checked) {
      updatedSchedule[index].months.push(e.target.value);
    } else {
      updatedSchedule[index].months = updatedSchedule[index].months.filter(
        (month) => month !== e.target.value
      );
    }
    setSchedule(updatedSchedule);
  };

  const handleAddSchedule = () => {
    if (scheduleType === 1 && schedule.length >= 4) {
      alert("You can only add up to 4 modules for modular programs.");
      return;
    }
    setSchedule([
      ...schedule,
      { module: schedule.length + 1, months: [], start_date: "", end_date: "" },
    ]);
  };

  const handleSubmitSchedule = () => {
    console.log("Schedule submitted:", schedule);
    setScheduleSubmitted(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleSubmitted) {
      alert("Please submit the schedule before submitting the course.");
      return;
    }
    const courseData = {
      name: courseName,
      id_program: selectedProgram,
      price,
      schedule,
      course_type: scheduleType,
    };
    try {
      const result = await submitCourse(courseData);
      console.log("Course created", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title text-center mb-4">Create a New Course</h4>
          <form onSubmit={handleSubmit}>
            {/* Program Selection */}
            <div className="mb-3">
              <label className="form-label">Program</label>
              <select
                className="form-select"
                onChange={(e) => setSelectedProgram(e.target.value)}
                required
              >
                <option value="">Select Program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Name */}
            <div className="mb-3">
              <label className="form-label">Course Name</label>
              <input
                type="text"
                className="form-control"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
              />
            </div>

            {/* Price */}
            <div className="mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            {/* Schedule Type */}
            <div className="mb-3">
              <label className="form-label">Schedule Type</label>
              <div className="d-flex gap-3">
                <div className="form-check">
                  <input
                    type="radio"
                    name="scheduleType"
                    value={1}
                    checked={scheduleType === 1}
                    onChange={() => setScheduleType(1)}
                    className="form-check-input"
                  />
                  <label className="form-check-label">Modul</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    name="scheduleType"
                    value={2}
                    checked={scheduleType === 2}
                    onChange={() => setScheduleType(2)}
                    className="form-check-input"
                  />
                  <label className="form-check-label">Full Program</label>
                </div>
              </div>
            </div>

            {/* Render Schedules */}
            {schedule.map((item, index) => (
              <div key={index} className="mb-3 border p-3 rounded">
                <h5>Schedule - Module {item.module}</h5>
                <div className="mb-2">
                  <label className="form-label">Select Months</label>
                  <div>
                    {[...Array(12)].map((_, monthIndex) => {
                      const monthName = new Date(0, monthIndex).toLocaleString(
                        "en",
                        { month: "long" }
                      );
                      return (
                        <div key={monthName} className="form-check">
                          <input
                            type="checkbox"
                            value={monthName}
                            onChange={(e) => handleScheduleChange(index, e)}
                            className="form-check-input"
                          />
                          <label className="form-check-label">
                            {monthName}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={item.start_date}
                    onChange={(e) => handleScheduleChange(index, e)}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={item.end_date}
                    onChange={(e) => handleScheduleChange(index, e)}
                    className="form-control"
                  />
                </div>
              </div>
            ))}

            {/* Add Schedule */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddSchedule}
            >
              Add Schedule
            </button>

            {/* Submit Schedule */}
            <button
              type="button"
              className="btn btn-primary ms-3"
              onClick={handleSubmitSchedule}
            >
              Submit Schedule
            </button>

            {/* Submit Course */}
            <div className="mt-3 text-center">
              <button type="submit" className="btn btn-success">
                Submit Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
