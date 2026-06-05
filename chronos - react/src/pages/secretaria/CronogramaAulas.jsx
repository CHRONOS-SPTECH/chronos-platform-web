import React, { useState, useEffect } from "react";
import { Calendar, Inbox, ChevronLeft, ChevronRight } from "lucide-react";

import api from "../../services/api";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import BancoPendencias from "../../components/cronograma/BancoPendencias";
import CalendarioGrade from "../../components/cronograma/CalendarioGrade";

import {
  calcularDatasDaSemana,
  verificarConflitoProfessor,
  obterTextoSemanaDoMes,
} from "../../utils/CronogramaUtils";

export default function CronogramaView() {
  const [semanaAtual, setSemanaAtual] = useState(16);
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaDeAulas, setListaDeAulas] = useState([]);
  const [painelLateralAberto, setPainelLateralAberto] = useState(false);
  const [datasDaSemana, setDatasDaSemana] = useState([]);

  // Carrega as turmas disponíveis para o Select
  useEffect(() => {
    api
      .get("/turmas")
      .then((resposta) => {
        setListaTurmas(resposta.data);
        if (resposta.data.length > 0) {
          // Aqui define a primeira turma como padrão, mas pode vir via State/Param do React Router se preferir
          setTurmaSelecionada(resposta.data[0].id_turma.toString());
        }
      })
      .catch((erro) => console.error("Erro ao buscar turmas do banco:", erro));
  }, []);

  const carregarAulasDoBanco = () => {
    api
      .get("/aulas/detalhadas")
      .then((resposta) => setListaDeAulas(resposta.data))
      .catch((erro) => console.error("Erro ao buscar aulas detalhadas:", erro));
  };

  useEffect(() => {
    carregarAulasDoBanco();
  }, []);

  useEffect(() => {
    setDatasDaSemana(calcularDatasDaSemana(semanaAtual, 2026));
  }, [semanaAtual]);

  // Aulas pendentes (sem data) filtradas para o painel lateral
  const aulasPendentesFormatadas = listaDeAulas
    .filter((item) => !item.aula.data_aula)
    .map((item) => ({
      id: item.aula.id_aula.toString(),
      prof: item.instrutor.nome,
      id_instrutor: item.aula.id_instrutor,
      tema: item.tema.titulo_tema,
      color: "emerald",
    }));

  const listaHorarios = Array.from(
    new Set(
      listaDeAulas
        .filter((item) => item.aula.hora_inicio)
        .map((item) => item.aula.hora_inicio.substring(0, 5)),
    ),
  ).sort();

  // Mapeia alocações estritamente isoladas pela Turma Ativa e pela Semana Atual
  const obterAlocacoesParaAGrade = () => {
    const mapaAlocacoes = {};
    if (datasDaSemana.length === 0) return mapaAlocacoes;

    const stringsDatasDaSemana = datasDaSemana.map(
      (d) => d.toISOString().split("T")[0],
    );

    listaDeAulas.forEach((item) => {
      if (
        item.aula.data_aula &&
        item.aula.hora_inicio &&
        item.aula.id_turma.toString() === turmaSelecionada
      ) {
        const dataAulaPura = item.aula.data_aula.split("T")[0];
        const indiceDia = stringsDatasDaSemana.indexOf(dataAulaPura);

        if (indiceDia !== -1) {
          const numeroDia = indiceDia + 1;
          const horaChave = item.aula.hora_inicio.substring(0, 5);
          const chave = `${turmaSelecionada}_${semanaAtual}_${numeroDia}_${horaChave}`;

          mapaAlocacoes[chave] = {
            id_aula: item.aula.id_aula,
            id_instrutor: item.aula.id_instrutor,
            prof: item.instrutor.nome,
            tema: item.tema.titulo_tema,
            color: item.chamadaFeita ? "emerald" : "indigo",
          };
        }
      }
    });
    return mapaAlocacoes;
  };

  const enviarMudancasParaOBanco = (listaDeMudancas) => {
    api
      .patch("/aulas/remanejar", listaDeMudancas)
      .then(() => carregarAulasDoBanco())
      .catch((erro) => {
        alert(erro.response?.data?.message || "Erro ao salvar alteração.");
        carregarAulasDoBanco();
      });
  };

  const aoDesalocarAula = (chave) => {
    const aulaAlocada = obterAlocacoesParaAGrade()[chave];
    if (!aulaAlocada) return;

    enviarMudancasParaOBanco([
      { idAula: aulaAlocada.id_aula, dataAula: null, horaInicio: null },
    ]);
  };

  const aoSoltarCardNaGrade = (evento, numeroDia, textoHora, chaveDestino) => {
    const idAulaArrastada = Number(evento.dataTransfer.getData("text/plain"));
    const dataDoQuadrado = datasDaSemana[numeroDia - 1];
    const dataFormatadaAnoMesDia = dataDoQuadrado.toISOString().split("T")[0];
    const horaComSegundos = `${textoHora}:00`;

    const dadosDaAula = listaDeAulas.find(
      (a) => a.aula.id_aula === idAulaArrastada,
    );
    if (!dadosDaAula) return;

    if (
      verificarConflitoProfessor(
        listaDeAulas,
        dadosDaAula.aula.id_instrutor,
        dataFormatadaAnoMesDia,
        horaComSegundos,
        idAulaArrastada,
      )
    ) {
      alert(
        `Conflito: O Prof. ${dadosDaAula.instrutor.nome} já tem aula nesse horário!`,
      );
      return;
    }

    const listaPayload = [];
    const aulaExistenteNoLugar = obterAlocacoesParaAGrade()[chaveDestino];

    if (
      aulaExistenteNoLugar &&
      aulaExistenteNoLugar.id_aula !== idAulaArrastada
    ) {
      listaPayload.push({
        idAula: aulaExistenteNoLugar.id_aula,
        dataAula: null,
        horaInicio: null,
      });
    }

    listaPayload.push({
      idAula: idAulaArrastada,
      dataAula: dataFormatadaAnoMesDia,
      horaInicio: horaComSegundos,
    });

    enviarMudancasParaOBanco(listaPayload);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <Sidebar tipoUsuario="secretario" />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header titulo="Agendamento de Cronogramas" icone={Calendar} />

        <div className="flex-1 flex overflow-hidden relative bg-slate-50">
          <BancoPendencias
            estaAberto={painelLateralAberto}
            aoFechar={() => setPainelLateralAberto(false)}
            aulasPendentes={aulasPendentesFormatadas}
            aoAdicionarAulaRapica={() => carregarAulasDoBanco()}
            aoDeletarAulaPendente={() => carregarAulasDoBanco()}
          />

          <main
            className="flex-1 flex flex-col overflow-hidden z-10"
            onClick={() => painelLateralAberto && setPainelLateralAberto(false)}
          >
            <header className="bg-white p-4 border-b shadow-sm flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPainelLateralAberto(!painelLateralAberto);
                  }}
                  className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border-0 cursor-pointer shadow-sm"
                >
                  <Inbox size={14} className="text-green-400" />{" "}
                  <span>
                    Banco de Pendências ({aulasPendentesFormatadas.length})
                  </span>
                </button>

                <select
                  value={turmaSelecionada}
                  onChange={(e) => setTurmaSelecionada(e.target.value)}
                  className="bg-slate-100 border border-gray-200 text-slate-700 px-3 py-2 rounded-xl font-bold text-xs outline-none cursor-pointer hover:bg-slate-200 transition-all"
                >
                  {listaTurmas.map((t) => (
                    <option key={t.id_turma} value={t.id_turma.toString()}>
                      {t.nome_turma} ({t.status_turma})
                    </option>
                  ))}
                </select>
              </div>

              {/* Mês e Semana do ano letivo */}
              <div className="flex items-center gap-4 bg-slate-50 border border-gray-200 p-1.5 rounded-2xl shadow-inner">
                <button
                  onClick={() =>
                    semanaAtual > 1 && setSemanaAtual(semanaAtual - 1)
                  }
                  className="w-8 h-8 flex items-center justify-center bg-transparent border-0 cursor-pointer text-gray-600 hover:bg-white rounded-xl transition-all"
                >
                  <ChevronLeft size={14} />
                </button>
                <div className="flex flex-col items-center min-w-[200px]">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Semana {semanaAtual} de 52
                  </span>
                  <span className="text-sm font-black text-slate-800 tracking-tight leading-none mt-0.5">
                    {obterTextoSemanaDoMes(datasDaSemana)}
                  </span>
                </div>
                <button
                  onClick={() =>
                    semanaAtual < 52 && setSemanaAtual(semanaAtual + 1)
                  }
                  className="w-8 h-8 flex items-center justify-center bg-transparent border-0 cursor-pointer text-gray-600 hover:bg-white rounded-xl transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-auto p-6 custom-scroll">
              {listaHorarios.length > 0 ? (
                <CalendarioGrade
                  datasDaSemana={datasDaSemana}
                  listaHorarios={listaHorarios}
                  alocacoesDoBanco={obterAlocacoesParaAGrade()}
                  turmaSelecionada={turmaSelecionada}
                  semanaAtual={semanaAtual}
                  aoSoltarCard={aoSoltarCardNaGrade}
                  aoDesalocar={aoDesalocarAula}
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
