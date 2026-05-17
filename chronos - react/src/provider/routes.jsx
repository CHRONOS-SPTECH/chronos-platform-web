import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Perfils from "../pages/Perfils";

//Homes
import HomeInstrutor from "../pages/instrutor/HomeInstrutor";
import HomeSecretario from "../pages/secretaria/HomeSecretario";
import HomeDiretor from "../pages/HomeDiretor";

import Presenca from "../pages/instrutor/Presenca";
import GestaoUsuarios from "../pages/secretaria/GestaoUsuarios";
import GestaoAcademica from "../pages/secretaria/GestaoAcademica";
import Eventos from "../pages/secretaria/Eventos";

import { elements } from "chart.js";

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
    element: <HomeInstrutor />,
  },
  {
    path: "/secretario",
    element: <HomeSecretario />,
  },
  {
    path: "/administrador",
    element: <HomeDiretor />,
  },
  {
    path: "/presenca",
    element: <Presenca />,
  },
  {
    path: "/perfis",
    element: <Perfils />,
  },
  {
    path: "/turmas",
    element: <GestaoAcademica />,
  },
  {
    path: "/agenda",
    element: <div>Tela de Agenda</div>,
  },
  {
    path: "/eventos",
    element: <Eventos />,
  },
  {
    path: "/usuarios",
    element: <GestaoUsuarios />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
