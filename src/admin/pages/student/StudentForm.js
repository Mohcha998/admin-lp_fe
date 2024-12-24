import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useStudent } from "../../../context/StudentContext";
import { useBranch } from "../../../context/BranchContext";
import { useKelas } from "../../../context/KelasContext";

function StudentForm() {
  const { students, fetchStudents, addStudent, updateStudent } = useStudent();
  const {
    branches,
    loading: branchesLoading,
    error: branchesError,
  } = useBranch();

  const [forms, setForms] = useState([]);
  const location = useLocation();
  const { kelas, loading, error } = useKelas();

  useEffect(() => {
    // Sync forms state with students data
    setForms(
      students.map((student) => ({
        id: student.id,
        isOpen: false,
        dirawat: Boolean(student.dirawat) || false,
        isDirawat: Boolean(student.dirawat) || false,
        id_branch: student.id_branch || "",
        id_kelas: student.id_kelas || "",
        perubahan: student.perubahan || "",
        kelebihan: student.kelebihan || "",
        kondisi: student.kondisi || "",
        tindakan: student.tindakan || "",
        emergency_contact: student.emergency_contact || "",
        hubungan_eme: student.hubungan_eme || "",
        emergency_call: student.emergency_call || "",
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        tgl_lahir: student.tgl_lahir || "",
        asal_sekolah: student.asal_sekolah || "",
        ...student,
      }))
    );
  }, [students]);

  const toggleForm = (id) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id ? { ...form, isOpen: !form.isOpen } : form
      )
    );
  };

  const handleSubmit = async (event, id) => {
    event.preventDefault();
    const formData = forms.find((form) => form.id === id);
    if (formData) {
      await updateStudent(id, formData); // Make sure updateStudent is called correctly
      fetchStudents(); // Refresh student data
      console.log(`Form ${id} submitted`);
    }
  };

  const handleInputChange = (id, field, value) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id ? { ...form, [field]: value } : form
      )
    );
  };

  const navItems = [
    { path: "/admin/welcome", icon: "bx-home-circle", label: "Welcome" },
    { path: "/admin/parents", icon: "bx-user", label: "Parents" },
    { path: "/admin/student", icon: "bx-bell", label: "Student" },
    { path: "/admin/payment", icon: "bx-link-alt", label: "Payment" },
    { path: "/admin/dashboard", icon: "bx-cog", label: "Settings" },
  ];

  const handleDirawatChange = (id, value) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id ? { ...form, dirawat: value } : form
      )
    );
  };

  return (
    <div className="container mt-5">
      <ul className="nav nav-pills flex-column flex-md-row mb-3">
        {navItems.map((item) => (
          <li className="nav-item" key={item.path}>
            <NavLink
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <i className={`bx ${item.icon} me-1`} /> {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <h2>Student Form</h2>
      <div id="student-forms">
        {forms.map((form) => (
          <div className="card mb-3" key={form.id}>
            <div
              className="card-header"
              onClick={() => toggleForm(form.id)}
              style={{ cursor: "pointer" }}
            >
              <strong>{form.name}</strong>
              <span className="float-end">{form.isOpen ? "-" : "+"}</span>
            </div>
            {form.isOpen && (
              <div className="card-body">
                <form onSubmit={(e) => handleSubmit(e, form.id)}>
                  <div className="mb-3">
                    <label htmlFor={`name-${form.id}`} className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id={`name-${form.id}`}
                      name="name"
                      value={form.name}
                      onChange={(e) =>
                        handleInputChange(form.id, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor={`id_branch-${form.id}`}
                      className="form-label"
                    >
                      Branch
                    </label>
                    <select
                      className="form-control"
                      id={`id_branch-${form.id}`}
                      name="id_branch"
                      value={form.id_branch || ""}
                      onChange={(e) =>
                        handleInputChange(form.id, "id_branch", e.target.value)
                      }
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}, {branch.kota}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor={`email-${form.id}`} className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id={`email-${form.id}`}
                      name="email"
                      value={form.email}
                      onChange={(e) =>
                        handleInputChange(form.id, "email", e.target.value)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor={`phone-${form.id}`} className="form-label">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id={`phone-${form.id}`}
                      name="phone"
                      value={form.phone}
                      onChange={(e) =>
                        handleInputChange(form.id, "phone", e.target.value)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor={`tgl_lahir-${form.id}`}
                      className="form-label"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id={`tgl_lahir-${form.id}`}
                      name="tgl_lahir"
                      value={form.tgl_lahir}
                      onChange={(e) =>
                        handleInputChange(form.id, "tgl_lahir", e.target.value)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor={`asal_sekolah-${form.id}`}
                      className="form-label"
                    >
                      School
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id={`asal_sekolah-${form.id}`}
                      name="asal_sekolah"
                      value={form.asal_sekolah}
                      onChange={(e) =>
                        handleInputChange(
                          form.id,
                          "asal_sekolah",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor={`id_kelas-${form.id}`}
                      className="form-label"
                    >
                      Class Schedule
                    </label>
                    <select
                      className="form-control"
                      id={`id_kelas-${form.id}`}
                      name="id_kelas"
                      value={form.id_kelas}
                      defaultValue={form.id_kelas || ""}
                      disabled={loading}
                      onChange={(e) =>
                        handleInputChange(form.id, "id_kelas", e.target.value)
                      }
                    >
                      {loading ? (
                        <option>Loading...</option>
                      ) : error ? (
                        <option>{error}</option>
                      ) : (
                        kelas.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.name} ({k.start_time} - {k.end_time})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor={`perubahan-${form.id}`}
                      className="form-label"
                    >
                      What Changes Would You Like to See?
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id={`perubahan-${form.id}`}
                      name="perubahan"
                      value={form.perubahan}
                      onChange={(e) =>
                        handleInputChange(form.id, "perubahan", e.target.value)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor={`kelebihan-${form.id}`}
                      className="form-label"
                    >
                      What Are Your Child's Strengths?
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id={`kelebihan-${form.id}`}
                      name="kelebihan"
                      value={form.kelebihan}
                      onChange={(e) =>
                        handleInputChange(form.id, "kelebihan", e.target.value)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor={`dirawat-${form.id}`}
                      className="form-label"
                    >
                      Under Care?
                    </label>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        className="form-check-input"
                        id={`dirawat-yes-${form.id}`}
                        name={`dirawat-${form.id}`}
                        onChange={() => handleDirawatChange(form.id, true)}
                        checked={form.dirawat === 1}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`dirawat-yes-${form.id}`}
                      >
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        className="form-check-input"
                        id={`dirawat-no-${form.id}`}
                        name={`dirawat-${form.id}`}
                        onChange={() => handleDirawatChange(form.id, false)}
                        checked={form.dirawat === 0}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`dirawat-no-${form.id}`}
                      >
                        No
                      </label>
                    </div>
                  </div>

                  {form.dirawat && (
                    <>
                      <div className="mb-3">
                        <label
                          htmlFor={`kondisi-${form.id}`}
                          className="form-label"
                        >
                          Condition
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id={`kondisi-${form.id}`}
                          name="kondisi"
                          value={form.kondisi}
                          onChange={(e) =>
                            handleInputChange(
                              form.id,
                              "kondisi",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor={`tindakan-${form.id}`}
                          className="form-label"
                        >
                          Actions
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id={`tindakan-${form.id}`}
                          name="tindakan"
                          value={form.tindakan}
                          onChange={(e) =>
                            handleInputChange(
                              form.id,
                              "tindakan",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor={`emergency_contact-${form.id}`}
                          className="form-label"
                        >
                          Emergency Contact
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id={`emergency_contact-${form.id}`}
                          name="emergency_contact"
                          value={form.emergency_contact}
                          onChange={(e) =>
                            handleInputChange(
                              form.id,
                              "emergency_contact",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor={`hubungan_eme-${form.id}`}
                          className="form-label"
                        >
                          Emergency Relationship
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id={`hubungan_eme-${form.id}`}
                          name="hubungan_eme"
                          value={form.hubungan_eme}
                          onChange={(e) =>
                            handleInputChange(
                              form.id,
                              "hubungan_eme",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor={`emergency_call-${form.id}`}
                          className="form-label"
                        >
                          Emergency Contact Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id={`emergency_call-${form.id}`}
                          name="emergency_call"
                          value={form.emergency_call}
                          onChange={(e) =>
                            handleInputChange(
                              form.id,
                              "emergency_call",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </>
                  )}

                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentForm;
