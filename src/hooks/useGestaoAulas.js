import { useCallback, useEffect, useMemo, useState } from "react";

import { useToast } from "../components/alert-toast/ToastProvider";
import aulaService from "../services/aulaService";
import turmaService from "../services/turmaService";

export default function useGestaoAulas() {
  const toast = useToast();

  const [aulas, setAulas] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [idTurmaSelecionada, setIdTurmaSelecionada] = useState("");
  const [anoSelecionado, setAnoSelecionado] = useState("2026");
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const [carregandoImportacao, setCarregandoImportacao] = useState(false);
  const [relatorioImportacao, setRelatorioImportacao] = useState(null);
  const [aulaParaExcluir, setAulaParaExcluir] = useState(null);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(false);

  const carregarDados = useCallback(async () => {
    setCarregandoDados(true);

    try {
      const [aulasDetalhadas, turmasDisponiveis] = await Promise.all([
        aulaService.listarAulasDetalhadas(),
        turmaService.listarTurmas(),
      ]);

      setAulas(aulasDetalhadas || []);
      setTurmas(turmasDisponiveis || []);
    } catch (erro) {
      console.error("Erro ao carregar dados da gestão de aulas:", erro);
      toast.error("Não foi possível carregar as aulas e turmas.");
    } finally {
      setCarregandoDados(false);
    }
  }, [toast]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const aoSelecionarArquivo = useCallback(
    (evento) => {
      const arquivo = evento.target.files?.[0];
      if (!arquivo) return;

      const extensao = arquivo.name.split(".").pop()?.toLowerCase();
      if (extensao !== "xlsx" && extensao !== "xls") {
        toast.error("Selecione apenas arquivos Excel (.xlsx, .xls)");
        return;
      }

      setArquivoSelecionado(arquivo);
    },
    [toast],
  );

  const limparArquivoSelecionado = useCallback(() => {
    setArquivoSelecionado(null);
  }, []);

  const processarEnvioExcel = useCallback(async () => {
    if (!arquivoSelecionado) return;

    setCarregandoImportacao(true);

    const formData = new FormData();
    formData.append("file", arquivoSelecionado);

    try {
      const resultado = await aulaService.importar(formData);
      setRelatorioImportacao(resultado);
      await carregarDados();
      toast.success("Planilha processada com sucesso");
    } catch (erro) {
      toast.error(
        erro.response?.data?.message || "Erro ao processar planilha.",
      );
    } finally {
      setCarregandoImportacao(false);
    }
  }, [arquivoSelecionado, carregarDados, toast]);

  const fecharModalImportacao = useCallback(() => {
    setRelatorioImportacao(null);
    setArquivoSelecionado(null);
  }, []);

  const abrirConfirmacaoExclusao = useCallback((idAula) => {
    setAulaParaExcluir(idAula);
    setConfirmacaoAberta(true);
  }, []);

  const confirmarExclusao = useCallback(async () => {
    if (!aulaParaExcluir) {
      setConfirmacaoAberta(false);
      return;
    }

    try {
      await aulaService.excluirAula(aulaParaExcluir);
      await carregarDados();
      toast.success("Aula deletada com sucesso.");
    } catch (erro) {
      console.error("Erro ao deletar aula da gestão:", erro);
      toast.error("Erro ao deletar registro.");
    } finally {
      setConfirmacaoAberta(false);
      setAulaParaExcluir(null);
    }
  }, [aulaParaExcluir, carregarDados, toast]);

  const aulasFiltradas = useMemo(() => {
    const termoNormalize = termoBusca.trim().toLowerCase();

    return aulas.filter((item) => {
      if (!item?.aula) return false;

      const nomeTema = item?.tema?.titulo_tema?.toLowerCase() || "";
      const nomeInstrutor = item?.instrutor?.nome?.toLowerCase() || "";
      const bateTexto =
        !termoNormalize ||
        nomeTema.includes(termoNormalize) ||
        nomeInstrutor.includes(termoNormalize);

      const bateTurma =
        !idTurmaSelecionada ||
        item.aula.id_turma.toString() === idTurmaSelecionada;

      const anoDaAula = item.aula.data_aula
        ? item.aula.data_aula.substring(0, 4)
        : "2026";

      const bateAno = !anoSelecionado || anoDaAula === anoSelecionado;

      return bateTexto && bateTurma && bateAno;
    });
  }, [anoSelecionado, aulas, idTurmaSelecionada, termoBusca]);

  return {
    aulas,
    turmas,
    termoBusca,
    setTermoBusca,
    idTurmaSelecionada,
    setIdTurmaSelecionada,
    anoSelecionado,
    setAnoSelecionado,
    arquivoSelecionado,
    aoSelecionarArquivo,
    limparArquivoSelecionado,
    processarEnvioExcel,
    fecharModalImportacao,
    relatorioImportacao,
    carregandoImportacao,
    carregandoDados,
    aulasFiltradas,
    aulaParaExcluir,
    confirmacaoAberta,
    setConfirmacaoAberta,
    abrirConfirmacaoExclusao,
    confirmarExclusao,
  };
}
