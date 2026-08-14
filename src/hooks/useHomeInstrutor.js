import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useToast } from "../components/alert-toast/ToastProvider";
import aulaService from "../services/aulaService";
import sessionService from "../services/sessionService";
import { getHojeIso } from "../utils/DateUtils";

const selecionarAulaParaPresenca = (aulasHoje) => {
  const aulaEmAberto = aulasHoje.find(
    (item) => !Boolean(item?.chamadaFeita ?? item?.aula?.chamadaFeita),
  );

  return aulaEmAberto || aulasHoje[0] || null;
};

export default function useHomeInstrutor() {
  const navigate = useNavigate();
  const toast = useToast();
  const [aula, setAula] = useState(null);

  const carregarAulaHoje = useCallback(async () => {
    try {
      const dadosSessao = sessionService.getSession();
      if (!dadosSessao?.usuario) return;

      const aulasHoje = await aulaService.listarAulasDoDia(
        dadosSessao.usuario.id_usuario,
        getHojeIso(),
      );

      setAula(selecionarAulaParaPresenca(aulasHoje || []));
    } catch (erro) {
      console.error("Erro ao buscar aulas do instrutor:", erro);
    }
  }, []);

  useEffect(() => {
    carregarAulaHoje();
  }, [carregarAulaHoje]);

  const iniciarPresenca = useCallback(async () => {
    try {
      const dadosSessao = sessionService.getSession();
      if (!dadosSessao?.usuario) return;

      const aulasHoje = await aulaService.listarAulasDoDia(
        dadosSessao.usuario.id_usuario,
        getHojeIso(),
      );

      const aulaParaAbrir = selecionarAulaParaPresenca(aulasHoje || []);

      if (!aulaParaAbrir?.aula?.id_turma || !aulaParaAbrir?.aula?.id_aula) {
        toast.error("Nenhuma aula em andamento encontrada para hoje.");
        return;
      }

      navigate(
        `/presenca/${aulaParaAbrir.aula.id_turma}/${aulaParaAbrir.aula.id_aula}`,
      );
    } catch (erro) {
      console.error("Erro ao abrir a presença:", erro);
      toast.error("Erro ao buscar a aula para marcar presença.");
    }
  }, [navigate, toast]);

  return {
    aula,
    carregarAulaHoje,
    iniciarPresenca,
  };
}
