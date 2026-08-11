import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Play, Clock } from "@phosphor-icons/react";
import api from "../../services/api";
import sessionService from "../../services/sessionService";
import { getHojeIso } from "../../utils/DateUtils";

function Cronograma() {
  const navigate = useNavigate();
  const [aulas, setAulas] = useState([]);
  const [dataTexto, setDataTexto] = useState("");

  // Busca inicial dos dados do cronograma
  useEffect(() => {
    const carregarAulas = async () => {
      try {
        const dadosSessao = sessionService.getSession();
        if (!dadosSessao) return;

        const instrutorId = dadosSessao?.usuario?.id_usuario;
        if (!instrutorId) return;

        const hoje = getHojeIso();

        // Formata a data atual por extenso para o cabeçalho
        const texto = new Date().toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        });
        setDataTexto(texto.charAt(0).toUpperCase() + texto.slice(1));

        const res = await api.get(
          `/aulas/dia?data=${hoje}&instrutorId=${instrutorId}`,
        );
        setAulas(res.data);
      } catch (err) {
        console.error("Erro ao buscar aulas:", err);
      }
    };

    carregarAulas();
  }, []);

  return (
    <div className="flex flex-col w-full animate-fade-in">
      {/* Título da Seção */}
      <p className="text-xs font-black tracking-[0.2em] text-slate-400 uppercase mb-3 ml-1">
        Cronograma do Dia
      </p>

      {/* Card Header (Data e Contador) */}
      <div className="bg-[#1E7A3C] text-white rounded-t-2xl px-6 py-4 flex items-center justify-between shadow-lg shadow-green-900/10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold tracking-tight">
            {dataTexto || "Carregando data..."}
          </span>
        </div>
        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider">
          {aulas.length} {aulas.length === 1 ? "aula" : "aulas"}
        </span>
      </div>

      {/* Corpo do Cronograma / Lista de Cards */}
      <div className="bg-white border-x border-b border-slate-100 rounded-b-2xl overflow-hidden shadow-sm">
        {aulas.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400 font-medium">
            Nenhuma aula agendada para hoje.
          </div>
        ) : (
          aulas.map((item, idx) => {
            const aula = item?.aula ?? {};
            const { id_aula, id_turma, statusAula, hora_inicio } = aula;
            const isConcluida = Boolean(
              item?.chamadaFeita ?? aula?.chamadaFeita,
            );
            const isEmAndamento =
              statusAula === "Agendada" || statusAula === "Em andamento";

            return (
              <div
                key={id_aula}
                onClick={() => navigate(`/presenca/${id_turma}/${id_aula}`)}
                className="flex items-center gap-4 px-6 py-4 border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors group cursor-pointer"
              >
                {/* Indicador de Status (Ícone lateral) */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isConcluida
                      ? "bg-emerald-50 text-emerald-600"
                      : isEmAndamento
                        ? "bg-blue-50 text-blue-600"
                        : "bg-slate-50 text-slate-400"
                  }`}
                >
                  {isConcluida ? (
                    <Check size={16} weight="bold" />
                  ) : isEmAndamento ? (
                    <Play size={14} weight="fill" />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Textos Informativos (Matéria e Tema) */}
                <div className="flex-1 flex flex-col">
                  <span className="text-sm font-bold text-slate-700 tracking-tight group-hover:text-[#1E7A3C] transition-colors">
                    {item.tema.titulo_tema}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {item.materia.nome} • Turma {id_turma}
                  </span>
                </div>

                {/* Horário e Badge de Status */}
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                    <Clock size={14} /> {hora_inicio.slice(0, 5)}
                  </span>

                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                      isConcluida
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : isEmAndamento
                          ? "bg-blue-50 text-blue-600 border-blue-100 animate-pulse"
                          : "bg-slate-50 text-slate-400 border-slate-100"
                    }`}
                  >
                    {item.chamadaFeita === true ? "Concluída" : statusAula}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Cronograma;
