import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/login/fonts/icomoon/style.css";
import "../../assets/login/css/owl.carousel.min.css";
import "../../assets/login/css/bootstrap.min.css";
import "../../assets/login/css/style.css";

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Load external scripts (optional)
    const loadScript = (src, id) => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.id = id;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const loadScripts = async () => {
      try {
        await loadScript(
          process.env.PUBLIC_URL + "/assets/login/js/jquery-3.3.1.min.js",
          "jquery-js"
        );
        await loadScript(
          process.env.PUBLIC_URL + "/assets/login/js/popper.min.js",
          "popper-js"
        );
        await loadScript(
          process.env.PUBLIC_URL + "/assets/login/js/bootstrap.min.js",
          "bootstrap-js"
        );
        await loadScript(
          process.env.PUBLIC_URL + "/assets/login/js/main.js",
          "main-js"
        );
      } catch (error) {
        console.error("Error loading scripts:", error);
      }
    };

    loadScripts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error message

    try {
      // Attempt to log the user in using the email and password
      const success = await login(email, password);
      if (success) {
        // If login is successful, navigate to the admin dashboard
        navigate("/");
      } else {
        setError("Login failed. Please check your username and password.");
      }
    } catch (err) {
      setError("Login failed. Please try again later.");
    }
  };

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <img
              src={
                process.env.PUBLIC_URL +
                "/assets/login/images/undraw_remotely_2j6y.svg"
              }
              alt="Image"
              className="img-fluid"
            />
          </div>
          <div className="col-md-6 contents">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="mb-4">
                  <h3>Sign In</h3>
                  <p className="mb-4">
                    Lorem ipsum dolor sit amet elit. Sapiente sit aut eos
                    consectetur adipisicing.
                  </p>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="form-group first">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group last mb-4">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-flex mb-5 align-items-center">
                    <label className="control control--checkbox mb-0">
                      <span className="caption">Remember me</span>
                      <input type="checkbox" defaultChecked />
                      <div className="control__indicator"></div>
                    </label>
                    <span className="ml-auto">
                      <a href="#" className="forgot-pass">
                        Forgot Password
                      </a>
                    </span>
                  </div>
                  <input
                    type="submit"
                    value="Log In"
                    className="btn btn-block btn-primary"
                  />
                  <span className="d-block text-left my-4 text-muted">
                    &mdash; or login with &mdash;
                  </span>
                  <div className="social-login">
                    <a href="#" className="facebook">
                      <span className="icon-facebook mr-3"></span>
                    </a>
                    <a href="#" className="twitter">
                      <span className="icon-twitter mr-3"></span>
                    </a>
                    <a href="#" className="google">
                      <span className="icon-google mr-3"></span>
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginAdmin;
