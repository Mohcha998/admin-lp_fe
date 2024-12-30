import React, { useState, useContext, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useBranch } from "../../../context/BranchContext";
import { useProgram } from "../../../context/ProgramContext";
import { useProspect } from "../../../context/ProspectContext";

const AdminDashboard = () => {
  const { branches, loading: branchLoading, error: branchError } = useBranch();
  const {
    programs,
    loading: programLoading,
    error: programError,
  } = useProgram();
  const {
    parentData,
    loading: prospectLoading,
    error: prospectError,
  } = useProspect();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    id_cabang: "",
    id_program: "",
    phone: "",
    source: "",
  });

  const location = useLocation();

  useEffect(() => {
    if (parentData) {
      setFormData({
        ...formData,
        name: parentData.name || "",
        email: parentData.email || "",
        id_cabang: parentData.id_cabang || "",
        id_program: parentData?.id_program || "",
        phone: parentData.phone || "",
        source: parentData.source || "",
      });
    }
  }, [parentData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const navItems = [
    { path: "/welcome", icon: "bx-home-circle", label: "Welcome" },
    { path: "/parents", icon: "bx-user", label: "Parents" },
    { path: "/student", icon: "bx-bell", label: "Student" },
    // { path: "/payment", icon: "bx-link-alt", label: "Payment" },
    { path: "/dashboard", icon: "bx-cog", label: "Settings" },
  ];

  return (
    <div className="content-wrapper">
      {/* Navigation */}
      <div className="container-xxl flex-grow-1 container-p-y">
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

        {/* Content */}
        <h4 className="fw-bold py-3 mb-4">Account Setting</h4>

        {location.pathname === "/dashboard" && (
          <div className="row">
            <div className="col-md-12">
              <div className="card mb-4">
                <h5 className="card-header">Father</h5>
                <div className="card-body">
                  <form
                    id="formAccountSettings"
                    method="POST"
                    onSubmit={handleSubmit}
                  >
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="name" className="form-label">
                          Name
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="email" className="form-label">
                          E-mail
                        </label>
                        <input
                          className="form-control"
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="id_cabang" className="form-label">
                          Branch
                        </label>
                        <select
                          className="form-control"
                          id="id_cabang"
                          name="id_cabang"
                          value={formData.id_cabang}
                          onChange={handleChange}
                        >
                          {branchLoading ? (
                            <option value="">Loading...</option>
                          ) : branchError ? (
                            <option value="">{branchError}</option>
                          ) : (
                            branches.map((branch) => (
                              <option key={branch.id} value={branch.id}>
                                {branch.name}, {branch.kota}
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="id_program" className="form-label">
                          Program
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="id_program"
                          name="id_program"
                          value={
                            programs?.find(
                              (program) => program.id === formData.id_program
                            )?.name || ""
                          }
                          onChange={handleChange}
                          readOnly
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="phone" className="form-label">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          className="form-control"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="source" className="form-label">
                          Source
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="source"
                          name="source"
                          value={formData.source}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <button type="submit" className="btn btn-primary me-2">
                        Save changes
                      </button>
                      <button
                        type="reset"
                        className="btn btn-outline-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="content-footer footer bg-footer-theme">
        <div className="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column"></div>
      </footer>
      <div className="content-backdrop fade" />
    </div>
  );
};

export default AdminDashboard;
