import React, { useState, useEffect } from "react";
import { Calendar, Inbox, ChevronLeft, ChevronRight } from "lucide-react";

import aulaService from "../../services/aulaService";
import turmaService from "../../services/turmaService";
import pessoaService from "../../services/pessoaService";
import temaService from "../../services/temaService";
import { useToast } from "../../components/alert-toast/ToastProvider";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import BancoPendencias from "../../components/cronograma/BancoPendencias";
import CalendarioGrade from "../../components/cronograma/CalendarioGrade";

import {
  calcularDatasDaSemana,
  verificarConflitoProfessor,
  obterTextoSemanaDoMes,
  obterSemanaAtualDoAno,
} from "../../utils/CronogramaUtils";

export default function CronogramaView() {
  const [semana, setSemana] = useState(obterSemanaAtualDoAno());
  const [turma, setTurma] = useState("todos");
  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [temas, setTemas] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [menuAberto, setMenuAberto] = useState(false);
  const [datas, setDatas] = useState([]);

  const toast = useToast();

  useEffect(() => {
    turmaService
      .listarTurmas()
      .then((data) => setTurmas(data))
      .catch((err) => console.error("Erro ao buscar turmas:", err));
  }, []);

  useEffect(() => {
    pessoaService
      .listarPessoas()
      .then((data) => {
        const forcaViva = data.filter((p) => p.tipo_vinculo_id === 4);
        setProfessores(forcaViva);
      })
      .catch((err) => console.error("Erro ao carregar professores:", err));
  }, []);

  useEffect(() => {
    temaService
      .listarTemas()
      .then((data) => setTemas(data))
      .catch((err) => console.error("Erro ao carregar temas de aula:", err));
  }, []);

  const carregarAulas = () => {
    aulaService
      .listarAulasDetalhadas()
      .then((data) => setAulas(data))
      .catch((err) => console.error("Erro ao buscar aulas detalhadas:", err));
  };

  useEffect(() => {
    carregarAulas();
  }, []);

  useEffect(() => {
    setDatas(calcularDatasDaSemana(semana, 2026));
  }, [semana]);

  const aoAdicionarAulaRapida = (dadosForm) => {
    const requestAula = {
      data_aula: null,
      hora_inicio: null,
      hora_fim: null,
      statusAula: "Agendada",
      id_turma: dadosForm.id_turma,
      id_tema: dadosForm.id_tema,
      id_instrutor: dadosForm.id_instrutor,
    };

    aulaService
      .criarAula(requestAula)
      .then(() => {
        carregarAulas();
        toast.success("Aula pendente adicionada com sucesso!");
      })
      .catch((err) => {
        console.error("Erro ao criar aula rápida:", err);
        toast.error("Erro ao criar aula rápida.");
      });
  };

  const aoDeletarAulaPendente = (idAula) => {
    aulaService
      .excluirAula(idAula)
      .then(() => {
        carregarAulas();
        toast.success("Aula excluída com sucesso.");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erro ao deletar aula.");
      });
  };

  const pendendasFormatadas = aulas
    .filter((item) => {
      const ehPendente = !item.aula.data_aula;

      const atendeFiltroTurma =
        turma === "todos" || item.aula.id_turma.toString() === turma;

      return ehPendente && atendeFiltroTurma;
    })
    .map((item) => ({
      id: item.aula.id_aula.toString(),
      prof: item.instrutor.nome,
      id_instrutor: item.aula.id_instrutor,
      tema: item.tema.titulo_tema,
      turma: item.turma.nome_turma,
      color: "emerald",
    }));

  const horarios = Array.from(
    new Set(
      aulas
        .filter((item) => item.aula.hora_inicio)
        .map((item) => item.aula.hora_inicio.substring(0, 5)),
    ),
  ).sort();

  const obterAlocacoes = () => {
    const mapa = {};
    if (datas.length === 0) return mapa;

    const datasStrings = datas.map((d) => d.toISOString().split("T")[0]);

    aulas.forEach((item) => {
      const { data_aula, hora_inicio, id_turma, id_aula, id_instrutor } =
        item.aula;

      const atendeFiltroTurma =
        turma === "todos" || id_turma.toString() === turma;

      if (data_aula && hora_inicio && atendeFiltroTurma) {
        const dataPura = data_aula.split("T")[0];
        const indexDia = datasStrings.indexOf(dataPura);

        if (indexDia !== -1) {
          const diaNum = indexDia + 1;
          const hora = hora_inicio.substring(0, 5);

          const chave =
            turma === "todos"
              ? `todos_${semana}_${diaNum}_${hora}`
              : `${turma}_${semana}_${diaNum}_${hora}`;

          mapa[chave] = {
            id_aula,
            id_instrutor,
            prof: item.instrutor.nome,
            tema: item.tema.titulo_tema,
            color: item.chamadaFeFeita ? "emerald" : "indigo",
            turma: item.turma.nome_turma,
          };
        }
      }
    });
    return mapa;
  };

  const salvarAlteracoes = (mudancas) => {
    aulaService
      .remanejar(mudancas)
      .then(() => {
        carregarAulas();
        toast.success("Alteração salva com sucesso!");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Erro ao salvar alteração.");
        carregarAulas();
      });
  };

  const aoDesalocar = (chave) => {
    const aulaAlocada = obterAlocacoes()[chave];
    if (!aulaAlocada) return;

    salvarAlteracoes([
      { idAula: aulaAlocada.id_aula, dataAula: null, horaInicio: null },
    ]);
  };

  const aoSoltarCard = (e, diaNum, hora, chaveDestino) => {
    const idArrastado = Number(e.dataTransfer.getData("text/plain"));
    const dataAlvo = datas[diaNum - 1].toISOString().split("T")[0];
    const horaFormatada = `${hora}:00`;

    const aulaArrastada = aulas.find((a) => a.aula.id_aula === idArrastado);
    if (!aulaArrastada) return;

    if (
      verificarConflitoProfessor(
        aulas,
        aulaArrastada.aula.id_instrutor,
        dataAlvo,
        horaFormatada,
        idArrastado,
      )
    ) {
      mostrarAlerta(
        "error",
        `Conflito: O Prof. ${aulaArrastada.instrutor.nome} já tem aula nesse horário!`,
      );
      return;
    }

    const mudancas = [];
    const ocupanteAtual = obterAlocacoes()[chaveDestino];

    if (ocupanteAtual && ocupanteAtual.id_aula !== idArrastado) {
      mudancas.push({
        idAula: ocupanteAtual.id_aula,
        dataAula: null,
        horaInicio: null,
      });
    }

    mudancas.push({
      idAula: idArrastado,
      dataAula: dataAlvo,
      horaInicio: horaFormatada,
    });

    salvarAlteracoes(mudancas);
  };

  const { semanaTexto, mesAnoTexto } = obterTextoSemanaDoMes(datas);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <Alert type={alerta.type} message={alerta.message} />

      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header titulo="Cronograma de Aulas" icone={Calendar} />

        <div className="flex-1 flex overflow-hidden relative bg-slate-50">
          <BancoPendencias
            estaAberto={menuAberto}
            aoFechar={() => setMenuAberto(false)}
            setMenuAberto={setMenuAberto}
            aulasPendentes={pendendasFormatadas}
            aoAdicionarAulaRapida={aoAdicionarAulaRapida}
            aoDeletarAulaPendente={aoDeletarAulaPendente}
            turmas={turmas}
            turmaSelecionada={turma}
            professores={professores}
            temas={temas}
          />

          <main
            className="flex-1 flex flex-col overflow-hidden z-10"
            onClick={() => menuAberto && setMenuAberto(false)}
          >
            <header className="bg-white p-4 border-b shadow-sm flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuAberto(!menuAberto);
                  }}
                  className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border-0 cursor-pointer shadow-sm"
                >
                  <Inbox size={14} className="text-green-400" />
                  <span>
                    Banco de Pendências ({pendendasFormatadas.length})
                  </span>
                </button>

                <select
                  value={turma}
                  onChange={(e) => setTurma(e.target.value)}
                  className="bg-slate-100 border border-gray-200 text-slate-700 px-3 py-2 rounded-xl font-bold text-xs outline-none cursor-pointer hover:bg-slate-200 transition-all"
                >
                  <option value="todos">Todos</option>
                  {turmas.map((t) => (
                    <option key={t.id_turma} value={t.id_turma.toString()}>
                      {t.nome_turma} ({t.status_turma})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 border border-gray-200 p-1.5 rounded-2xl shadow-inner">
                <button
                  onClick={() => semana > 1 && setSemana(semana - 1)}
                  className="w-8 h-8 flex items-center justify-center bg-transparent border-0 cursor-pointer text-gray-600 hover:bg-white rounded-xl transition-all"
                >
                  <ChevronLeft size={14} />
                </button>

                <div className="flex flex-col items-center min-w-[200px]">
                  <span className="text-sm font-black text-slate-800 tracking-tight leading-none capitalize">
                    {mesAnoTexto || "Carregando..."}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                    {semanaTexto}
                  </span>
                </div>

                <button
                  onClick={() => semana < 52 && setSemana(semana + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-transparent border-0 cursor-pointer text-gray-600 hover:bg-white rounded-xl transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-auto p-6 custom-scroll">
              {horarios.length > 0 ? (
                <CalendarioGrade
                  datasDaSemana={datas}
                  listaHorarios={horarios}
                  alocacoesDoBanco={obterAlocacoes()}
                  turmaSelecionada={turma}
                  semanaAtual={semana}
                  aoSoltarCard={aoSoltarCard}
                  aoDesalocar={aoDesalocar}
                />
              ) : (
                <div className="text-center p-12 text-gray-400 bg-white rounded-2xl border border-dashed text-sm font-medium border-gray-300">
                  Nenhuma aula agendada para mapear os horários dessa grade.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
