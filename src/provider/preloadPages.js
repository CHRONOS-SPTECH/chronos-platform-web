export const loadPerfils = () => import("../pages/Perfils");
export const loadHomeInstrutor = () => import("../pages/instrutor/HomeInstrutor");
export const loadHomeSecretario = () => import("../pages/secretaria/HomeSecretario");
export const loadHomeDiretor = () => import("../pages/HomeDiretor");

export function preloadPostLoginPages() {
  void loadPerfils()
    .then(() => {
      const homePages = [
        ["home do instrutor", loadHomeInstrutor],
        ["home da secretaria", loadHomeSecretario],
        ["home do administrador", loadHomeDiretor],
      ];

      for (const [pageName, loadPage] of homePages) {
        void loadPage().catch((error) => {
          console.error(`Não foi possível pré-carregar ${pageName}.`, error);
        });
      }
    })
    .catch((error) => {
      console.error("Não foi possível pré-carregar a tela de perfis.", error);
    });
}
