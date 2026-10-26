import { useCallback, useEffect, useState } from "react";
import alunoService from "../services/alunoService";
import { PAGE_SIZE } from "../config/pagination";

export default function useAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [tamanhoPagina, setTamanhoPagina] = useState(PAGE_SIZE);
  const [paginacao, setPaginacao] = useState({ totalElements: 0, totalPages: 0, number: 0, last: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregarAlunos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const dados = await alunoService.listarAlunos({ page: pagina, size: tamanhoPagina });
      const conteudo = Array.isArray(dados?.content) ? dados.content : Array.isArray(dados) ? dados : [];
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
  }, [pagina, tamanhoPagina]);

  useEffect(() => {
    carregarAlunos();
  }, [carregarAlunos]);

  const salvarAluno = async (
    dadosPessoa,
    dadosEndereco,
    alunoEmEdicao = null,
    biometria = null,
  ) => {
    try {
      setSalvando(true);
      if (alunoEmEdicao) {
        const id = alunoEmEdicao.id_pessoa || alunoEmEdicao.id;
        const alunoAtualizado = await alunoService.atualizarAluno(
          id,
          dadosPessoa,
        );

        let alunoFinal = { ...alunoEmEdicao, ...alunoAtualizado };

        if (dadosEndereco) {
          if (dadosEndereco.id) {
            const enderecoAtu = await alunoService.atualizarEndereco(
              dadosEndereco.id,
              { ...dadosEndereco, id_pessoa: id },
            );
            alunoFinal.endereco = enderecoAtu;
          } else {
            const enderecoCriado = await alunoService.cadastrarEndereco({
              ...dadosEndereco,
              id_pessoa: id,
            });
            alunoFinal.endereco = enderecoCriado;
          }
        }

        await carregarAlunos();
        return alunoFinal;
      } else {
        const possuiBiometria =
          biometria?.imagemBlob instanceof Blob &&
          biometria?.vetorBiometrico?.length > 0;
        const alunoCriado = possuiBiometria
          ? await alunoService.cadastrarAlunoComBiometria(
              dadosPessoa,
              biometria,
            )
          : await alunoService.cadastrarAluno(dadosPessoa);
        let alunoFinal = { ...alunoCriado };

        if (dadosEndereco) {
          const enderecoCriado = await alunoService.cadastrarEndereco({
            ...dadosEndereco,
            id_pessoa: alunoCriado.id_pessoa,
          });
          alunoFinal.endereco = enderecoCriado;
        }

        await carregarAlunos();
        return alunoFinal;
      }
    } catch (err) {
      console.error("Erro ao salvar aluno (hook):", err);
      throw err;
    } finally {
      setSalvando(false);
    }
  };

  const excluirAluno = async (idPessoa) => {
    try {
      await alunoService.excluirAluno(idPessoa);
      await carregarAlunos();
    } catch (err) {
      console.error("Erro ao excluir aluno (hook):", err);
      throw err;
    }
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
    excluirAluno,
  };
}
