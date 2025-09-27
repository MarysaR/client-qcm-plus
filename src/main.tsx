import React from 'react';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import UsersPage from './pages/users/UsersPage';
import './styles/tailwind.css';
import Footer from './components/footer/Footer';
import CustomSidebar from './components/sidebar/CustomSidebar';
import ProfilPage from './pages/profil/ProfilPage';
import QuestionnairesPage from './pages/questionnaires/QuestionnairesPage';
import StatisticsPage from './pages/statistics/StatisticsPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AuthPage from './pages/auth/AuthPage';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        {/* TODO: Passer le role en props dynamiquement */}
        {/* Sidebar*/}
        <CustomSidebar role="Stagiaire" />

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<AuthPage />} />
          <Route
            path="/me"
            element={
              <ProtectedRoute>
                <ProfilPage />
              </ProtectedRoute>
            }
          />
          <Route path="/questionnaires" element={<QuestionnairesPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
        </Routes>

        {/* Footer */}
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
