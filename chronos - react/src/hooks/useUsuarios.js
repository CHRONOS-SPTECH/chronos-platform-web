import { useCallback, useEffect, useState } from "react";

import usuarioService from "../services/usuarioService";

export default function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarUsuarios = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const dadosUsuarios = await usuarioService.listarUsuarios();
      setUsuarios(Array.isArray(dadosUsuarios) ? dadosUsuarios : []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setErro("Erro ao buscar usuários.");
      setUsuarios([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  return {
    usuarios,
    carregando,
    erro,
    carregarUsuarios,
  };
}
