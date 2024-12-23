import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { BranchProvider } from "./context/BranchContext";
import { ProspectProvider } from "./context/ProspectContext";
import { ProgramProvider } from "./context/ProgramContext";
import { ParentsProvider } from "./context/ParentsContext";
import { CourseProvider } from "./context/CourseContext";
import { StudentProvider } from "./context/StudentContext";
import { KelasProvider } from "./context/KelasContext";
import LoginAdmin from "./admin/auth/LoginAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import AppAdmin from "./admin/AppAdmin";

function App() {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/admin/dashboard" /> : <LoginAdmin />}
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <BranchProvider>
                <ProspectProvider>
                  <ProgramProvider>
                    <ParentsProvider>
                      <CourseProvider>
                        <StudentProvider>
                          <KelasProvider>
                            <AppAdmin />
                          </KelasProvider>
                        </StudentProvider>
                      </CourseProvider>
                    </ParentsProvider>
                  </ProgramProvider>
                </ProspectProvider>
              </BranchProvider>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
