import { useCallback, useEffect, useMemo, useState } from "react";

import { useToast } from "../components/alert-toast/ToastProvider";
import aulaService from "../services/aulaService";
import turmaService from "../services/turmaService";
import pessoaService from "../services/pessoaService";
import temaService from "../services/temaService";
import { PAGE_SIZE } from "../config/pagination";

export default function useGestaoAulas() {
  const toast = useToast();

  const [aulas, setAulas] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [temas, setTemas] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [idTurmaSelecionada, setIdTurmaSelecionada] = useState("");
  const [anoSelecionado, setAnoSelecionado] = useState(
    String(new Date().getFullYear()),
  );
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const [carregandoImportacao, setCarregandoImportacao] = useState(false);
  const [relatorioImportacao, setRelatorioImportacao] = useState(null);
  const [aulaParaExcluir, setAulaParaExcluir] = useState(null);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(false);
  const [pagina, setPagina] = useState(0);
  const [tamanhoPagina, setTamanhoPagina] = useState(PAGE_SIZE);
  const [paginacao, setPaginacao] = useState({ totalElements: 0, totalPages: 0, number: 0, last: true, size: PAGE_SIZE });

  const carregarDados = useCallback(async () => {
    setCarregandoDados(true);

    try {
      const [aulasDetalhadas, turmasDisponiveis, pessoas, temasDisponiveis] =
        await Promise.all([
          idTurmaSelecionada
            ? aulaService.listarAulasDaTurma(idTurmaSelecionada, { page: pagina, size: tamanhoPagina })
            : aulaService.listarAulasDetalhadas({ page: pagina, size: tamanhoPagina }),
          turmaService.listarTurmas(),
          pessoaService.listarPessoas(),
          temaService.listarTemas(),
        ]);

      const registros = Array.isArray(aulasDetalhadas?.content) ? aulasDetalhadas.content : Array.isArray(aulasDetalhadas) ? aulasDetalhadas : [];
      setAulas(registros);
      setPaginacao({ totalElements: aulasDetalhadas?.totalElements ?? registros.length, totalPages: aulasDetalhadas?.totalPages ?? 1, number: aulasDetalhadas?.number ?? pagina, last: aulasDetalhadas?.last ?? true, size: aulasDetalhadas?.size ?? tamanhoPagina });
      setTurmas(turmasDisponiveis || []);
      setProfessores(
        (pessoas || []).filter((pessoa) => pessoa.tipo_vinculo_id === 4),
      );
      setTemas(temasDisponiveis || []);
    } catch (erro) {
      console.error("Erro ao carregar dados da gestão de aulas:", erro);
      toast.error("Não foi possível carregar as aulas e turmas.");
    } finally {
      setCarregandoDados(false);
    }
  }, [idTurmaSelecionada, pagina, tamanhoPagina, toast]);

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

  const salvarEdicao = useCallback(
    async (idAula, dados) => {
      try {
        await aulaService.atualizarAula(idAula, dados);
        await carregarDados();
        toast.success("Aula atualizada com sucesso.");
        return true;
      } catch (erro) {
        toast.error(
          erro.response?.data?.message || "Não foi possível editar a aula.",
        );
        return false;
      }
    },
    [carregarDados, toast],
  );

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
        : String(new Date().getFullYear());

      const bateAno = !anoSelecionado || anoDaAula === anoSelecionado;

      return bateTexto && bateTurma && bateAno;
    });
  }, [anoSelecionado, aulas, idTurmaSelecionada, termoBusca]);

  const atualizarFiltro = useCallback((setter) => (valor) => {
    setPagina(0);
    setter(valor);
  }, []);

  return {
    aulas,
    turmas,
    professores,
    temas,
    termoBusca,
    setTermoBusca: atualizarFiltro(setTermoBusca),
    idTurmaSelecionada,
    setIdTurmaSelecionada: atualizarFiltro(setIdTurmaSelecionada),
    anoSelecionado,
    setAnoSelecionado: atualizarFiltro(setAnoSelecionado),
    pagina,
    setPagina,
    tamanhoPagina,
    definirTamanhoPagina: (tamanho) => {
      setPagina(0);
      setTamanhoPagina(tamanho);
    },
    paginacao,
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
    salvarEdicao,
  };
}
