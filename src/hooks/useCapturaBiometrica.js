import { useRef, useState, useEffect, useCallback } from "react";
import { useFaceApi } from "./useFaceApi";

// Parâmetros de alinhamento do rosto no vídeo
const ALVO_MASCARA = {
  centroX: 0.5,
  centroY: 0.45,
  proporcaoMinimaLargura: 0.18,
  proporcaoMaximaLargura: 0.55,
};

const TOLERANCIA_ALINHAMENTO_MS = 1000;

export const useCapturaBiometrica = (aoCapturarFoto) => {
  const referenciaVideo = useRef(null);
  const ultimaDeteccaoValida = useRef(null);
  const ultimoAlinhamentoEm = useRef(0);
  const {
    modelsLoaded: carregouModelos,
    loadingError: erroCarregamento,
    detectFace: detectarRosto,
  } = useFaceApi();

  const [transmissaoCamera, setTransmissaoCamera] = useState(null);
  const [rostoAlinhado, setRostoAlinhado] = useState(false);
  const [mensagemFeedback, setMensagemFeedback] = useState(
    "Iniciando câmera...",
  );
  const [previewFoto, setPreviewFoto] = useState(null);

  // Inicializa a webcam
  useEffect(() => {
    let transmissaoAtual = null;

    const iniciarCamera = async () => {
      try {
        transmissaoAtual = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: "user" },
        });
        if (referenciaVideo.current) {
          referenciaVideo.current.srcObject = transmissaoAtual;
        }
        setTransmissaoCamera(transmissaoAtual);
      } catch (err) {
        setMensagemFeedback(
          "Erro ao acessar a webcam. Verifique as permissões.",
        );
      }
    };

    if (carregouModelos) iniciarCamera();

    return () => {
      if (transmissaoAtual) {
        transmissaoAtual.getTracks().forEach((faixa) => faixa.stop());
      }
    };
  }, [carregouModelos]);

  // O preview desmonta o video; reconecta o mesmo stream ao refazer a foto.
  useEffect(() => {
    const video = referenciaVideo.current;
    if (!video || !transmissaoCamera || previewFoto) return;

    video.srcObject = transmissaoCamera;
    video.play().catch(() => {});
  }, [transmissaoCamera, previewFoto]);

  // Loop de validação do alinhamento do rosto
  useEffect(() => {
    let idIntervalo = null;

    if (
      carregouModelos &&
      transmissaoCamera &&
      referenciaVideo.current &&
      !previewFoto
    ) {
      idIntervalo = setInterval(async () => {
        const video = referenciaVideo.current;
        if (!video || video.paused || video.ended) return;

        const deteccao = await detectarRosto(video);

        if (!deteccao) {
          if (
            Date.now() - ultimoAlinhamentoEm.current >
            TOLERANCIA_ALINHAMENTO_MS
          ) {
            setRostoAlinhado(false);
          }
          setMensagemFeedback("Nenhum rosto detectado");
          return;
        }

        const { box: caixaRosto } = deteccao.detection;
        const larguraVideo = video.videoWidth || 1;
        const alturaVideo = video.videoHeight || 1;

        const centroRostoX =
          (caixaRosto.x + caixaRosto.width / 2) / larguraVideo;
        const centroRostoY =
          (caixaRosto.y + caixaRosto.height / 2) / alturaVideo;
        const proporcaoLarguraRosto = caixaRosto.width / larguraVideo;

        const estaCentralizadoX =
          Math.abs(centroRostoX - ALVO_MASCARA.centroX) < 0.16;
        const estaCentralizadoY =
          Math.abs(centroRostoY - ALVO_MASCARA.centroY) < 0.16;
        const estaNaDistanciaIdeal =
          proporcaoLarguraRosto >= ALVO_MASCARA.proporcaoMinimaLargura &&
          proporcaoLarguraRosto <= ALVO_MASCARA.proporcaoMaximaLargura;

        if (estaCentralizadoX && estaCentralizadoY && estaNaDistanciaIdeal) {
          ultimaDeteccaoValida.current = deteccao;
          ultimoAlinhamentoEm.current = Date.now();
          setRostoAlinhado(true);
          setMensagemFeedback("Rosto alinhado! Pode tirar a foto.");
        } else if (!estaNaDistanciaIdeal) {
          if (
            Date.now() - ultimoAlinhamentoEm.current >
            TOLERANCIA_ALINHAMENTO_MS
          ) {
            setRostoAlinhado(false);
          }
          setMensagemFeedback(
            proporcaoLarguraRosto < ALVO_MASCARA.proporcaoMinimaLargura
              ? "Aproxime-se mais da câmera"
              : "Afaste-se um pouco",
          );
        } else {
          if (
            Date.now() - ultimoAlinhamentoEm.current >
            TOLERANCIA_ALINHAMENTO_MS
          ) {
            setRostoAlinhado(false);
          }
          setMensagemFeedback("Centralize o rosto no círculo");
        }
      }, 200);
    }

    return () => {
      if (idIntervalo) clearInterval(idIntervalo);
    };
  }, [carregouModelos, transmissaoCamera, detectarRosto, previewFoto]);

  // Captura da foto e extração da biometria
  const tirarFoto = useCallback(async () => {
    if (!referenciaVideo.current || !rostoAlinhado) return;

    const video = referenciaVideo.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const contexto = canvas.getContext("2d");

    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imagemBase64 = canvas.toDataURL("image/jpeg", 0.9);

    const deteccaoFinal = await detectarRosto(video);
    const deteccaoParaCaptura = deteccaoFinal || ultimaDeteccaoValida.current;

    if (deteccaoParaCaptura) {
      const vetorBiometrico = Array.from(deteccaoParaCaptura.descriptor);
      setPreviewFoto(imagemBase64);

      if (aoCapturarFoto) {
        aoCapturarFoto({
          imagemBase64,
          vetorBiometrico,
        });
      }
    }
  }, [rostoAlinhado, detectarRosto, aoCapturarFoto]);

  const refazerFoto = useCallback(() => {
    setPreviewFoto(null);
    setRostoAlinhado(false);
    ultimaDeteccaoValida.current = null;
    ultimoAlinhamentoEm.current = 0;
    setMensagemFeedback("Alinhe o rosto no círculo...");
    if (aoCapturarFoto) aoCapturarFoto(null);
  }, [aoCapturarFoto]);

  return {
    referenciaVideo,
    carregouModelos,
    erroCarregamento,
    rostoAlinhado,
    mensagemFeedback,
    previewFoto,
    tirarFoto,
    refazerFoto,
  };
};
