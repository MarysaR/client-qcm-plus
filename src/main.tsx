import React from 'react';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import HomePage from './pages/home/HomePage';
import UsersPage from './pages/users/UsersPage';
import './styles/tailwind.css';
import Footer from './components/footer/Footer';
import CustomSidebar from './components/utils/CustomSidebar';
import ProfilPage from './pages/profil/ProfilPage';
import QuestionnairesPage from './pages/questionnaires/QuestionnairesPage';
import StatisticsPage from './pages/statistics/StatisticsPage';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* TODO: Passer le role en props dynamiquement */}
      {/* Sidebar*/}
      <CustomSidebar role="Stagiaire" />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/questionnaires" element={<QuestionnairesPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </BrowserRouter>
=======
import './styles/tailwind.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import AuthPage from './pages/auth/AuthPage';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
>>>>>>> 6cdabfd (authentification en mock)
  </React.StrictMode>
);
