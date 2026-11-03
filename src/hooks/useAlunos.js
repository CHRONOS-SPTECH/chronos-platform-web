import { useCallback, useEffect, useRef, useState } from "react";
import alunoService from "../services/alunoService";
import pessoaService from "../services/pessoaService";
import matriculaTurmaService from "../services/matriculaTurmaService";
import { PAGE_SIZE } from "../config/pagination";

export default function useAlunos({ publicoExterno = false } = {}) {
  const [alunos, setAlunos] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [tamanhoPagina, setTamanhoPagina] = useState(PAGE_SIZE);
  const [paginacao, setPaginacao] = useState({ totalElements: 0, totalPages: 0, number: 0, last: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [salvando, setSalvando] = useState(false);
  const pessoaPendenteMatricula = useRef(null);

  const carregarAlunos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const dados = publicoExterno
        ? await alunoService.listarPessoasExternas({ page: pagina, size: tamanhoPagina })
        : await alunoService.listarAlunos({ page: pagina, size: tamanhoPagina });
      const registros = Array.isArray(dados?.content) ? dados.content : Array.isArray(dados) ? dados : [];
      const conteudo = publicoExterno ? registros : await Promise.all(registros.map(async (pessoa) => {
        if (typeof pessoa.possui_biometria === "boolean") return pessoa;
        try {
          const detalhes = await pessoaService.buscarPessoaDetalhada(pessoa.id_pessoa);
          return { ...pessoa, possui_biometria: detalhes.possui_biometria };
        } catch {
          return { ...pessoa, possui_biometria: null };
        }
      }));
      setAlunos(conteudo);
      setPaginacao({
        totalElements: dados?.totalElements ?? conteudo.length,
        totalPages: dados?.totalPages ?? 1,
        number: dados?.number ?? pagina,
        last: dados?.last ?? true,
      });
    } catch (err) {
      console.error("Erro ao carregar alunos (hook):", err);
      setError(
        err?.response?.data?.message || "Não foi possível carregar os alunos.",
      );
    } finally {
      setLoading(false);
    }
  }, [pagina, tamanhoPagina, publicoExterno]);

  useEffect(() => {
    carregarAlunos();
  }, [carregarAlunos]);

  const salvarAluno = async (
    dadosPessoa,
    alunoEmEdicao = null,
    biometria = null,
    idTurma = null,
  ) => {
    try {
      setSalvando(true);
      if (alunoEmEdicao) {
        const id = alunoEmEdicao.id_pessoa || alunoEmEdicao.id;
        const alunoAtualizado = await alunoService.atualizarAluno(
          id,
          dadosPessoa,
        );

        await carregarAlunos();
        return { ...alunoEmEdicao, ...alunoAtualizado };
      } else {
        const email = String(dadosPessoa.email || "").trim().toLowerCase();
        if (pessoaPendenteMatricula.current && pessoaPendenteMatricula.current.email !== email) {
          throw new Error("Há um cadastro aguardando matrícula. Repita o mesmo e-mail e selecione uma turma para concluir.");
        }
        const alunoCriado = pessoaPendenteMatricula.current?.pessoa || await alunoService.registrarPessoa(dadosPessoa, biometria);
        if (!publicoExterno) {
          if (!idTurma) throw new Error("Selecione uma turma para matricular o aluno.");
          const dataAtual = new Date();
          const dataMatricula = [dataAtual.getFullYear(), String(dataAtual.getMonth() + 1).padStart(2, "0"), String(dataAtual.getDate()).padStart(2, "0")].join("-");
          try {
            if (pessoaPendenteMatricula.current) {
              try {
                await matriculaTurmaService.buscarMatricula(idTurma, alunoCriado.id_pessoa);
              } catch (error) {
                if (error?.response?.status !== 404) throw error;
                await matriculaTurmaService.matricularPessoa({ idTurma, idPessoa: alunoCriado.id_pessoa, dataMatricula });
              }
            } else {
              await matriculaTurmaService.matricularPessoa({ idTurma, idPessoa: alunoCriado.id_pessoa, dataMatricula });
            }
            pessoaPendenteMatricula.current = null;
          } catch (error) {
            pessoaPendenteMatricula.current = { email, pessoa: alunoCriado };
            throw new Error("A pessoa foi cadastrada, mas a matrícula não foi concluída. Mantenha o mesmo e-mail, selecione uma turma e tente salvar novamente.", { cause: error });
          }
        }
        await carregarAlunos();
        return alunoCriado;
      }
    } catch (err) {
      console.error("Erro ao salvar aluno (hook):", err);
      throw err;
    } finally {
      setSalvando(false);
    }
  };

  const inativarPessoa = async (idPessoa) => {
    try {
      await pessoaService.inativarPessoa(idPessoa);
      await carregarAlunos();
    } catch (err) {
      console.error("Erro ao inativar pessoa (hook):", err);
      throw err;
    }
  };

  const atualizarBiometria = async (idPessoa, captura) => {
    const pessoaAtualizada = await pessoaService.atualizarBiometria(idPessoa, captura);
    setAlunos((registros) => registros.map((pessoa) => pessoa.id_pessoa === idPessoa
      ? { ...pessoa, ...pessoaAtualizada, possui_biometria: true }
      : pessoa));
    return pessoaAtualizada;
  };

  return {
    alunos,
    pagina,
    setPagina,
    tamanhoPagina,
    definirTamanhoPagina: (tamanho) => {
      setPagina(0);
      setTamanhoPagina(tamanho);
    },
    paginacao,
    loading,
    error,
    carregando: loading,
    salvando,
    carregarAlunos,
    salvarAluno,
    inativarPessoa,
    atualizarBiometria,
  };
}
