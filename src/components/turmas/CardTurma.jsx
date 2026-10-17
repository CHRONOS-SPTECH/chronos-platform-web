import { BookOpen, Calendar, Eye, Pencil, Trash2 } from "lucide-react";

function CardTurma({ turma, onVer, onEditar, onExcluir }) {
  const status = (turma.status || "").toLowerCase();
  const isFormado = status.includes("formad") || status.includes("conclu");

  {/* Assumindo uma variável para verificar se está inativa, por exemplo: */ }
  const isInativa = turma.status?.toLowerCase() === "inativa";

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 transition-all p-5 flex flex-col gap-4 group ${isInativa
          ? "opacity-60 grayscale-[20%]"
          : "hover:shadow-lg hover:shadow-gray-200/50"
        }`}
    >
      {/* Topo: ícone + status */}
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${isInativa ? "bg-gray-100" : "bg-[#e8f5e9]"}`}>
          <BookOpen size={22} className={isInativa ? "text-gray-400" : "text-[#00871D]"} />
    <div className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-900/10">
      <span className={`absolute inset-x-0 top-0 h-1 ${isFormado ? "bg-slate-400" : "bg-[#1E7A3C]"}`} />
      {/* Topo: ícone + status */}
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-blue-50 p-3">
          <BookOpen size={22} className="text-blue-800" />
        </div>

        <span
          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isInativa
              ? "bg-red-50 text-red-600 border border-red-100"
              : isFormado
                ? "bg-blue-50 text-blue-600 border border-blue-100"
                : "bg-green-50 text-green-700 border border-green-100"
            }`}
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
            className={`h-1.5 rounded-full transition-all ${isFormado ? "bg-blue-500" : "bg-[#00871D]"
              }`}
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
            disabled={isInativa}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
            aria-label={`Editar ${turma.nome}`}
            className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onExcluir?.(turma)}
            disabled={isInativa}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
            aria-label={`Excluir ${turma.nome}`}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <button
          onClick={() => onVer?.(turma)}
          className="bg-gray-900 hover:bg-gray-700 text-white text-[12px] font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
          className="bg-slate-900 hover:bg-blue-950 text-white text-[12px] font-bold px-4 py-2 rounded-xl transition-all"
        >
          {isFormado ? "Ver Histórico →" : "Ver Alunos →"}
        </button>
      </div>
    </div>
  );
}

export default CardTurma;
