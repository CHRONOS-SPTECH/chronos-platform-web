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
        </div>

        <span
          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isInativa
              ? "bg-red-50 text-red-600 border border-red-100"
              : isFormado
                ? "bg-blue-50 text-blue-600 border border-blue-100"
                : "bg-green-50 text-green-700 border border-green-100"
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
            style={{ width: `${turma.progresso}%` }}
          />
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <div className="flex gap-1">
          <button
            onClick={() => onVer?.(turma)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEditar?.(turma)}
            disabled={isInativa}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onExcluir?.(turma)}
            disabled={isInativa}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <button
          onClick={() => onVer?.(turma)}
          className="bg-gray-900 hover:bg-gray-700 text-white text-[12px] font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
        >
          {isFormado ? "Ver Histórico →" : "Ver Alunos →"}
        </button>
      </div>
    </div>
  );
}

export default CardTurma;
