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
    <HomePage />
  </React.StrictMode>,
);
