import { useState, useEffect, useCallback } from "react";
import * as faceapi from "face-api.js";

export const useFaceApi = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(null);

  // 1. Carrega os modelos estáticos da pasta /public/models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = `${import.meta.env.BASE_URL}models`;
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (error) {
        console.error("Erro ao carregar modelos do face-api:", {
          modeloUrl: `${import.meta.env.BASE_URL}models`,
          mensagem: error?.message,
          erro: error,
        });
        setLoadingError(
          "Não foi possível carregar o módulo de biometria facial.",
        );
      }
    };

    loadModels();
  }, []);

  // 2. Função para analisar um elemento de vídeo ou canvas
  const detectFace = useCallback(
    async (videoElement) => {
      if (!modelsLoaded || !videoElement) return null;

      // Detecta 1 rosto, pega os pontos e gera a "digital" (descriptor)
      return await faceapi
        .detectSingleFace(
          videoElement,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,
            scoreThreshold: 0.5,
          }),
        )
        .withFaceLandmarks()
        .withFaceDescriptor();
    },
    [modelsLoaded],
  );

  return { modelsLoaded, loadingError, detectFace };
};
