import { BookOpen, Calendar, Eye, Pencil, Trash2 } from "lucide-react";

function CardTurma({ turma, onVer, onEditar, onExcluir }) {
  const status = (turma.status || "").toLowerCase();
  const isFormado = status.includes("formad") || status.includes("conclu");

  return (
    <div className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-900/10">
      <span className={`absolute inset-x-0 top-0 h-1 ${isFormado ? "bg-slate-400" : "bg-[#1E7A3C]"}`} />
      {/* Topo: ícone + status */}
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-blue-50 p-3">
          <BookOpen size={22} className="text-blue-800" />
        </div>
        <span
          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
            isFormado
              ? "border border-slate-200 bg-slate-100 text-slate-700"
              : "border border-emerald-100 bg-emerald-50 text-emerald-800"
          }`}
        >
          {turma.status}
        </span>
      </div>

      {/* Título */}
      <h3 className="font-bold text-gray-800 text-[15px] leading-snug">
        {turma.nome}
      </h3>

      {/* Datas */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          <Calendar size={13} className="text-gray-400" />
          <span>{turma.dataInicio}</span>
          <Calendar size={13} className="text-gray-400 ml-2" />
          <span>{turma.dataFim}</span>
        </div>
      </div>

      {/* Progresso */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-gray-400 font-semibold">
            Progresso do Curso
          </span>
          <span className="text-[11px] font-black text-gray-700">
            {turma.progresso}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${
              isFormado ? "bg-slate-500" : "bg-[#1E7A3C]"
            }`}
            style={{ width: `${turma.progresso}%` }}
          />
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <div className="flex gap-1">
          <button
            onClick={() => onVer?.(turma)}
            aria-label={`Visualizar ${turma.nome}`}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEditar?.(turma)}
            aria-label={`Editar ${turma.nome}`}
            className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onExcluir?.(turma)}
            aria-label={`Excluir ${turma.nome}`}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <button
          onClick={() => onVer?.(turma)}
          className="bg-slate-900 hover:bg-blue-950 text-white text-[12px] font-bold px-4 py-2 rounded-xl transition-all"
        >
          {isFormado ? "Ver Histórico →" : "Ver Alunos →"}
        </button>
      </div>
    </div>
  );
}

export default CardTurma;
