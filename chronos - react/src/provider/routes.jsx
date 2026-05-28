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
import Turmas from "../pages/secretaria/Turmas";
import Alunos from "../pages/secretaria/Alunos";


import sessionService from "../services/sessionService";

function PrivateRoute({ element }) {
  // const token = sessionService.getToken();
   const token = true;
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
    path: "/presenca/:idAula",
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
    path: "/eventos",
    element: <PrivateRoute element={<Eventos />} />,
  },
  {
    path: "/usuarios",
    element: <PrivateRoute element={<GestaoUsuarios />} />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/dashboard-academica",
    element: <PrivateRoute element={<DashboardAcademica />} />,
  },
]);
