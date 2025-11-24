import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DashboardMedico from "./pages/DashboardMedico";
import DashboardUtente from "./pages/DashboardUtente";
import MedicoPatients from "./pages/MedicoPatients";
import PatientDetail from "./pages/PatientDetail";
import Pedidos from "./pages/Pedidos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Médico Routes */}
            <Route
              path="/medico/dashboard"
              element={
                <ProtectedRoute requiredRole="medico">
                  <DashboardMedico />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medico/pacientes"
              element={
                <ProtectedRoute requiredRole="medico">
                  <MedicoPatients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medico/paciente/:id"
              element={
                <ProtectedRoute requiredRole="medico">
                  <PatientDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medico/pedidos"
              element={
                <ProtectedRoute requiredRole="medico">
                  <Pedidos />
                </ProtectedRoute>
              }
            />
            
            {/* Utente Routes */}
            <Route
              path="/utente/dashboard"
              element={
                <ProtectedRoute requiredRole="utente">
                  <DashboardUtente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/utente/pedidos"
              element={
                <ProtectedRoute requiredRole="utente">
                  <Pedidos />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
