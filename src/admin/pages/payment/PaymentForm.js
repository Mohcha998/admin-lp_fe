import React, { useState, useEffect } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { useCourse } from "../../../context/CourseContext";

const PaymentForm = () => {
  const [program, setProgram] = useState("");
  const [numChildren, setNumChildren] = useState(1);
  const [voucherCode, setVoucherCode] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  const {
    coursesByDate,
    loading: coursesLoading,
    error: coursesError,
    fetchDiscount,
  } = useCourse();
  const navigate = useNavigate();

  useEffect(() => {
    setFinalAmount(totalAmount - discount);
  }, [totalAmount, discount]);

  const handleProgramChange = (e) => {
    setProgram(e.target.value);
    const selectedProgram = coursesByDate.find(
      (course) => course.id === parseInt(e.target.value)
    );
    if (selectedProgram) {
      calculateTotalAmount(selectedProgram.price, numChildren);
    }
  };

  const handleNumChildrenChange = (e) => {
    const value = Math.max(parseInt(e.target.value, 10), 1);
    setNumChildren(value);
    const selectedProgram = coursesByDate.find(
      (course) => course.id === parseInt(program)
    );
    if (selectedProgram) {
      calculateTotalAmount(selectedProgram.price, value);
    }
  };

  const handleVoucherChange = async (e) => {
    setVoucherCode(e.target.value);
    setLoading(true);

    if (!e.target.value) {
      setDiscount(0);
      setLoading(false);
      return;
    }

    try {
      const discountAmount = await fetchDiscount(e.target.value);
      setDiscount(discountAmount);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Invalid or expired voucher");
      setDiscount(0);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = (price, numChildren) => {
    setTotalAmount(price * numChildren);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    if (!program) {
      setError("Please select a program before proceeding.");
      setLoading(false);
      return;
    }

    const paymentData = {
      program_id: program,
      num_children: numChildren,
      voucher_code: voucherCode,
      total_amount: finalAmount,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/payment-sub",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.payment_link) {
        window.open(response.data.payment_link, "_blank");
        navigate("/invoice", {
          state: {
            paymentId: response.data.no_invoice,
          },
        });
      } else {
        setError(response.data.error || "An error occurred");
      }
    } catch (error) {
      setError("Error processing payment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { path: "/welcome", icon: "bx-home-circle", label: "Welcome" },
    { path: "/parents", icon: "bx-user", label: "Parents" },
    { path: "/student", icon: "bx-bell", label: "Student" },
    { path: "/payment", icon: "bx-link-alt", label: "Payment" },
    { path: "/dashboard", icon: "bx-cog", label: "Settings" },
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

        <h4 className="fw-bold py-3 mb-4">Payment Form</h4>
        <form onSubmit={handleSubmit}>
          <div className="card mb-4">
            <h5 className="card-header">Program Selection</h5>
            <div className="card-body">
              {coursesLoading && <p>Loading programs...</p>}
              {coursesError && <p className="text-danger">{coursesError}</p>}
              {!coursesLoading && !coursesError && (
                <>
                  <div className="mb-3">
                    <label htmlFor="program" className="form-label">
                      Program
                    </label>
                    <select
                      id="program"
                      className="form-control"
                      value={program}
                      onChange={handleProgramChange}
                    >
                      <option value="">Select a Program</option>
                      {coursesByDate.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name} (Rp {course.price.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="num_children" className="form-label">
                      Number of Children
                    </label>
                    <input
                      type="number"
                      id="num_children"
                      className="form-control"
                      min="1"
                      value={numChildren}
                      onChange={handleNumChildrenChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="voucher_code" className="form-label">
                      Voucher Code (Optional)
                    </label>
                    <input
                      type="text"
                      id="voucher_code"
                      className="form-control"
                      value={voucherCode}
                      onChange={handleVoucherChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="card mb-4">
            <h5 className="card-header">Invoice</h5>
            <div className="card-body">
              <p>Program Price: Rp {totalAmount.toLocaleString()}</p>
              <p>Discount: Rp {discount ? discount.toLocaleString() : 0}</p>
              <h5>Total to Pay: Rp {finalAmount.toLocaleString()}</h5>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !program}
          >
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
              ></span>
            ) : (
              "Proceed to Payment"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
