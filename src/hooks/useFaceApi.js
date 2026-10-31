import { useState, useEffect, useCallback, useRef } from "react";

let modelosCarregando;

async function carregarModelos() {
  if (!modelosCarregando) {
    modelosCarregando = import("face-api.js")
      .then(async (faceapi) => {
        const modelUrl = `${import.meta.env.BASE_URL}models`;
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
          faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
          faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl),
        ]);
        return faceapi;
      })
      .catch((error) => {
        modelosCarregando = null;
        throw error;
      });
  }

  return modelosCarregando;
}

export const useFaceApi = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const faceApiRef = useRef(null);

  useEffect(() => {
    let active = true;

    const loadModels = async () => {
      try {
        const faceapi = await carregarModelos();
        if (active) {
          faceApiRef.current = faceapi;
          setModelsLoaded(true);
        }
      } catch (error) {
        console.error("Erro ao carregar modelos do face-api:", {
          modeloUrl: `${import.meta.env.BASE_URL}models`,
          mensagem: error?.message,
          erro: error,
        });
        if (active) {
          setLoadingError(
            "Não foi possível carregar o módulo de biometria facial.",
          );
        }
      }
    };

    loadModels();

    return () => {
      active = false;
    };
  }, []);

  const detectFace = useCallback(
    async (videoElement) => {
      const faceapi = faceApiRef.current;
      if (!modelsLoaded || !faceapi || !videoElement) return null;

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
