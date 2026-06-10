export const getHojeIso = () => {
  return new Date()
    .toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })
    .split("/")
    .reverse()
    .join("-");
};

export const formatarDataBr = (data) => {
  if (!data) return "Não informada";

  if (typeof data === "string" && data.includes("-")) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  const d = typeof data === "string" ? new Date(data) : data;
  return new Intl.DateTimeFormat("pt-BR").format(d);
};

export const formatarTelefone = (tel) => {
  if (!tel) return "Não informado";
  const limpo = tel.replace(/\D/g, "");
  if (limpo.length === 11) {
    return `(${limpo.substring(0, 2)}) ${limpo.substring(2, 7)}-${limpo.substring(7)}`;
  }
  return tel;
};

export const formatarCPF = (cpf) => {
  if (!cpf) return "Não informado";
  const limpo = cpf.replace(/\D/g, "");
  if (limpo.length === 11) {
    return `${limpo.substring(0, 3)}.${limpo.substring(3, 6)}.${limpo.substring(6, 9)}-${limpo.substring(9)}`;
  }
  return cpf;
};
