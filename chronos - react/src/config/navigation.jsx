import {
  Users,
  BookOpen,
  CalendarDays,
  UserCheck,
  LayoutDashboard,
} from "lucide-react";

export const MENU_CONFIG = {
  instrutor: {
    dashboardPath: "/instrutor",
    secoes: [
      {
        label: "Acadêmico",
        titulo: "Controle de Frequência",
        icone: <UserCheck size={20} />,
        itens: [
          { nome: "Chamada do dia", rota: "/presenca" },
          { nome: "Minhas Turmas", rota: "/turmas" },
          { nome: "Minha Agenda", rota: "/agenda" },
        ],
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
        label: "Gestão de Usuários",
        titulo: "Controle de Acesso",
        icone: <LayoutDashboard size={20} />,
        itens: [
          { nome: "Usuários", rota: "/usuarios" },
          { nome: "Permissões", rota: "/permissoes" },
        ],
      },
    ],
  },
};
