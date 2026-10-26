import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../components/alert-toast/ToastProvider";
import aulaService from "../services/aulaService";
import pessoaService from "../services/pessoaService";
import temaService from "../services/temaService";
import turmaService from "../services/turmaService";
import {
  adicionarDias,
  calcularDatasDaSemana,
  calcularDatasDoMes,
  formatarDataLocal,
  obterTextoSemanaDoMes,
  verificarConflitoProfessor,
} from "../utils/CronogramaUtils";

const descreverAula = (item) =>
  `"${item.tema?.titulo_tema || "Aula"}" da turma ${
    item.turma?.nome_turma || `Turma ${item.aula.id_turma}`
  }`;

const descreverHorario = (data, hora) =>
  `${data.split("-").reverse().join("/")} às ${hora.slice(0, 5)}`;

export default function useCronogramaAulas() {
  const toast = useToast();
  const [dataReferencia, setDataReferencia] = useState(() => new Date());
  const [visualizacao, setVisualizacao] = useState("semana");
  const [turmaSelecionada, setTurmaSelecionada] = useState("todos");
  const [instrutorSelecionado, setInstrutorSelecionado] = useState("todos");
  const [filtroPresenca, setFiltroPresenca] = useState("todas");
  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [temas, setTemas] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [confirmacao, setConfirmacao] = useState(null);
  const [aulaSelecionada, setAulaSelecionada] = useState(null);
  const [aulaEmEdicao, setAulaEmEdicao] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    turmaService.listarTurmas().then(setTurmas).catch(console.error);
    pessoaService
      .listarPessoas()
      .then((pessoas) =>
        setProfessores(pessoas.filter((p) => p.tipo_vinculo_id === 4)),
      )
      .catch(console.error);
    temaService.listarTemas().then(setTemas).catch(console.error);
  }, []);

  const carregarAulas = useCallback(async () => {
    setCarregando(true);
    try {
      setAulas((await aulaService.listarTodasAulasDetalhadas()) || []);
      return true;
    } catch (erro) {
      console.error("Erro ao carregar aulas:", erro);
      toast.error("Não foi possível carregar as aulas.");
      return false;
    } finally {
      setCarregando(false);
    }
  }, [toast]);
  useEffect(() => {
    carregarAulas();
  }, [carregarAulas]);

  const datas = useMemo(
    () =>
      visualizacao === "mes"
        ? calcularDatasDoMes(dataReferencia)
        : calcularDatasDaSemana(dataReferencia),
    [dataReferencia, visualizacao],
  );
  const datasSemana = useMemo(
    () => calcularDatasDaSemana(dataReferencia),
    [dataReferencia],
  );
  const { semanaTexto, mesAnoTexto } = useMemo(
    () => obterTextoSemanaDoMes(datasSemana),
    [datasSemana],
  );

  const aulasFiltradas = useMemo(
    () =>
      aulas.filter(({ aula, chamadaFeita }) => {
        if (!aula) return false;
        const correspondeTurma =
          turmaSelecionada === "todos" ||
          String(aula.id_turma) === turmaSelecionada;
        const correspondeInstrutor =
          instrutorSelecionado === "todos" ||
          String(aula.id_instrutor) === instrutorSelecionado;
        const chamada = Boolean(chamadaFeita ?? aula.chamadaFeita);
        const correspondePresenca =
          filtroPresenca === "todas" ||
          (filtroPresenca === "feita" ? chamada : !chamada);
        return correspondeTurma && correspondeInstrutor && correspondePresenca;
      }),
    [aulas, turmaSelecionada, instrutorSelecionado, filtroPresenca],
  );

  const pendenciasFormatadas = useMemo(
    () =>
      aulasFiltradas
        .filter(({ aula }) => !aula.data_aula)
        .map((item) => ({
          id: String(item.aula.id_aula),
          id_instrutor: item.aula.id_instrutor,
          prof: item.instrutor?.nome || "Instrutor",
          tema: item.tema?.titulo_tema || "Aula",
          turma: item.turma?.nome_turma || `Turma ${item.aula.id_turma}`,
          chamadaFeita: Boolean(item.chamadaFeita ?? item.aula.chamadaFeita),
        })),
    [aulasFiltradas],
  );

  const quantidadePendencias = useMemo(
    () => aulas.filter(({ aula }) => aula && !aula.data_aula).length,
    [aulas],
  );

  const obterAulasPorDataHora = useCallback(
    (data, hora) =>
      aulasFiltradas.filter(({ aula }) => {
        if (!aula?.data_aula || !aula?.hora_inicio) return false;
        const horaInformada = Number(String(hora).slice(0, 2));
        return (
          aula.data_aula.split("T")[0] === data &&
          Number(aula.hora_inicio.substring(0, 2)) ===
            horaInformada
        );
      }),
    [aulasFiltradas],
  );

  const salvarRemanejamento = useCallback(
    async (mudancas, mensagemSucesso) => {
      try {
        await aulaService.remanejar(mudancas);
        const mudancasPorAula = new Map(
          mudancas.map((mudanca) => [Number(mudanca.idAula), mudanca]),
        );
        setAulas((aulasAtuais) =>
          aulasAtuais.map((registro) => {
            const mudanca = mudancasPorAula.get(
              Number(registro.aula?.id_aula),
            );
            if (!mudanca) return registro;
            return {
              ...registro,
              aula: {
                ...registro.aula,
                data_aula: mudanca.dataAula,
                hora_inicio: mudanca.horaInicio,
              },
            };
          }),
        );
        const aulasCarregadas = await carregarAulas();
        if (aulasCarregadas) {
          toast.success(mensagemSucesso, 6000);
        } else {
          toast.warning(
            `${mensagemSucesso} A alteração foi salva, mas não foi possível atualizar a agenda. Recarregue a página para conferir.`,
            7000,
          );
        }
        return true;
      } catch (erro) {
        toast.error(
          erro.response?.data?.message ||
            "Não foi possível atualizar o cronograma.",
        );
        await carregarAulas();
        return false;
      }
    },
    [carregarAulas, toast],
  );

  const aoSoltarCard = useCallback(
    (evento, dataAlvo, hora) => {
      evento.preventDefault();
      const idAula = Number(evento.dataTransfer.getData("text/plain"));
      const item = aulas.find(
        (registro) => Number(registro.aula?.id_aula) === idAula,
      );
      if (!item) return;
      const horaFormatada = `${String(hora).slice(0, 2)}:00:00`;
      if (Boolean(item.chamadaFeita ?? item.aula.chamadaFeita)) {
        toast.error("Aulas com presença registrada não podem ser remanejadas.");
        return;
      }
      if (
        verificarConflitoProfessor(
          aulas,
          item.aula.id_instrutor,
          dataAlvo,
          horaFormatada,
          idAula,
        )
      ) {
        toast.error(
          `Conflito: ${item.instrutor?.nome || "O instrutor"} já tem aula nessa faixa de horário.`,
        );
        return;
      }
      const ocupantes = aulas.filter(
        ({ aula }) =>
          aula?.data_aula?.split("T")[0] === dataAlvo &&
          Number(aula?.hora_inicio?.substring(0, 2)) === Number(hora) &&
          Number(aula?.id_turma) === Number(item.aula.id_turma) &&
          Number(aula?.id_aula) !== idAula,
      );
      if (
        ocupantes.some((registro) =>
          Boolean(registro.chamadaFeita ?? registro.aula.chamadaFeita),
        )
      ) {
        toast.error(
          "O horário está ocupado por uma aula com presença registrada.",
        );
        return;
      }
      if (ocupantes.length === 0) {
        const acao = item.aula.data_aula ? "realocada" : "alocada";
        const mensagemSucesso = `Aula ${descreverAula(item)} ${acao} com sucesso para ${descreverHorario(dataAlvo, horaFormatada)}.`;
        void salvarRemanejamento(
          [{ idAula, dataAula: dataAlvo, horaInicio: horaFormatada }],
          mensagemSucesso,
        );
        return;
      }
      setConfirmacao({ item, dataAlvo, horaFormatada, ocupantes });
    },
    [aulas, salvarRemanejamento, toast],
  );

  const confirmarRemanejamento = useCallback(async () => {
    if (!confirmacao) return;
    const mudancas = confirmacao.ocupantes.map(({ aula }) => ({
      idAula: aula.id_aula,
      dataAula: null,
      horaInicio: null,
    }));
    mudancas.push({
      idAula: confirmacao.item.aula.id_aula,
      dataAula: confirmacao.dataAlvo,
      horaInicio: confirmacao.horaFormatada,
    });
    const aulasDevolvidas = confirmacao.ocupantes
      .map(descreverAula)
      .join(", ");
    const mensagemDevolucao =
      confirmacao.ocupantes.length === 1
        ? "Aula devolvida"
        : "Aulas devolvidas";
    const mensagemSucesso = `Aula ${descreverAula(confirmacao.item)} alocada com sucesso para ${descreverHorario(confirmacao.dataAlvo, confirmacao.horaFormatada)}. ${mensagemDevolucao} à fila de pendências: ${aulasDevolvidas}.`;
    const salvo = await salvarRemanejamento(mudancas, mensagemSucesso);
    if (salvo) setConfirmacao(null);
  }, [confirmacao, salvarRemanejamento]);

  const aoDesalocar = useCallback(
    async (item) => {
      if (Boolean(item?.chamadaFeita ?? item?.aula?.chamadaFeita)) {
        toast.error("Aulas com presença registrada não podem ser desalocadas.");
        return;
      }
      await salvarRemanejamento(
        [{ idAula: item.aula.id_aula, dataAula: null, horaInicio: null }],
        `Aula ${descreverAula(item)} devolvida à fila de pendências com sucesso.`,
      );
    },
    [salvarRemanejamento, toast],
  );

  const aoAdicionarAulaRapida = useCallback(
    async (dados) => {
      try {
        await aulaService.criarAula({
          data_aula: null,
          hora_inicio: null,
          hora_fim: null,
          statusAula: "Agendada",
          ...dados,
        });
        await carregarAulas();
        toast.success("Aula pendente adicionada.");
      } catch (erro) {
        toast.error(erro.response?.data?.message || "Erro ao criar aula.");
      }
    },
    [carregarAulas, toast],
  );

  const aoDeletarAulaPendente = useCallback(
    async (id) => {
      try {
        await aulaService.excluirAula(id);
        await carregarAulas();
        toast.success("Aula excluída.");
      } catch (erro) {
        toast.error(erro.response?.data?.message || "Erro ao excluir aula.");
      }
    },
    [carregarAulas, toast],
  );

  const salvarEdicao = useCallback(
    async (id, dados) => {
      try {
        await aulaService.atualizarAula(id, dados);
        await carregarAulas();
        setAulaEmEdicao(null);
        setAulaSelecionada(null);
        toast.success("Aula atualizada.");
      } catch (erro) {
        toast.error(
          erro.response?.data?.message || "Não foi possível editar a aula.",
        );
      }
    },
    [carregarAulas, toast],
  );

  return {
    dataReferencia,
    setDataReferencia,
    visualizacao,
    setVisualizacao,
    turmaSelecionada,
    setTurmaSelecionada,
    instrutorSelecionado,
    setInstrutorSelecionado,
    filtroPresenca,
    setFiltroPresenca,
    turmas,
    professores,
    temas,
    aulas,
    aulasFiltradas,
    datas,
    datasSemana,
    semanaTexto,
    mesAnoTexto,
    pendenciasFormatadas,
    quantidadePendencias,
    obterAulasPorDataHora,
    aoAdicionarAulaRapida,
    aoDeletarAulaPendente,
    aoDesalocar,
    aoSoltarCard,
    confirmacao,
    setConfirmacao,
    confirmarRemanejamento,
    aulaSelecionada,
    setAulaSelecionada,
    aulaEmEdicao,
    setAulaEmEdicao,
    salvarEdicao,
    carregarAulas,
    carregando,
    navegarPeriodo: (delta) =>
      setDataReferencia((atual) =>
        visualizacao === "mes"
          ? new Date(atual.getFullYear(), atual.getMonth() + delta, 1)
          : adicionarDias(atual, 7 * delta),
      ),
    selecionarData: (data) => {
      setDataReferencia(data);
      setVisualizacao("semana");
    },
    hoje: () => setDataReferencia(new Date()),
    dataHoje: formatarDataLocal(new Date()),
  };
}
