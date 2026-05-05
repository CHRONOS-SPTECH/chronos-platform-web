import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import HomeInstrutor from "../pages/HomeInstrutor";
import HomeSecretario from "../pages/HomeSecretario";
import Presenca from "../pages/Presenca";
import Perfils from "../pages/Perfils";
import GestaoUsuarios from "../pages/GestaoUsuarios";

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
    path: "/presenca",
    element: <Presenca />,
  },
  {
    path: "/perfis",
    element: <Perfils />,
  },
  {
    path: "/turmas",
    element: <div>Tela de Turmas</div>,
  },
  {
    path: "/agenda",
    element: <div>Tela de Agenda</div>,
  },
  {
    path: "/eventos",
    element: <div>Tela de Eventos</div>,
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
