import { Clock, Eye, Link as LinkIcon, MapPin, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_STYLE = {
  OFICIALIZADO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "PENDENTE DIRETOR": "bg-amber-50 text-amber-700 border-amber-200",
  CANCELADO: "bg-red-50 text-red-700 border-red-200",
};

const TAG_STYLE = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-100",
  teal: "bg-teal-50 text-teal-700 border-teal-100",
  gray: "bg-slate-100 text-slate-600 border-slate-200",
  blue: "bg-blue-50 text-blue-700 border-blue-100",
};

const formatDate = (date) => {
  if (!date) return { day: "--", month: "---" };
  const parsed = new Date(`${date}T00:00:00`);
  return {
    day: parsed.toLocaleDateString("pt-BR", { day: "2-digit" }),
    month: parsed
      .toLocaleDateString("pt-BR", { month: "short" })
      .replace(".", "")
      .toUpperCase(),
  };
};

const getValue = (event, ...keys) => keys.map((key) => event?.[key]).find(Boolean) || "";

export default function EventoCard({ evento, onExcluir }) {
  const navigate = useNavigate();
  const date = getValue(evento, "data_evento", "dataEvento", "data");
  const { day, month } = formatDate(date);
  const id = getValue(evento, "id_evento", "idEvento", "id");
  const status = getValue(evento, "status", "status_evento", "statusEvento") || "PENDENTE";
  const tags = Array.isArray(evento?.tags) ? evento.tags : [];
  const category = evento?.categoria?.nome || evento?.categoria_nome || evento?.categoriaNome;

  return (
    <article className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200/60 transition-all duration-300 overflow-hidden flex flex-col group">
      <div className="bg-[#1E7A3C] relative h-24 flex items-start justify-end p-4 transition-all duration-300 group-hover:opacity-95">
        <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full border bg-white/95 shadow-sm ${STATUS_STYLE[status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
          {status}
        </span>
        <div className="absolute -bottom-5 left-5 bg-white border border-slate-100 rounded-2xl px-3.5 py-2 text-center shadow-md min-w-[58px] z-10">
          <div className="text-xl font-black text-slate-800 leading-none tracking-tight">{day}</div>
          <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">{month}</div>
        </div>
      </div>

      <div className="p-5 pt-8 flex flex-col flex-1 gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-[#1E7A3C] transition-colors line-clamp-1">
            {getValue(evento, "titulo", "title") || "Evento sem título"}
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 h-8">
            {getValue(evento, "descricao", "description") || "Sem descrição cadastrada."}
          </p>
          {category && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{category}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100/60">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1"><Clock size={11} className="text-[#1E7A3C] shrink-0" /> Horário</span>
            <span className="text-xs font-bold text-slate-600 truncate">{getValue(evento, "hora_inicio_evento", "horaInicioEvento", "hora_inicio")} - {getValue(evento, "hora_fim_evento", "horaFimEvento", "hora_fim")}</span>
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1"><MapPin size={11} className="text-[#1E7A3C] shrink-0" /> Local</span>
            <span className="text-xs font-bold text-slate-600 truncate">{getValue(evento, "local", "local_evento", "localEvento") || "Não informado"}</span>
          </div>
        </div>

        {tags.length > 0 && <div className="flex items-center gap-2 mt-1"><span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0">Tags:</span><div className="flex flex-wrap gap-1">{tags.map((tag) => <span key={tag.label || tag} className={`text-[9px] px-2.5 py-0.5 rounded-md font-black uppercase tracking-wide border ${TAG_STYLE[tag.variant] || TAG_STYLE.gray}`}>{tag.label || tag}</span>)}</div></div>}

        <div className="border-t border-slate-100 pt-4 mt-auto flex items-center justify-between">
          <button onClick={() => navigate(`/eventos/${id}`)} className="text-[#1E7A3C] font-black text-xs uppercase tracking-widest hover:text-[#165a2d] transition-colors focus:outline-none flex items-center gap-1" aria-label={`Ver detalhes de ${evento.titulo}`}><Eye size={14} /> Detalhes</button>
          <div className="flex gap-2">
            <button onClick={() => navigate(`/eventos/editar/${id}`)} className="border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl p-2 transition-all active:scale-95 shadow-sm" aria-label={`Editar ${evento.titulo}`}><Pencil size={13} /></button>
            <button onClick={() => onExcluir(evento)} className="border border-slate-200 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl p-2 transition-all active:scale-95 shadow-sm" aria-label={`Excluir ${evento.titulo}`}><Trash2 size={13} /></button>
            <button type="button" className="border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl px-3 py-2 transition-all flex items-center gap-1.5 text-xs font-bold active:scale-95 shadow-sm"><span className="sr-only">Abrir </span>Formulário <LinkIcon size={12} className="text-slate-400" /></button>
          </div>
        </div>
      </div>
    </article>
  );
}