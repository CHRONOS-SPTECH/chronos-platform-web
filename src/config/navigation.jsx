import {
  BookOpenCheck,
  CalendarDays,
  CalendarRange,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  UserCog,
  UserCheck,
  Users,
  UsersRound,
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
          {
            nome: "Chamada do dia",
            action: "chamadaDoDia",
            icone: <ClipboardCheck size={16} />,
          },
          {
            nome: "Minha Agenda",
            rota: "/minha-agenda",
            icone: <CalendarDays size={16} />,
          },
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
          {
            nome: "Alunos",
            rota: "/alunos",
            icone: <GraduationCap size={16} />,
          },
          { nome: "Turmas", rota: "/turmas", icone: <UsersRound size={16} /> },
          {
            nome: "Eventos",
            rota: "/eventos",
            icone: <CalendarDays size={16} />,
          },
        ],
      },
      {
        label: "Dashboard",
        titulo: "Dashboard's",
        icone: <LayoutDashboard size={20} />,
        itens: [
          {
            nome: "Panorama Acadêmico",
            rota: "/dashboard-academica",
            icone: <LayoutDashboard size={16} />,
          },
        ],
      },
      {
        label: "Gestão Ano letivo",
        titulo: "Controle de Aulas",
        icone: <LayoutDashboard size={20} />,
        itens: [
          {
            nome: "Cronograma de Aulas",
            rota: "/cronograma",
            icone: <CalendarRange size={16} />,
          },
          {
            nome: "Gestão de Aulas",
            rota: "/gestao-aulas",
            icone: <BookOpenCheck size={16} />,
          },
        ],
      },
    ],
  },
  Administrador: {
    dashboardPath: "/administrador",
    secoes: [
      {
        label: "Dashboard",
        titulo: "Dashboard's",
        icone: <LayoutDashboard size={20} />,
        itens: [
          {
            nome: "Panorama Acadêmico",
            rota: "/dashboard-academica",
            icone: <LayoutDashboard size={16} />,
          },
          // { nome: "Engajamento das Atividades", rota: "/engajamento-atividades" },
        ],
      },
      {
        label: "Operacional",
        titulo: "Gestão Acadêmica",
        icone: <Users size={20} />,
        itens: [
          {
            nome: "Alunos",
            rota: "/alunos",
            icone: <GraduationCap size={16} />,
          },
          { nome: "Turmas", rota: "/turmas", icone: <UsersRound size={16} /> },
          {
            nome: "Eventos",
            rota: "/eventos",
            icone: <CalendarDays size={16} />,
          },
        ],
      },
      {
        label: "Gestão de Usuários",
        titulo: "Controle de Acesso",
        icone: <LayoutDashboard size={20} />,
        itens: [
          {
            nome: "Usuários",
            rota: "/usuarios",
            icone: <UserCog size={16} />,
          },
        ],
      },
    ],
  },
};
