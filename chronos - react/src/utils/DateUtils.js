export const getHojeIso = () => {
  return new Date().toISOString().split("T")[0];
};

export const formatarDataBr = (data) => {
  if (!data) return "";
  const d = typeof data === "string" ? new Date(data) : data;
  return new Intl.DateTimeFormat("pt-BR").format(d);
};
