import { Users, UserCheck, LayoutDashboard } from "lucide-react";

export const MENU_CONFIG = {
  instrutor: {
    dashboardPath: "/instrutor",
    secoes: [
      {
        label: "Acadêmico",
        titulo: "Controle de Frequência",
        icone: <UserCheck size={20} />,
        itens: [{ nome: "Chamada do dia", action: "chamadaDoDia" }],
      },
    ],
  },
  secretario: {
    dashboardPath: "/secretario",
    secoes: [
      {
        label: "Operacional",
        titulo: "Gestão Acadêmica",
        icone: <Users size={20} />,
        itens: [
          { nome: "Alunos", rota: "/alunos" },
          { nome: "Turmas", rota: "/turmas" },
          { nome: "Eventos", rota: "/eventos" },
        ],
      },
      {
        label: "Gestão Ano letivo",
        titulo: "Controle de Aulas",
        icone: <LayoutDashboard size={20} />,
        itens: [
          { nome: "Cronograma de Aulas", rota: "/cronograma" },
          { nome: "Gestão de Aulas", rota: "/gestao-aulas" },
        ],
      },
    ],
  },
  Administrador: {
    dashboardPath: "/administrador",
    secoes: [
      {
        label: "Operacional",
        titulo: "Dashboard's",
        icone: <LayoutDashboard size={20} />,
        itens: [
          { nome: "Panorama Acadêmico" },
          { nome: "Engajamento das Atividades" },
        ],
      },
      {
        label: "Gestão de Usuários",
        titulo: "Controle de Acesso",
        icone: <LayoutDashboard size={20} />,
        itens: [{ nome: "Usuários", rota: "/usuarios" }],
      },
    ],
  },
};
