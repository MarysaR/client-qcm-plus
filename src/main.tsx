import React from 'react';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // ou autre thème
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import './styles/tailwind.css';
import Footer from './components/Footer';
import CustomSidebar from './components/CustomSidebar';
import ProfilPage from './pages/ProfilPage';
import QuestionnairesPage from './pages/QuestionnairesPage';
import StatisticsPage from './pages/StatisticsPage';

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
  </React.StrictMode>
);