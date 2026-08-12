import { useCallback, useEffect, useState } from "react";
import sessionService from "../services/sessionService";
import turmaService from "../services/turmaService";
import aulaService from "../services/aulaService";
import alunoService from "../services/alunoService";

export default function usePresenca({ idTurma, idAula }) {
  const [usuario, setUsuario] = useState(null);
  const [turma, setTurma] = useState(null);
  const [aula, setAula] = useState(null);
  const [alunos, setAlunos] = useState([]);
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
            alunoService.listarAlunosPorTurma(idTurma),
            aulaService.buscarChamadaPorAula(idAula),
          ]);

        setTurma(turmaCarregada);
        setAula(aulaCarregada);
        setAlunos(mapearAlunosComPresenca(alunosDaTurma, presencasDaAula));
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
  }, [idTurma, idAula, mapearAlunosComPresenca]);

  const alternarPresenca = useCallback((indiceAluno) => {
    setAlunos((alunosAnteriores) => {
      if (!alunosAnteriores[indiceAluno]) return alunosAnteriores;

      const listaAtualizada = [...alunosAnteriores];
      const alunoAtual = listaAtualizada[indiceAluno];
      const presente = !(alunoAtual.presente ?? alunoAtual.compareceu ?? false);

      listaAtualizada[indiceAluno] = {
        ...alunoAtual,
        presente,
        compareceu: presente,
      };

      return listaAtualizada;
    });
  }, []);

  const salvarChamada = useCallback(async () => {
    const idAulaInterna = aula?.aula?.id_aula ?? aula?.id_aula;
    if (!idAulaInterna) {
      throw new Error("ID da aula não encontrado.");
    }

    const dadosChamada = {
      id_aula: Number(idAulaInterna),
      alunos: (alunos || []).map((aluno) => ({
        id_pessoa: aluno.id_pessoa,
        compareceu: Boolean(aluno.presente ?? aluno.compareceu ?? false),
      })),
    };

    await aulaService.salvarChamadaEmLote(dadosChamada);
  }, [aula, alunos]);

  return {
    usuario,
    turma,
    aula,
    alunos,
    carregando,
    error,
    alternarPresenca,
    salvarChamada,
  };
}
