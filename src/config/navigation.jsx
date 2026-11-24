import Activity from "lucide-react/icons/activity";
import BookOpenCheck from "lucide-react/icons/book-open-check";
import CalendarDays from "lucide-react/icons/calendar-days";
import CalendarRange from "lucide-react/icons/calendar-range";
import ClipboardCheck from "lucide-react/icons/clipboard-check";
import GraduationCap from "lucide-react/icons/graduation-cap";
import LayoutDashboard from "lucide-react/icons/layout-dashboard";
import UserCog from "lucide-react/icons/user-cog";
import UserCheck from "lucide-react/icons/user-check";
import Users from "lucide-react/icons/users";
import UsersRound from "lucide-react/icons/users-round";
import ShieldCheck from "lucide-react/icons/shield-check";

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
            codigoTela: "chamada",
            action: "chamadaDoDia",
            icone: <ClipboardCheck size={16} />,
          },
          {
            nome: "Minha Agenda",
            codigoTela: "agenda",
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
            codigoTela: "alunos",
            rota: "/alunos",
            icone: <GraduationCap size={16} />,
          },
          {
            nome: "Turmas",
            codigoTela: "turmas",
            rota: "/turmas",
            icone: <UsersRound size={16} />,
          },
          {
            nome: "Eventos",
            codigoTela: "eventos",
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
            codigoTela: "panorama-academico",
            rota: "/dashboard-academica",
            icone: <LayoutDashboard size={16} />,
          },
          {
            nome: "Engajamento das Atividades",
            codigoTela: "engajamento",
            rota: "/engajamento-atividades",
            icone: <Activity size={16} />,
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
            codigoTela: "cronograma",
            rota: "/cronograma",
            icone: <CalendarRange size={16} />,
          },
          {
            nome: "Gestão de Aulas",
            codigoTela: "gestao-aulas",
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
            codigoTela: "panorama-academico",
            rota: "/dashboard-academica",
            icone: <LayoutDashboard size={16} />,
          },
          {
            nome: "Engajamento das Atividades",
            codigoTela: "engajamento",
            rota: "/engajamento-atividades",
            icone: <Activity size={16} />,
          },
        ],
      },
      {
        label: "Operacional",
        titulo: "Gestão Acadêmica",
        icone: <Users size={20} />,
        itens: [
          {
            nome: "Alunos",
            codigoTela: "alunos",
            rota: "/alunos",
            icone: <GraduationCap size={16} />,
          },
          {
            nome: "Turmas",
            codigoTela: "turmas",
            rota: "/turmas",
            icone: <UsersRound size={16} />,
          },
          {
            nome: "Eventos",
            codigoTela: "eventos",
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
            codigoTela: "usuarios",
            rota: "/usuarios",
            icone: <UserCog size={16} />,
          },
          {
            nome: "Perfis e acessos",
            codigoTela: "perfis-acessos",
            rota: "/perfis-acessos",
            icone: <ShieldCheck size={16} />,
          },
        ],
      },
    ],
  },
};

const normalizarCodigoTela = (codigo) =>
  String(codigo || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_\s]+/g, "-")
    .trim();

const CODIGOS_TELA_EQUIVALENTES = {
  home: ["home", "painel"],
  "panorama-academico": ["panorama-academico", "dashboard-academica"],
  engajamento: ["engajamento", "engajamento-atividades"],
};

const codigosDaTela = (codigo) =>
  CODIGOS_TELA_EQUIVALENTES[codigo] || [codigo];

export function criarMenuPorTelas(config, telasPermitidas = []) {
  const telasAtivas = (Array.isArray(telasPermitidas) ? telasPermitidas : []).filter(
    (tela) => tela && tela.status_ativo !== false,
  );
  const telasPorCodigo = new Map(
    telasAtivas.map((tela) => [
      normalizarCodigoTela(tela.codigo_tela),
      tela,
    ]),
  );
  const buscarTela = (codigo) =>
    codigosDaTela(codigo)
      .map((codigoEquivalente) =>
        telasPorCodigo.get(normalizarCodigoTela(codigoEquivalente)),
      )
      .find(Boolean);

  return {
    ...config,
    homePermitida: Boolean(buscarTela("home")),
    homeNome: buscarTela("home")?.nome_tela || "Home",
    secoes: config.secoes
      .map((secao) => {
        const itensFiltrados = secao.itens
          .map((item, indice) => {
            const tela = buscarTela(item.codigoTela);
            return tela
              ? {
                  ...item,
                  nome: tela.nome_tela || item.nome,
                  grupo: tela.grupo,
                  ordem: tela.ordem,
                  indiceOriginal: indice,
                }
              : null;
          })
          .filter(Boolean);
        const label =
          itensFiltrados.find((item) => item.grupo)?.grupo || secao.label;
        const itens = itensFiltrados
          .sort((a, b) => {
            if (Number.isFinite(a.ordem) && Number.isFinite(b.ordem)) {
              return a.ordem - b.ordem;
            }
            return a.indiceOriginal - b.indiceOriginal;
          })
          .map(({ ordem, indiceOriginal, grupo, ...item }) => item);

        return { ...secao, label, itens };
      })
      .filter((secao) => secao.itens.length > 0),
  };
}
