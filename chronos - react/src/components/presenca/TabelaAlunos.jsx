import React from "react";
import { UserCircle } from "lucide-react";

function TabelaAlunos({ alunos, onTogglePresenca }) {
  return (
    <div className="max-h-[380px] overflow-y-auto border border-gray-200 rounded-lg custom-scrollbar">
      <table className="w-full border-separate border-spacing-0">
        <thead className="sticky top-0 z-10 bg-white">
          <tr className="text-left text-sm font-semibold text-gray-600">
            <th className="py-3 px-4 border-b border-gray-200 w-12">
              <input
                type="checkbox"
                className="w-8 h-4 rounded text-green-600"
              />
            </th>
            <th className="py-3 px-4 border-b border-gray-200">
              Nome do Aluno
            </th>
            <th className="py-3 px-4 border-b border-gray-200">CPF</th>
            <th className="py-3 px-4 border-b border-gray-200">Presença</th>
            <th className="py-3 px-4 border-b border-gray-200">Progresso</th>
            <th className="py-3 px-4 border-b border-gray-200 text-center">
              Status
            </th>
            <th className="py-3 px-4 border-b border-gray-200">Ações</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {alunos.map((aluno, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              {/* FOTO ADICIONADA AQUI */}
              <td className="py-4 px-4 border-b border-gray-100">
                <UserCircle
                  size={32}
                  className="text-green-500 bg-green-100 rounded-full"
                />
              </td>
              <td className="py-4 px-4 text-sm font-medium text-gray-800 border-b border-gray-100">
                {aluno.nome}
              </td>
              <td className="py-4 px-4 text-sm text-gray-500 border-b border-gray-100">
                {aluno.cpf}
              </td>
              <td className="py-4 px-4 text-sm font-semibold text-gray-700 border-b border-gray-100">
                {aluno.presenca}%
              </td>
              <td className="py-4 px-4 border-b border-gray-100">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${aluno.presenca >= 75 ? "bg-green-500" : "bg-yellow-500"}`}
                    style={{ width: `${aluno.presenca}%` }}
                  ></div>
                </div>
              </td>
              <td className="py-4 px-4 border-b border-gray-100 text-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={aluno.presente} // Conectado ao estado
                    onChange={() => onTogglePresenca(index)} // Função de mudança
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00871D] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00871D]"></div>
                </label>
              </td>
              <td className="py-4 px-4 border-b border-gray-100 text-sm text-[#00871D] font-medium cursor-pointer hover:underline">
                Ver Detalhes
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaAlunos;
