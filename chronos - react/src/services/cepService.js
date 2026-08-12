const buscarEnderecoPorCep = async (cep) => {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  return response.json();
};

export default {
  buscarEnderecoPorCep,
};
