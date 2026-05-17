// src/pages/Eventos.jsx
import { useState } from "react";
import { Clock, MapPin, Pencil, Link as LinkIcon, Home } from "lucide-react";
import Sidebar from "../../components/sidebar/SideBar";

// ─── dados de exemplo ────────────────────────────────────────────────────────
const EVENTOS = [
  {
    id: 1,
    status: "OFICIALIZADO",
    statusVariant: "green",
    dia: "12",
    mes: "JUN",
    titulo: "Simpósio de Ética Aplicada",
    descricao:
      "Um encontro voltado para alunos e membros para discutir como aplicar as virtudes estoicas nos dilemas profissionais do século XXI.",
    horario: "14:00 – Sexta",
    local: "Auditório – Sala 1",
    tags: [
      { label: "Público Interno", variant: "green" },
      { label: "Oficina", variant: "teal" },
    ],
    headerBg: "bg-[#00871D]",
  },
  {
    id: 2,
    status: "PENDENTE DIRETOR",
    statusVariant: "orange",
    dia: "21",
    mes: "AGO",
    titulo: "Apresentação Artística – Sócrates",
    descricao:
      "Um encontro em ambiente aberto dedicado a dar visibilidade aos trabalhos dos alunos sobre a vida e o pensamento de Sócrates.",
    horario: "14:00 – Sexta",
    local: "Parque CECAP",
    tags: [
      { label: "Público Externo", variant: "gray" },
      { label: "Evento", variant: "blue" },
    ],
    headerBg: "bg-[#1A56A0]",
  },
  {
    id: 3,
    status: "PENDENTE DIRETOR",
    statusVariant: "orange",
    dia: "21",
    mes: "AGO",
    titulo: "Apresentação Artística – Sócrates",
    descricao:
      "Um encontro em ambiente aberto dedicado a dar visibilidade aos trabalhos dos alunos sobre a vida e o pensamento de Sócrates.",
    horario: "14:00 – Sexta",
    local: "Parque CECAP",
    tags: [
      { label: "Público Externo", variant: "gray" },
      { label: "Evento", variant: "blue" },
    ],
    headerBg: "bg-[#1A56A0]",
  },
];

// ─── mapas de estilo ──────────────────────────────────────────────────────────
const STATUS_STYLE = {
  green: "bg-green-100  text-green-700  border border-green-400",
  orange: "bg-orange-100 text-orange-600 border border-orange-400",
};

const TAG_STYLE = {
  green: "bg-[#00871D] text-white",
  teal: "bg-teal-500   text-white",
  gray: "bg-gray-500   text-white",
  blue: "bg-blue-600   text-white",
};

// ─── componente principal ─────────────────────────────────────────────────────
export default function Eventos() {
  const [moduloAtivo, setModuloAtivo] = useState("Eventos");

  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* ── Sidebar ── */}
      <Sidebar
        tipoUsuario="instrutor"
        usuario={{ inicial: "L", nome: "Lucas" }}
      />

      {/* ── Conteúdo principal ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className="bg-white border-b border-gray-200 px-8 py-4
                            flex items-center justify-between shrink-0"
        >
          <div className="flex items-center gap-2 text-gray-700 font-semibold text-base">
            <Home size={18} className="text-gray-400" />
            <span className="text-gray-400">/</span>
            <span>Gestão Acadêmica</span>
          </div>
          <span className="text-gray-400 text-sm capitalize">{hoje}</span>
        </header>

        {/* Área de scroll */}
        <main className="flex-1 overflow-auto px-8 py-6">
          {/* Módulos de controle */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-2">
                Módulos de Controle
              </p>
              <div className="flex gap-2">
                {["Aluno", "Turmas", "Eventos"].map((m) => {
                  const key = m === "Aluno" ? "Alunos" : m;
                  return (
                    <button
                      key={m}
                      onClick={() => setModuloAtivo(key)}
                      className={`px-5 py-1.5 rounded text-sm font-medium border transition-colors
                        ${
                          moduloAtivo === key
                            ? "bg-[#00871D] text-white border-[#00871D]"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              className="border-2 border-gray-800 text-gray-800 font-semibold
                               px-4 py-2 rounded text-sm hover:bg-gray-100 transition-colors"
            >
              + Adicionar Evento
            </button>
          </div>

          {/* Título da seção */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Eventos e Oficinas
            </h1>
            <div className="mt-1 w-36 h-0.5 bg-gray-800" />
          </div>

          {/* Grid de cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {EVENTOS.map((ev) => (
              <EventoCard key={ev.id} evento={ev} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── card de evento ───────────────────────────────────────────────────────────
function EventoCard({ evento: ev }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
      {/* Cabeçalho colorido */}
      <div
        className={`${ev.headerBg} relative h-24 flex items-start justify-end p-3`}
      >
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_STYLE[ev.statusVariant]}`}
        >
          {ev.status}
        </span>
        {/* Badge de data */}
        <div className="absolute bottom-3 left-4 bg-white rounded px-3 py-1.5 text-center shadow">
          <div className="text-xl font-bold text-gray-800 leading-none">
            {ev.dia}
          </div>
          <div className="text-[10px] text-gray-500 font-semibold uppercase">
            {ev.mes}
          </div>
        </div>
      </div>

      {/* Corpo */}
      <div className="p-4 flex flex-col flex-1 gap-2.5">
        <h2 className="font-bold text-gray-800 text-sm leading-snug">
          {ev.titulo}
        </h2>
        <p className="text-gray-500 text-xs leading-relaxed">{ev.descricao}</p>

        {/* Horário / Local + Tags */}
        <div className="flex gap-3 items-start mt-1">
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Clock size={14} className="text-[#00871D] shrink-0" />
              {ev.horario}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <MapPin size={14} className="text-[#00871D] shrink-0" />
              {ev.local}
            </div>
          </div>

          <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] text-gray-400">Tags:</span>
            <div className="flex flex-wrap gap-1">
              {ev.tags.map((t) => (
                <span
                  key={t.label}
                  className={`text-[10px] px-2 py-0.5 rounded font-medium ${TAG_STYLE[t.variant]}`}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer do card */}
        <div className="border-t border-gray-100 pt-3 mt-auto flex items-center justify-between">
          <button className="text-[#00871D] font-bold text-xs hover:underline">
            DETALHES
          </button>
          <div className="flex gap-2">
            <button className="border border-gray-200 rounded p-1.5 text-gray-500 hover:bg-gray-50">
              <Pencil size={14} />
            </button>
            <button
              className="border border-gray-200 rounded px-2 py-1.5 text-gray-500
                               hover:bg-gray-50 flex items-center gap-1 text-xs"
            >
              Link do Form <LinkIcon size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
