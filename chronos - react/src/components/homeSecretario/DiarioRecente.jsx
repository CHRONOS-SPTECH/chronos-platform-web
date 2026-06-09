import { useEffect, useState } from "react";
import { Calendar, User, BookOpen } from "lucide-react";
import api from "../../services/api";
import { formatarDataBr } from "../../utils/DateUtils";

export default function DiarioRecente() {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscarAulas() {
      try {
        setLoading(true);
        const resposta = await api.get("/aulas/detalhadas");

        if (Array.isArray(resposta.data)) {
          const aulasInvertidas = [...resposta.data].reverse();
          setAulas(aulasInvertidas.slice(0, 3));
        }
      } catch (error) {
        console.error("Erro ao carregar diário de aulas:", error);
      } finally {
        setLoading(false);
      }
    }
    buscarAulas();
  }, []);

  if (loading) {
    return (
      <p className="text-xs text-gray-400 p-4">
        Carregando histórico de aulas...
      </p>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-600">
          Diário Acadêmico - Últimas Aulas Registradas
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {aulas.map((item) => {
          const dataBruta = item.aula?.data_aula;
          const dataApenasData =
            typeof dataBruta === "string" && dataBruta.includes("T")
              ? dataBruta.split("T")[0]
              : dataBruta;

          return (
            <div
              key={item.aula?.id_aula}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white text-gray-500 shadow-sm border border-gray-100">
                  <Calendar size={14} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-700">
                    {item.turma?.nome_turma || "Turma não informada"}
                  </h5>
                  <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                    <BookOpen size={10} />{" "}
                    {item.tema?.titulo_tema || "Sem tema"}
                    <span className="mx-1">•</span>
                    <User size={10} /> Prof.{" "}
                    {item.instrutor?.nome || "Não alocado"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-black text-gray-500 block uppercase">
                  {formatarDataBr(dataApenasData)}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                    item.chamadaFeita
                      ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                      : "text-amber-600 bg-amber-50 border-amber-100"
                  }`}
                >
                  {item.chamadaFeita ? "Presença Fechada" : "Pendente"}
                </span>
              </div>
            </div>
          );
        })}

        {aulas.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-2">
            Nenhuma aula registrada no sistema.
          </p>
        )}
      </div>
    </div>
  );
}
