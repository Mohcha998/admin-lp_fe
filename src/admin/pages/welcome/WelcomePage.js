import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import axios from "axios";

const WelcomePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token tidak tersedia. Harap login kembali.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error(
          "Gagal memuat data pengguna:",
          error.response?.data?.message || error.message
        );
        setError("Gagal memuat data pengguna. Harap coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  const navItems = [
    { path: "/welcome", icon: "bx-home-circle", label: "Welcome" },
    { path: "/parents", icon: "bx-user", label: "Parents" },
    { path: "/student", icon: "bx-bell", label: "Student" },
    // { path: "/payment", icon: "bx-link-alt", label: "Payment" },
    { path: "/dashboard", icon: "bx-cog", label: "Settings" },
  ];

  return (
    <div className="container text-center">
      <ul className="nav nav-pills flex-column flex-md-row mb-3 mt-4">
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
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg mt-5">
            <div className="card-body">
              <h1 className="card-title mb-4">
                Selamat Datang, <span className="fw-bold">{user?.name || "Pengguna"}!</span>
              </h1>
              <p className="card-text">
                Kami senang Anda bergabung dengan kami. Semoga Anda menikmati
                pengalaman menggunakan aplikasi ini.
              </p>
              <div className="mt-4">
                <h4>Informasi Anda:</h4>
                <ul className="list-unstyled">
                  <li>
                    <strong>Nama:</strong> {user?.name || "Tidak tersedia"}
                  </li>
                  <li>
                    <strong>Email:</strong> {user?.email || "Tidak tersedia"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
