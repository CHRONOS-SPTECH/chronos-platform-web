import { useCallback, useEffect, useRef, useState } from "react";
import sessionService from "../services/sessionService";
import turmaService from "../services/turmaService";
import aulaService from "../services/aulaService";
import alunoService from "../services/alunoService";
import { PAGE_SIZE } from "../config/pagination";

export default function usePresenca({ idTurma, idAula }) {
  const [usuario, setUsuario] = useState(null);
  const [turma, setTurma] = useState(null);
  const [aula, setAula] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [paginacao, setPaginacao] = useState({ totalElements: 0, totalPages: 0, number: 0, size: PAGE_SIZE, last: true });
  const [presencasAula, setPresencasAula] = useState([]);
  const alteracoesPresencaRef = useRef({});
  const [carregando, setCarregando] = useState(true);
  const [error, setError] = useState("");

  const mapearAlunosComPresenca = useCallback((listaAlunos, presencas) => {
    return (listaAlunos || []).map((aluno) => {
      const registroPresenca = (presencas || []).find(
        (presenca) => Number(presenca.id_pessoa) === Number(aluno.id_pessoa),
      );

      return {
        ...aluno,
        presente: Boolean(registroPresenca?.compareceu),
        compareceu: Boolean(registroPresenca?.compareceu),
        percentual_presenca: aluno.percentual_presenca ?? 0,
      };
    });
  }, []);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        setError("");

        const dadosSessao = sessionService.getSession();
        if (dadosSessao) setUsuario(dadosSessao);

        const [turmaCarregada, aulaCarregada, alunosDaTurma, presencasDaAula] =
          await Promise.all([
            turmaService.buscarTurmaPorId(idTurma),
            aulaService.buscarDetalhesAula(idAula),
            alunoService.listarAlunosPorTurma(idTurma, { page: pagina }),
            aulaService.buscarChamadaPorAula(idAula),
          ]);

        setTurma(turmaCarregada);
        setAula(aulaCarregada);
        setPresencasAula(presencasDaAula || []);
        const listaAlunos = Array.isArray(alunosDaTurma?.content) ? alunosDaTurma.content : Array.isArray(alunosDaTurma) ? alunosDaTurma : [];
        setAlunos(mapearAlunosComPresenca(listaAlunos, presencasDaAula).map((aluno) => (
          Object.hasOwn(alteracoesPresencaRef.current, aluno.id_pessoa)
            ? { ...aluno, presente: alteracoesPresencaRef.current[aluno.id_pessoa], compareceu: alteracoesPresencaRef.current[aluno.id_pessoa] }
            : aluno
        )));
        setPaginacao({ totalElements: alunosDaTurma?.totalElements ?? listaAlunos.length, totalPages: alunosDaTurma?.totalPages ?? 1, number: alunosDaTurma?.number ?? pagina, size: alunosDaTurma?.size ?? PAGE_SIZE, last: alunosDaTurma?.last ?? true });
      } catch (err) {
        console.error("Erro ao carregar dados da presença (hook):", err);
        setError("Erro ao carregar dados da presença.");
      } finally {
        setCarregando(false);
      }
    };

    if (idTurma && idAula) {
      carregarDados();
    }
  }, [idTurma, idAula, mapearAlunosComPresenca, pagina]);

  const alternarPresenca = useCallback((indiceAluno) => {
    const alunoAtual = alunos[indiceAluno];
    if (!alunoAtual) return;
    const presente = !(alunoAtual.presente ?? alunoAtual.compareceu ?? false);
    setAlunos((lista) => lista.map((aluno, indice) => indice === indiceAluno
      ? { ...aluno, presente, compareceu: presente }
      : aluno));
    const novasAlteracoes = {
      ...alteracoesPresencaRef.current,
      [alunoAtual.id_pessoa]: presente,
    };
    alteracoesPresencaRef.current = novasAlteracoes;
  }, [alunos]);

  const salvarChamada = useCallback(async () => {
    const idAulaInterna = aula?.aula?.id_aula ?? aula?.id_aula;
    if (!idAulaInterna) {
      throw new Error("ID da aula não encontrado.");
    }

    const todosAlunos = [];
    let paginaAtual = 0;
    let ultimaPagina = false;
    while (!ultimaPagina) {
      const resposta = await alunoService.listarAlunosPorTurma(idTurma, { page: paginaAtual, size: paginacao.size || PAGE_SIZE });
      const conteudo = Array.isArray(resposta?.content) ? resposta.content : [];
      todosAlunos.push(...conteudo);
      ultimaPagina = resposta?.last ?? true;
      if (!ultimaPagina && conteudo.length) paginaAtual = (resposta.number ?? paginaAtual) + 1;
      else ultimaPagina = true;
    }

    const alunosComPresenca = mapearAlunosComPresenca(todosAlunos, presencasAula);
    const dadosChamada = {
      id_aula: Number(idAulaInterna),
      alunos: alunosComPresenca.map((aluno) => ({
        id_pessoa: aluno.id_pessoa,
        compareceu: Boolean(alteracoesPresencaRef.current[aluno.id_pessoa] ?? aluno.presente ?? aluno.compareceu ?? false),
      })),
    };

    await aulaService.salvarChamadaEmLote(dadosChamada);
  }, [aula, idTurma, presencasAula, paginacao.size, mapearAlunosComPresenca]);

  return {
    usuario,
    turma,
    aula,
    alunos,
    pagina,
    setPagina,
    paginacao,
    carregando,
    error,
    alternarPresenca,
    salvarChamada,
  };
}
