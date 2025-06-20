import { Suspense } from "react";
import { useRoutes, Routes, Route, useSearchParams } from "react-router-dom";
import Home from "./components/home";
import PatientOnboarding from "./components/PatientOnboarding";
import AssessmentDashboard from "./components/AssessmentDashboard";
import TreatmentPlanCreator from "./components/TreatmentPlanCreator";
import PatientProgressTracker from "./components/PatientProgressTracker";
import UserManual from "./components/UserManual";
import ResourceHub from "./components/ResourceHub";
import AdminDashboard from "./components/AdminDashboard";
import AIPersonaGenerator from "./components/AIPersonaGenerator";
import WorkflowIntegration from "./components/WorkflowIntegration";
import APISetupGuide from "./components/APISetupGuide";
import LiveAPIDemo from "./components/LiveAPIDemo";
import RealTimeDashboard from "./components/RealTimeDashboard";
import PatientApp from "./components/PatientApp";
import PatientLinkGenerator from "./components/PatientLinkGenerator";
import Settings from "./components/Settings";
import SystemHealthDashboard from "./components/SystemHealthDashboard";
import AdminDebugDashboard from "./components/AdminDebugDashboard";
// import routes from "tempo-routes"; // Removed for production build

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
        {/* Tempo routes disabled for production */}
        <Routes>
          {/* Tempo routes disabled for production */}
          <Route path="/" element={<Home />} />
          <Route path="/patient-onboarding" element={<PatientOnboarding />} />
          <Route path="/assessment" element={<AssessmentDashboard />} />
          <Route path="/treatment-plan" element={<TreatmentPlanCreator />} />
          <Route
            path="/progress-tracker"
            element={<PatientProgressTrackerWrapper />}
          />
          <Route path="/resources" element={<ResourceHub />} />
          <Route path="/user-manual" element={<UserManual />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/ai-persona" element={<AIPersonaGenerator patientData={{
            personalInfo: {},
            medicalHistory: {},
            fertilityJourney: {},
            assessmentResults: {}
          }} />} />
          <Route path="/workflow" element={<WorkflowIntegration />} />
          <Route path="/api-setup" element={<APISetupGuide />} />
          <Route path="/live-demo" element={<LiveAPIDemo />} />
          <Route path="/dashboard" element={<RealTimeDashboard />} />
          <Route path="/patient-app" element={<PatientApp />} />
          <Route path="/patient-app/:patientId" element={<PatientApp />} />
          <Route path="/patient-link-generator" element={<PatientLinkGenerator />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/system-health" element={<SystemHealthDashboard />} />
          <Route path="/admin-debug" element={<AdminDebugDashboard />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
