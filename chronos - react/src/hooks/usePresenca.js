import { useEffect, useState } from "react";
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

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        setError("");

        const dadosSessao = sessionService.getSession();
        if (dadosSessao) setUsuario(dadosSessao);

        const [turmaData, aulaData, alunosData, presencasData] =
          await Promise.all([
            turmaService.buscarTurmaPorId(idTurma),
            aulaService.buscarDetalhesAula(idAula),
            alunoService.listarAlunosPorTurma(idTurma),
            aulaService.buscarChamadaPorAula(idAula),
          ]);

        const alunosComPresenca = (alunosData || []).map((aluno) => {
          const registro = (presencasData || []).find(
            (item) => Number(item.id_pessoa) === Number(aluno.id_pessoa),
          );

          return {
            ...aluno,
            presente: Boolean(registro?.compareceu),
            compareceu: Boolean(registro?.compareceu),
            percentual_presenca: aluno.percentual_presenca ?? 0,
          };
        });

        setTurma(turmaData);
        setAula(aulaData);
        setAlunos(alunosComPresenca);
      } catch (err) {
        console.error("Erro ao carregar dados da presença (hook):", err);
        setError("Erro ao carregar dados da presença.");
      } finally {
        setCarregando(false);
      }
    };

    if (idTurma && idAula) carregarDados();
  }, [idTurma, idAula]);

  const alternarPresenca = (idx) => {
    setAlunos((ant) => {
      const nova = [...ant];
      nova[idx] = { ...nova[idx], presente: !nova[idx].presente };
      return nova;
    });
  };

  const salvarChamada = async () => {
    const idAulaInterna = aula?.aula?.id_aula;
    if (!idAulaInterna) throw new Error("ID da aula não encontrado.");

    const dadosChamada = {
      id_aula: idAulaInterna,
      alunos: (alunos || []).map((aluno) => ({
        id_pessoa: aluno.id_pessoa,
        compareceu: aluno.presente,
      })),
    };

    await aulaService.salvarChamadaEmLote(dadosChamada);
  };

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
