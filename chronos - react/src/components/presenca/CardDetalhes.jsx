import React from "react";
import { UserCircle, X, Award } from "lucide-react";
import {
  formatarDataBr,
  formatarTelefone,
  formatarCPF,
} from "../../utils/DateUtils";

// JSON Mockado fixo para teste
const ALUNO_MOCK = {
  id_pessoa: 1,
  nome: "Henrique Nolêto",
  email: "henrique.contato@email.com",
  telefone: "11999999999",
  genero: "Masculino",
  cpf: "12345678901",
  bolsista: false,
  url_foto_perfil: null,
  data_nascimento: "1995-05-15",
  data_ingresso: "2026-01-10",
  data_membro: "2026-01-15",
  data_saida: null,
  vinculo: {
    id_tipo_vinculo: 1,
    nome_vinculo: "Público Externo",
    descricao:
      "Pessoas que frequentam palestras abertas, mas não estão matriculados.",
  },
};

function CardDetalhes({ isOpen, onClose }) {
  // Usando a variável fixa diretamente
  const dadosCompletos = ALUNO_MOCK;
  const pct = 100; // Média mockada simples para o rodapé

  return (
    <>
      {/* Camada escura de fundo (Overlay) */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Menu Lateral Direito */}
      <div
        className={`fixed top-0 right-0 h-full w-85 bg-white border-l border-gray-200 p-5 shadow-2xl z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="overflow-y-auto pr-1 custom-scrollbar flex-1">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-5">
            <h3 className="text-md font-bold text-gray-800">
              Detalhes do Aluno
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Perfil Principal */}
          <div className="flex flex-col items-center text-center mb-6 relative">
            {dadosCompletos.url_foto_perfil ? (
              <img
                src={dadosCompletos.url_foto_perfil}
                alt={dadosCompletos.nome}
                className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-green-500"
              />
            ) : (
              <UserCircle
                size={64}
                className="text-green-600 bg-green-50 rounded-full mb-2"
              />
            )}
            <h4 className="text-base font-semibold text-gray-800">
              {dadosCompletos.nome}
            </h4>

            <span
              className="mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600"
              title={dadosCompletos.vinculo?.descricao}
            >
              {dadosCompletos.vinculo?.nome_vinculo || "Sem vínculo"}
            </span>

            {dadosCompletos.bolsista && (
              <span
                className="absolute top-0 right-1/3 bg-yellow-100 text-yellow-700 p-1 rounded-full"
                title="Bolsista"
              >
                <Award size={14} />
              </span>
            )}
          </div>

          {/* Informações Pessoais e Acadêmicas */}
          <div className="space-y-3 text-xs grid grid-cols-1 gap-y-3">
            <div>
              <span className="text-gray-400 block mb-0.5">E-mail</span>
              <span className="text-gray-700 font-medium break-all">
                {dadosCompletos.email || "Não informado"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400 block mb-0.5">Telefone</span>
                <span className="text-gray-700 font-medium">
                  {formatarTelefone(dadosCompletos.telefone)}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">CPF</span>
                <span className="text-gray-700 font-medium">
                  {formatarCPF(dadosCompletos.cpf)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400 block mb-0.5">Gênero</span>
                <span className="text-gray-700 font-medium">
                  {dadosCompletos.genero || "Não informado"}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Nascimento</span>
                <span className="text-gray-700 font-medium">
                  {formatarDataBr(dadosCompletos.data_nascimento)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-green-50/50 p-2 rounded-lg border border-green-100/50 mt-2">
              <div>
                <span className="text-green-700/70 block mb-0.5 font-medium">
                  Ingresso
                </span>
                <span className="text-green-900 font-semibold">
                  {formatarDataBr(dadosCompletos.data_ingresso)}
                </span>
              </div>
              <div>
                <span className="text-green-700/70 block mb-0.5 font-medium">
                  Virou Membro
                </span>
                <span className="text-green-900 font-semibold">
                  {formatarDataBr(dadosCompletos.data_membro)}
                </span>
              </div>
            </div>

            {dadosCompletos.data_saida && (
              <div className="bg-red-50 p-2 rounded-lg border border-red-100">
                <span className="text-red-700 block mb-0.5 font-medium">
                  Data de Saída
                </span>
                <span className="text-red-900 font-semibold">
                  {formatarDataBr(dadosCompletos.data_saida)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Média Geral no Rodapé */}
        <div className="pt-4 border-t border-gray-100 mt-auto">
          <div className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-500 font-medium">
              Média Geral de Presença:
            </span>
            <span className="font-bold text-base text-green-600">{pct}%</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardDetalhes;
