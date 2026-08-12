import { useCallback, useEffect, useMemo, useState } from "react";

import { useToast } from "../components/alert-toast/ToastProvider";
import aulaService from "../services/aulaService";
import pessoaService from "../services/pessoaService";
import temaService from "../services/temaService";
import turmaService from "../services/turmaService";
import {
  calcularDatasDaSemana,
  verificarConflitoProfessor,
  obterTextoSemanaDoMes,
  obterSemanaAtualDoAno,
} from "../utils/CronogramaUtils";

export default function useCronogramaAulas() {
  const toast = useToast();

  const [semana, setSemana] = useState(obterSemanaAtualDoAno());
  const [turmaSelecionada, setTurmaSelecionada] = useState("todos");
  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [temas, setTemas] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    turmaService
      .listarTurmas()
      .then((dadosTurmas) => setTurmas(dadosTurmas))
      .catch((erro) => {
        console.error("Erro ao buscar turmas:", erro);
      });
  }, []);

  useEffect(() => {
    pessoaService
      .listarPessoas()
      .then((dadosPessoas) => {
        const professoresAtivos = dadosPessoas.filter(
          (pessoa) => pessoa.tipo_vinculo_id === 4,
        );
        setProfessores(professoresAtivos);
      })
      .catch((erro) => {
        console.error("Erro ao carregar professores:", erro);
      });
  }, []);

  useEffect(() => {
    temaService
      .listarTemas()
      .then((dadosTemas) => setTemas(dadosTemas))
      .catch((erro) => {
        console.error("Erro ao carregar temas de aula:", erro);
      });
  }, []);

  const carregarAulas = useCallback(async () => {
    try {
      const dadosAulas = await aulaService.listarAulasDetalhadas();
      setAulas(dadosAulas);
    } catch (erro) {
      console.error("Erro ao buscar aulas detalhadas:", erro);
    }
  }, []);

  useEffect(() => {
    carregarAulas();
  }, [carregarAulas]);

  useEffect(() => {
    setDatas(calcularDatasDaSemana(semana, 2026));
  }, [semana]);

  const aoAdicionarAulaRapida = useCallback(
    async (dadosFormulario) => {
      const requisicaoAula = {
        data_aula: null,
        hora_inicio: null,
        hora_fim: null,
        statusAula: "Agendada",
        id_turma: dadosFormulario.id_turma,
        id_tema: dadosFormulario.id_tema,
        id_instrutor: dadosFormulario.id_instrutor,
      };

      try {
        await aulaService.criarAula(requisicaoAula);
        await carregarAulas();
        toast.success("Aula pendente adicionada com sucesso!");
      } catch (erro) {
        console.error("Erro ao criar aula rápida:", erro);
        toast.error("Erro ao criar aula rápida.");
      }
    },
    [carregarAulas, toast],
  );

  const aoDeletarAulaPendente = useCallback(
    async (idAula) => {
      try {
        await aulaService.excluirAula(idAula);
        await carregarAulas();
        toast.success("Aula excluída com sucesso.");
      } catch (erro) {
        console.error("Erro ao deletar aula:", erro);
        toast.error("Erro ao deletar aula.");
      }
    },
    [carregarAulas, toast],
  );

  const pendenciasFormatadas = useMemo(
    () =>
      aulas
        .filter((item) => {
          const ehPendente = !item.aula.data_aula;
          const atendeFiltroTurma =
            turmaSelecionada === "todos" ||
            item.aula.id_turma.toString() === turmaSelecionada;

          return ehPendente && atendeFiltroTurma;
        })
        .map((item) => ({
          id: item.aula.id_aula.toString(),
          prof: item.instrutor.nome,
          id_instrutor: item.aula.id_instrutor,
          tema: item.tema.titulo_tema,
          turma: item.turma.nome_turma,
          color: "emerald",
        })),
    [aulas, turmaSelecionada],
  );

  const horarios = useMemo(
    () =>
      Array.from(
        new Set(
          aulas
            .filter((item) => item.aula.hora_inicio)
            .map((item) => item.aula.hora_inicio.substring(0, 5)),
        ),
      ).sort(),
    [aulas],
  );

  const obterAlocacoes = useCallback(() => {
    const mapaAlocacoes = {};
    if (datas.length === 0) return mapaAlocacoes;

    const datasDaSemana = datas.map((data) => data.toISOString().split("T")[0]);

    aulas.forEach((item) => {
      const { data_aula, hora_inicio, id_turma, id_aula, id_instrutor } =
        item.aula;

      const atendeFiltroTurma =
        turmaSelecionada === "todos" ||
        id_turma.toString() === turmaSelecionada;

      if (data_aula && hora_inicio && atendeFiltroTurma) {
        const dataPura = data_aula.split("T")[0];
        const indiceDia = datasDaSemana.indexOf(dataPura);

        if (indiceDia !== -1) {
          const diaNumero = indiceDia + 1;
          const hora = hora_inicio.substring(0, 5);

          const chave =
            turmaSelecionada === "todos"
              ? `todos_${semana}_${diaNumero}_${hora}`
              : `${turmaSelecionada}_${semana}_${diaNumero}_${hora}`;

          mapaAlocacoes[chave] = {
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

    return mapaAlocacoes;
  }, [aulas, datas, semana, turmaSelecionada]);

  const salvarAlteracoes = useCallback(
    async (mudancas) => {
      try {
        await aulaService.remanejar(mudancas);
        await carregarAulas();
        toast.success("Alteração salva com sucesso!");
      } catch (erro) {
        toast.error(
          erro.response?.data?.message || "Erro ao salvar alteração.",
        );
        await carregarAulas();
      }
    },
    [carregarAulas, toast],
  );

  const aoDesalocar = useCallback(
    async (chave) => {
      const aulaAlocada = obterAlocacoes()[chave];
      if (!aulaAlocada) return;

      await salvarAlteracoes([
        { idAula: aulaAlocada.id_aula, dataAula: null, horaInicio: null },
      ]);
    },
    [obterAlocacoes, salvarAlteracoes],
  );

  const aoSoltarCard = useCallback(
    async (evento, diaNumero, hora, chaveDestino) => {
      const idArrastado = Number(evento.dataTransfer.getData("text/plain"));
      const dataAlvo = datas[diaNumero - 1].toISOString().split("T")[0];
      const horaFormatada = `${hora}:00`;

      const aulaArrastada = aulas.find(
        (aula) => aula.aula.id_aula === idArrastado,
      );
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
        toast.error(
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

      await salvarAlteracoes(mudancas);
    },
    [aulas, datas, obterAlocacoes, salvarAlteracoes, toast],
  );

  const { semanaTexto, mesAnoTexto } = useMemo(
    () => obterTextoSemanaDoMes(datas),
    [datas],
  );

  return {
    semana,
    setSemana,
    turmaSelecionada,
    setTurmaSelecionada,
    turmas,
    professores,
    temas,
    aulas,
    datas,
    pendenciasFormatadas,
    horarios,
    semanaTexto,
    mesAnoTexto,
    carregarAulas,
    aoAdicionarAulaRapida,
    aoDeletarAulaPendente,
    aoDesalocar,
    aoSoltarCard,
    obterAlocacoes,
  };
}
