function Acoes({ titulo = "MINHAS AÇÕES", acaoPrincipal, acoesSecundarias = [] }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-bold text-[#00000084]">
        {titulo}
      </p>

      {/* Botão principal */}
      {acaoPrincipal && (
        <button className="flex items-center gap-3 bg-[#00871D] hover:bg-[#006b17] text-white text-lg font-semibold px-6 py-5 rounded-xl transition-colors w-full">
          {acaoPrincipal.icone && <span>{acaoPrincipal.icone}</span>}
          {acaoPrincipal.texto}
        </button>
      )}

      {/* Botões secundários */}
      {acoesSecundarias.length > 0 && (
        <div className="flex gap-4">
          {acoesSecundarias.map((acao, index) => (
            <button
              key={index}
              className="flex items-center gap-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium px-5 py-4 rounded-xl transition-colors flex-1"
            >
              {acao.icone && <span>{acao.icone}</span>}
              {acao.texto}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Acoes;
