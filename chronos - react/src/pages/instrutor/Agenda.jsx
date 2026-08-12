import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import sessionService from "../../services/sessionService";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import AgendaGrade from "../../components/agendaInstrutor/AgendaGrade";
import aulaService from "../../services/aulaService";
import { useToast } from "../../components/alert-toast/ToastProvider";

import {
  calcularDatasDaSemana,
  obterTextoSemanaDoMes,
  obterSemanaAtualDoAno,
} from "../../utils/CronogramaUtils";

export default function AgendaInstrutorView() {
  const [semana, setSemana] = useState(obterSemanaAtualDoAno());
  const [datas, setDatas] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [instrutorInfo, setInstrutorInfo] = useState({ id: null, nome: "" });

  useEffect(() => {
    try {
      const dadosSessao = sessionService.getSession();
      const pessoa = dadosSessao?.usuario?.pessoa;

      if (pessoa && pessoa.tipo_vinculo_id === 4) {
        setInstrutorInfo({
          id: pessoa.id_pessoa,
          nome: pessoa.nome,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const toast = useToast();

  useEffect(() => {
    if (!instrutorInfo.id) return;

    setLoading(true);
    aulaService
      .listarAulasDetalhadas()
      .then((data) => {
        const filtradas = data.filter(
          (item) => item.aula.id_instrutor === instrutorInfo.id,
        );
        setAulas(filtradas);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erro ao carregar aulas.");
      })
      .finally(() => setLoading(false));
  }, [instrutorInfo.id]);

  useEffect(() => {
    setDatas(calcularDatasDaSemana(semana, 2026));
  }, [semana]);

  const { semanaTexto, mesAnoTexto } = obterTextoSemanaDoMes(datas);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased text-slate-800">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          titulo={`Minha Agenda — ${instrutorInfo.nome || "Instrutor"}`}
          icone={Calendar}
        />

        <div className="bg-white px-6 py-4 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-100/50 uppercase tracking-wider">
              Painel do Professor
            </span>
          </div>

          <div className="flex items-center gap-3 bg-slate-50/80 border border-slate-200 p-1 rounded-xl shadow-2xs">
            <button
              onClick={() => semana > 1 && setSemana(semana - 1)}
              disabled={semana <= 1}
              className="w-8 h-8 flex items-center justify-center bg-transparent border-0 cursor-pointer text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-30"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>

            <div className="flex flex-col items-center justify-center min-w-[180px] text-center select-none px-2">
              <span className="text-xs font-black text-slate-800 tracking-tight capitalize">
                {mesAnoTexto || "Carregando..."}
              </span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">
                {semanaTexto || "—"}
              </span>
            </div>

            <button
              onClick={() => semana < 52 && setSemana(semana + 1)}
              disabled={semana >= 52}
              className="w-8 h-8 flex items-center justify-center bg-transparent border-0 cursor-pointer text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-30"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-white rounded-2xl border border-slate-200/60 shadow-sm text-sm font-semibold gap-3 h-64">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span>Buscando dados no sistema...</span>
            </div>
          ) : aulas.length > 0 ? (
            <AgendaGrade datasDaSemana={datas} aulas={aulas} />
          ) : (
            <div className="max-w-md mx-auto text-center p-10 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300 shadow-xs flex flex-col items-center justify-center gap-3 my-12">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-300">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Sem compromissos
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Você não possui nenhuma aula agendada no sistema.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
