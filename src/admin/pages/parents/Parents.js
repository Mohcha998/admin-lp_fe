import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";

const Parents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  const [parentDataState, setParentDataState] = useState({
    father: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    mother: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const fetchParentByUserId = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/parent-uid", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const parents = response.data;

      const father = parents.find((parent) => parent.is_father === 1);
      const mother = parents.find((parent) => parent.is_mother === 1);

      setParentDataState({
        father: {
          name: father?.name || "",
          email: father?.email || "",
          phone: father?.phone || "",
          address: father?.address || "",
        },
        mother: {
          name: mother?.name || "",
          email: mother?.email || "",
          phone: mother?.phone || "",
          address: mother?.address || "",
        },
      });
    } catch (err) {
      setError("Error fetching parent data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParentByUserId();
  }, [fetchParentByUserId]);

  // Handle input change
  const handleParentChange = (parentType, e) => {
    setParentDataState((prevState) => ({
      ...prevState,
      [parentType]: {
        ...prevState[parentType],
        [e.target.name]: e.target.value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = {
      father: {
        ...parentDataState.father,
        is_father: 1,
      },
      mother: {
        ...parentDataState.mother,
        is_mother: 1,
      },
    };

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/sub-parents",
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Parents submitted:", response.data);
    } catch (error) {
      console.error("Error submitting parent data:", error);
    }
  };

  const navItems = [
    { path: "/admin/welcome", icon: "bx-home-circle", label: "Welcome" },
    { path: "/admin/parents", icon: "bx-user", label: "Parents" },
    { path: "/admin/student", icon: "bx-bell", label: "Student" },
    { path: "/admin/payment", icon: "bx-link-alt", label: "Payment" },
    { path: "/admin/dashboard", icon: "bx-cog", label: "Settings" },
  ];

  return (
    <div className="content-wrapper">
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

        <h4 className="fw-bold py-3 mb-4">Parent Information</h4>
        <form onSubmit={handleSubmit}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* Father Input */}
              <div className="card mb-4">
                <h5 className="card-header">Father</h5>
                <div className="card-body">
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="father_name" className="form-label">
                        Name
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        id="father_name"
                        name="name"
                        value={parentDataState.father.name}
                        onChange={(e) => handleParentChange("father", e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="father_email" className="form-label">
                        E-mail
                      </label>
                      <input
                        className="form-control"
                        type="email"
                        id="father_email"
                        name="email"
                        value={parentDataState.father.email}
                        onChange={(e) => handleParentChange("father", e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="father_phone" className="form-label">
                        Phone Number
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        id="father_phone"
                        name="phone"
                        value={parentDataState.father.phone}
                        onChange={(e) => handleParentChange("father", e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="father_address" className="form-label">
                        Address
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        id="father_address"
                        name="address"
                        value={parentDataState.father.address}
                        onChange={(e) => handleParentChange("father", e)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mother Input */}
              <div className="card mb-4">
                <h5 className="card-header">Mother</h5>
                <div className="card-body">
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="mother_name" className="form-label">
                        Name
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        id="mother_name"
                        name="name"
                        value={parentDataState.mother.name}
                        onChange={(e) => handleParentChange("mother", e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="mother_email" className="form-label">
                        E-mail
                      </label>
                      <input
                        className="form-control"
                        type="email"
                        id="mother_email"
                        name="email"
                        value={parentDataState.mother.email}
                        onChange={(e) => handleParentChange("mother", e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="mother_phone" className="form-label">
                        Phone Number
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        id="mother_phone"
                        name="phone"
                        value={parentDataState.mother.phone}
                        onChange={(e) => handleParentChange("mother", e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="mother_address" className="form-label">
                        Address
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        id="mother_address"
                        name="address"
                        value={parentDataState.mother.address}
                        onChange={(e) => handleParentChange("mother", e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {error && <p className="text-danger">{error}</p>}
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Parents;
