import { Suspense } from "react";
import { useRoutes, Routes, Route, useSearchParams } from "react-router-dom";
import Home from "./components/home";
import PatientOnboarding from "./components/PatientOnboarding";
import AssessmentDashboard from "./components/AssessmentDashboard";
import TreatmentPlanCreator from "./components/TreatmentPlanCreator";
import PatientProgressTracker from "./components/PatientProgressTracker";
import routes from "tempo-routes";

// Wrapper component to handle patient parameter
function PatientProgressTrackerWrapper() {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patient");

  // Mock patient data to get patient name
  const mockPatients = [
    { id: "p1", name: "Priya Sharma" },
    { id: "p2", name: "Arjun Patel" },
    { id: "p3", name: "Kavya Reddy" },
    { id: "p4", name: "Rohit Gupta" },
    { id: "p5", name: "Ananya Singh" },
    { id: "p6", name: "Vikram Joshi" },
    { id: "p7", name: "Meera Nair" },
    { id: "p8", name: "Karan Malhotra" },
  ];

  const patient = mockPatients.find((p) => p.id === patientId);

  return (
    <PatientProgressTracker
      patientId={patientId || "p1"}
      patientName={patient?.name || "Priya Sharma"}
    />
  );
}

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Routes>
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" element={<div />} />
          )}
          <Route path="/" element={<Home />} />
          <Route path="/patient-onboarding" element={<PatientOnboarding />} />
          <Route path="/assessment" element={<AssessmentDashboard />} />
          <Route path="/treatment-plan" element={<TreatmentPlanCreator />} />
          <Route
            path="/progress-tracker"
            element={<PatientProgressTrackerWrapper />}
          />
          <Route
            path="/resources"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Resource Hub</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            }
          />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
