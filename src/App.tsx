import { Suspense } from "react";
import { useRoutes, Routes, Route, useSearchParams, useNavigate } from "react-router-dom";
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
import AdminTestingSuite from "./components/AdminTestingSuite";
import ClinicRegistration from "./components/ClinicRegistration";
import SimpleLogin from "./components/SimpleLogin";
import ProductionReadiness from "./components/ProductionReadiness";
import AdminSettings from "./components/AdminSettings";
// import routes from "tempo-routes"; // Removed for production build

// Simple Login component for demo
function Login() {
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    const mockUser = {
      id: 'demo-counselor',
      name: 'Dr. Demo Counselor',
      email: 'demo@santanacounseling.com',
      role: 'counselor',
      avatar: null
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Santaan.in</h2>
          <p className="mt-2 text-sm text-gray-600 italic">science for smiles</p>
          <p className="mt-4 text-lg text-gray-700">Demo Login</p>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleDemoLogin}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue as Demo Counselor
          </button>
          <p className="text-xs text-gray-500 text-center">
            This is a demo environment. Click above to access the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}

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
          <Route path="/login" element={<Login />} />
          <Route path="/simple-login" element={<SimpleLogin />} />
          <Route path="/clinic-registration" element={<ClinicRegistration />} />
          <Route path="/production-readiness" element={<ProductionReadiness />} />
          <Route path="/admin-settings" element={<AdminSettings />} />
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
          <Route path="/admin/testing-suite" element={<AdminTestingSuite />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
