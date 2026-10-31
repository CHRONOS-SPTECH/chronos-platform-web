import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import sessionService from "../services/sessionService";
import {
  loadHomeDiretor,
  loadHomeInstrutor,
  loadHomeSecretario,
  loadPerfils,
} from "./preloadPages";

import Login from "../pages/Login";

const Perfils = lazy(loadPerfils);
const HomeInstrutor = lazy(loadHomeInstrutor);
const HomeSecretario = lazy(loadHomeSecretario);
const HomeDiretor = lazy(loadHomeDiretor);
const Presenca = lazy(() => import("../pages/instrutor/Presenca"));
const GestaoUsuarios = lazy(() => import("../pages/secretaria/GestaoUsuarios"));
const DashboardAcademica = lazy(
  () => import("../pages/instrutor/DashboardAcademica"),
);
const Eventos = lazy(() => import("../pages/secretaria/Eventos"));
const DetalhesEvento = lazy(
  () => import("../pages/secretaria/DetalhesEvento"),
);
const FormularioEvento = lazy(
  () => import("../pages/secretaria/FormularioEvento"),
);
const Turmas = lazy(() => import("../pages/secretaria/Turmas"));
const Alunos = lazy(() => import("../pages/secretaria/Alunos"));
const CronogramaAulas = lazy(
  () => import("../pages/secretaria/CronogramaAulas"),
);
const GestaoAulas = lazy(() => import("../pages/secretaria/GestaoAulas"));
const AgendaInstrutorView = lazy(() => import("../pages/instrutor/Agenda"));



function PageLoading() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-slate-100 p-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex max-w-sm flex-col items-center gap-4 rounded-2xl bg-white px-8 py-10 text-center shadow-lg">
        <span
          className="size-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700"
          aria-hidden="true"
        />
        <div>
          <p className="font-semibold text-slate-800">Preparando sua tela</p>
          <p className="mt-1 text-sm text-slate-500">
            Isso pode levar alguns instantes na primeira visita.
          </p>
        </div>
      </div>
    </main>
  );
}

function lazyPage(Component) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Component />
    </Suspense>
  );
}

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
    element: <PrivateRoute element={lazyPage(HomeInstrutor)} />,
  },
  {
    path: "/secretario",
    element: <PrivateRoute element={lazyPage(HomeSecretario)} />,
  },
  {
    path: "/administrador",
    element: <PrivateRoute element={lazyPage(HomeDiretor)} />,
  },
  {
    path: "/presenca/:idTurma/:idAula",
    element: <PrivateRoute element={lazyPage(Presenca)} />,
  },
  {
    path: "/perfis",
    element: <PrivateRoute element={lazyPage(Perfils)} />,
  },
  {
    path: "/turmas",
    element: <PrivateRoute element={lazyPage(Turmas)} />,
  },
  {
    path: "/alunos",
    element: <PrivateRoute element={lazyPage(Alunos)} />,
  },
  {
    path: "/agenda",
    element: <PrivateRoute element={<div>Tela de Agenda</div>} />,
  },
  {
    path: "/cronograma",
    element: <PrivateRoute element={lazyPage(CronogramaAulas)} />,
  },
  {
    path: "/eventos",
    element: <PrivateRoute element={lazyPage(Eventos)} />,
  },
  {
    path: "/eventos/novo",
    element: <PrivateRoute element={lazyPage(FormularioEvento)} />,
  },
  {
    path: "/eventos/editar/:id",
    element: <PrivateRoute element={lazyPage(FormularioEvento)} />,
  },
  {
    path: "/eventos/:id",
    element: <PrivateRoute element={lazyPage(DetalhesEvento)} />,
  },
  {
    path: "/usuarios",
    element: <PrivateRoute element={lazyPage(GestaoUsuarios)} />,
  },
  {
    path: "/dashboard-academica",
    element: <PrivateRoute element={lazyPage(DashboardAcademica)} />,
  },
  {
    path: "/gestao-aulas",
    element: <PrivateRoute element={lazyPage(GestaoAulas)} />,
  },
  {
    path: "/minha-agenda",
    element: <PrivateRoute element={lazyPage(AgendaInstrutorView)} />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
