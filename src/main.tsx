import React from 'react';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // ou autre thème
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import UsersPage from './pages/users/UsersPage';
import './styles/tailwind.css';
import Footer from './components/footer/Footer';
import CustomSidebar from './components/utils/CustomSidebar';
import ProfilPage from './pages/profil/ProfilPage';
import QuestionnairesPage from './pages/questionnaires/QuestionnairesPage';
import StatisticsPage from './pages/statistics/StatisticsPage';
import CreateUserPage from './pages/users/CreateUserPage';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* TODO: Passer le role en props dynamiquement */}
      {/* Sidebar*/}
      <CustomSidebar role="Admin" />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/questionnaires" element={<QuestionnairesPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />

        <Route path="/new" element={<CreateUserPage />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </BrowserRouter>
  </React.StrictMode>
);
