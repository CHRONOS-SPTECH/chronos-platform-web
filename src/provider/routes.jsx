import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Perfils from "../pages/Perfils";

//Homes
import HomeInstrutor from "../pages/instrutor/HomeInstrutor";
import HomeSecretario from "../pages/secretaria/HomeSecretario";
import HomeDiretor from "../pages/HomeDiretor";

import Presenca from "../pages/instrutor/Presenca";
import GestaoUsuarios from "../pages/secretaria/GestaoUsuarios";
import DashboardAcademica from "../pages/instrutor/DashboardAcademica";

import Eventos from "../pages/secretaria/Eventos";
import DetalhesEvento from "../pages/secretaria/DetalhesEvento";
import FormularioEvento from "../pages/secretaria/FormularioEvento";
import Turmas from "../pages/secretaria/Turmas";
import Alunos from "../pages/secretaria/Alunos";

import CronogramaAulas from "../pages/secretaria/CronogramaAulas";
import GestaoAulas from "../pages/secretaria/GestaoAulas";
import AgendaInstrutorView from "../pages/instrutor/Agenda";

import sessionService from "../services/sessionService";

function PrivateRoute({ element }) {
  const token = sessionService.getToken();
  return token ? (
    element
  ) : (
    <Navigate to="/login" replace state={{ unauthorized: true }} />
  );
}

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/instrutor",
    element: <PrivateRoute element={<HomeInstrutor />} />,
  },
  {
    path: "/secretario",
    element: <PrivateRoute element={<HomeSecretario />} />,
  },
  {
    path: "/administrador",
    element: <PrivateRoute element={<HomeDiretor />} />,
  },
  {
    path: "/presenca/:idTurma/:idAula",
    element: <PrivateRoute element={<Presenca />} />,
  },
  {
    path: "/perfis",
    element: <PrivateRoute element={<Perfils />} />,
  },
  {
    path: "/turmas",
    element: <PrivateRoute element={<Turmas />} />,
  },
  {
    path: "/alunos",
    element: <PrivateRoute element={<Alunos />} />,
  },
  {
    path: "/agenda",
    element: <PrivateRoute element={<div>Tela de Agenda</div>} />,
  },
  {
    path: "/cronograma",
    element: <PrivateRoute element={<CronogramaAulas />} />,
  },
  {
    path: "/eventos",
    element: <PrivateRoute element={<Eventos />} />,
  },
  {
    path: "/eventos/novo",
    element: <PrivateRoute element={<FormularioEvento />} />,
  },
  {
    path: "/eventos/editar/:id",
    element: <PrivateRoute element={<FormularioEvento />} />,
  },
  {
    path: "/eventos/:id",
    element: <PrivateRoute element={<DetalhesEvento />} />,
  },
  {
    path: "/usuarios",
    element: <PrivateRoute element={<GestaoUsuarios />} />,
  },
  {
    path: "/dashboard-academica",
    element: <PrivateRoute element={<DashboardAcademica />} />,
  },
  {
    path: "/gestao-aulas",
    element: <PrivateRoute element={<GestaoAulas />} />,
  },
  {
    path: "/minha-agenda",
    element: <PrivateRoute element={<AgendaInstrutorView />} />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
