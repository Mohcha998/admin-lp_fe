import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Invoice = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const paymentId = location.state?.paymentId;
      if (!paymentId) {
        setError("Payment ID is missing.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/payment-details/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPaymentDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching payment details.");
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [location]);

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return <p>Loading payment details...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="content-wrapper">
      <div className="container-xxl flex-grow-1 container-p-y">
        <h4 className="fw-bold py-3 mb-4">Payment Invoice</h4>

        {paymentDetails && (
          <>
            <div className="card mb-4">
              <h5 className="card-header">Invoice Details</h5>
              <div className="card-body">
                <p>
                  <strong>Invoice Number:</strong> {paymentDetails.no_invoice}
                </p>
                <p>
                  <strong>Order Number:</strong>{" "}
                  {paymentDetails.no_pemesanan || "N/A"}
                </p>
                <p>
                  <strong>Payer Email:</strong>{" "}
                  {paymentDetails.payer_email || "N/A"}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {paymentDetails.description || "N/A"}
                </p>
                <p>
                  <strong>Date Paid:</strong>{" "}
                  {paymentDetails.date_paid || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {paymentDetails.status_pembayaran === 1 ? "Paid" : "Pending"}
                </p>
                <p>
                  <strong>Admin Fee:</strong> Rp{" "}
                  {paymentDetails.biaya_admin?.toLocaleString() || "0"}
                </p>
                <h5>
                  <strong>Total Amount:</strong> Rp{" "}
                  {paymentDetails.total.toLocaleString()}
                </h5>
              </div>
            </div>

            <div className="card mb-4">
              <h5 className="card-header">Thank You!</h5>
              <div className="card-body">
                <p>
                  Your payment has been successfully processed. Thank you for
                  choosing our service!
                </p>
              </div>
            </div>

            <button onClick={handleGoBack} className="btn btn-primary">
              Go Back to Payment Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Invoice;
