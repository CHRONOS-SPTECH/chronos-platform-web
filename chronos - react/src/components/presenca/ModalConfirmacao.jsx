import { UserCircle } from "lucide-react";

function ModalConfirmacao({ isOpen, onClose, alunos, onTogglePresenca }) {
  if (!isOpen) return null;

  const getCorBarra = (porcentagem) => {
    if (porcentagem <= 30) return "bg-orange-500";
    if (porcentagem <= 50) return "bg-blue-500";
    return "bg-green-700";
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-8">
        <h2 className="text-2xl font-bold text-black mb-6 border-b-2 border-black inline-block pb-1">
          Confirmar Presença
        </h2>

        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#004d00] text-white font-semibold">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-green-600"
                  />
                </th>
                <th className="px-4 py-3 uppercase">Nome do Aluno</th>
                <th className="px-4 py-3 uppercase">Percent. Presença %</th>
                <th className="px-4 py-3 uppercase text-center">Presença</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {alunos.map((aluno, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <UserCircle
                      size={32}
                      className="text-green-500 bg-green-100 rounded-full"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-800">{aluno.nome}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1 w-48">
                      <span className="text-xs text-gray-600">
                        <strong className="text-black text-sm">
                          {aluno.presenca}%
                        </strong>{" "}
                        de Presença
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 border border-gray-300">
                        <div
                          className={`h-1.5 rounded-full ${getCorBarra(aluno.presenca)}`}
                          style={{ width: `${aluno.presenca}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={aluno.presente}
                        onChange={() => onTogglePresenca(index)} // Altera em ambos
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 mt-10">
          <button
            onClick={onClose}
            className="h-[40px] px-6 bg-[#595959] text-white font-bold rounded-lg shadow-sm"
          >
            Cancelar
          </button>
          <button className="h-[40px] px-6 bg-[#0098DA] text-white font-bold rounded-lg shadow-sm">
            Confirmar Chamada
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmacao;
