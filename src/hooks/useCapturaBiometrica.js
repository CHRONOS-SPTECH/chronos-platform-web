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
  const [tamanhoImagem, setTamanhoImagem] = useState(null);

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
    const larguraMaxima = 1280;
    const maiorDimensao = Math.max(video.videoWidth, video.videoHeight);
    const escala = Math.min(1, larguraMaxima / maiorDimensao);
    canvas.width = Math.round(video.videoWidth * escala);
    canvas.height = Math.round(video.videoHeight * escala);
    const contexto = canvas.getContext("2d");

    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
    const deteccaoFinal = await detectarRosto(video);
    const deteccaoParaCaptura = deteccaoFinal || ultimaDeteccaoValida.current;

    if (deteccaoParaCaptura) {
      const vetorBiometrico = Array.from(deteccaoParaCaptura.descriptor);
      canvas.toBlob(
        (imagemBlob) => {
          if (!imagemBlob) return;

          const imagemPreview = URL.createObjectURL(imagemBlob);
          setPreviewFoto(imagemPreview);
          setTamanhoImagem(imagemBlob.size);

          const tamanhoEmKb = imagemBlob.size / 1024;
          const tamanhoEmMb = tamanhoEmKb / 1024;
          const limiteBackend = 10 * 1024 * 1024;
          const limiteAdapter = 5 * 1024 * 1024;
          console.info("[Biometria] TAMANHO REAL DA IMAGEM:", {
            bytes: imagemBlob.size,
            kb: `${tamanhoEmKb.toFixed(2)} KB`,
            mb: `${tamanhoEmMb.toFixed(4)} MB`,
            dimensoes: `${canvas.width}x${canvas.height}px`,
            qualidadeJpeg: 0.8,
            percentualDoLimiteDe10MB: `${((imagemBlob.size / limiteBackend) * 100).toFixed(2)}%`,
            acimaDoLimiteDoBackend: imagemBlob.size > limiteBackend,
            acimaDoLimiteDoAdapterS3: imagemBlob.size > limiteAdapter,
          });

          if (aoCapturarFoto) {
            aoCapturarFoto({
              imagemBlob,
              imagemPreview,
              tamanhoImagem: imagemBlob.size,
              vetorBiometrico,
            });
          }
        },
        "image/jpeg",
        0.8,
      );
    }
  }, [rostoAlinhado, detectarRosto, aoCapturarFoto]);

  const refazerFoto = useCallback(() => {
    setPreviewFoto(null);
    setTamanhoImagem(null);
    setRostoAlinhado(false);
    ultimaDeteccaoValida.current = null;
    ultimoAlinhamentoEm.current = 0;
    setMensagemFeedback("Alinhe o rosto no círculo...");
    if (previewFoto) URL.revokeObjectURL(previewFoto);
    if (aoCapturarFoto) aoCapturarFoto(null);
  }, [aoCapturarFoto, previewFoto]);

  return {
    referenciaVideo,
    carregouModelos,
    erroCarregamento,
    rostoAlinhado,
    mensagemFeedback,
    previewFoto,
    tamanhoImagem,
    tirarFoto,
    refazerFoto,
  };
};
