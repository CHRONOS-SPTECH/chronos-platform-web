import { useState } from "react";
import {
  Clock,
  MapPin,
  Pencil,
  Link as LinkIcon,
  CalendarPlus,
} from "lucide-react";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import ModulosControle from "../../components/turmas/ModuloControle";

// ─── Dados de exemplo estruturados ───────────────────────────────────────────
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
    headerBg: "bg-[#1E7A3C]",
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
      { label: "Público Ext.", variant: "gray" },
      { label: "Evento", variant: "blue" },
    ],
    headerBg: "bg-[#1A56A0]",
  },
  {
    id: 3,
    status: "OFICIALIZADO",
    statusVariant: "green",
    dia: "05",
    mes: "SET",
    titulo: "Ciclo de Leituras: O Caibalion",
    descricao:
      "Estudo aprofundado dos princípios herméticos e sua correlação com a filosofia clássica universal.",
    horario: "19:30 – Quinta",
    local: "Sala de Estudos II",
    tags: [
      { label: "Exclusivo", variant: "teal" },
      { label: "Grupo de Est.", variant: "blue" },
    ],
    headerBg: "bg-[#4F46E5]",
  },
];

// ─── Mapas de estilo consistentes ─────────────────────────────────────────────
const STATUS_STYLE = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  orange: "bg-amber-50 text-amber-700 border-amber-200",
};

const TAG_STYLE = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-100",
  teal: "bg-teal-50 text-teal-700 border-teal-100",
  gray: "bg-slate-100 text-slate-600 border-slate-200",
  blue: "bg-blue-50 text-blue-700 border-blue-100",
};

export default function Eventos() {
  const [moduloAtivo, setModuloAtivo] = useState("Eventos");

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans antialiased">
      <Sidebar tipoUsuario="secretario" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header titulo="Gestão Acadêmica" icone={CalendarPlus} />

        <main className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-slate-100 pb-4">
            <ModulosControle
              moduloAtivo={moduloAtivo}
              setModuloAtivo={setModuloAtivo}
            />

            <button className="flex items-center gap-2 bg-[#1E7A3C] hover:bg-[#165a2d] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition-all shadow-md shadow-green-100/50 active:scale-[0.98]">
              <CalendarPlus size={16} />
              Novo Evento
            </button>
          </div>

          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-2.5 text-slate-700">
              <h1 className="text-sm font-black tracking-widest text-slate-400 uppercase">
                Eventos e Oficinas Programadas
              </h1>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {EVENTOS.length} Registros encontrados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {EVENTOS.map((ev) => (
              <EventoCard key={ev.id} evento={ev} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Card de evento refinado ───────────────────────────────────────────────────
function EventoCard({ evento: ev }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200/60 transition-all duration-300 overflow-hidden flex flex-col group">
      <div
        className={`${ev.headerBg} relative h-24 flex items-start justify-end p-4 transition-all duration-300 group-hover:opacity-95`}
      >
        <span
          className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full border bg-white/95 backdrop-blur-sm shadow-sm ${STATUS_STYLE[ev.statusVariant]}`}
        >
          {ev.status}
        </span>

        {/* Badge de Data Flutuante */}
        <div className="absolute -bottom-5 left-5 bg-white border border-slate-100 rounded-2xl px-3.5 py-2 text-center shadow-md min-w-[58px] z-10">
          <div className="text-xl font-black text-slate-800 leading-none tracking-tight">
            {ev.dia}
          </div>
          <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">
            {ev.mes}
          </div>
        </div>
      </div>

      {/* Corpo do Card */}
      <div className="p-5 pt-8 flex flex-col flex-1 gap-4">
        {/* Título e Descrição */}
        <div className="flex flex-col gap-1.5">
          <h2 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-[#1E7A3C] transition-colors line-clamp-1">
            {ev.titulo}
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 h-8">
            {ev.descricao}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100/60">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1">
              <Clock size={11} className="text-[#1E7A3C] shrink-0" /> Horário
            </span>
            <span className="text-xs font-bold text-slate-600 truncate">
              {ev.horario}
            </span>
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1">
              <MapPin size={11} className="text-[#1E7A3C] shrink-0" /> Local
            </span>
            <span className="text-xs font-bold text-slate-600 truncate">
              {ev.local}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0">
            Tags:
          </span>
          <div className="flex flex-wrap gap-1">
            {ev.tags.map((t) => (
              <span
                key={t.label}
                className={`text-[9px] px-2.5 py-0.5 rounded-md font-black uppercase tracking-wide border ${TAG_STYLE[t.variant]}`}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Rodapé Interno do Card */}
        <div className="border-t border-slate-100 pt-4 mt-auto flex items-center justify-between">
          <button className="text-[#1E7A3C] font-black text-xs uppercase tracking-widest hover:text-[#165a2d] transition-colors focus:outline-none">
            Detalhes
          </button>

          <div className="flex gap-2">
            <button className="border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl p-2 transition-all active:scale-95 shadow-sm">
              <Pencil size={13} />
            </button>
            <button className="border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl px-3 py-2 transition-all flex items-center gap-1.5 text-xs font-bold active:scale-95 shadow-sm">
              Formulário <LinkIcon size={12} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
