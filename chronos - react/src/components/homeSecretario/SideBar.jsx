
import { useState } from "react";
import { Home, LogOut, ChevronDown, ChevronUp } from "lucide-react";

/**
 * Props:
 * - usuario: { inicial, nome }
 * - secoes: [{ label, icone, itens: ["..."] }]
 */
export default function Sidebar({ usuario = { inicial: "L", nome: "Lucas" }, secoes = [] }) {
  const [abertos, setAbertos] = useState(() =>
    Object.fromEntries(secoes.map((_, i) => [i, true]))
  );

  const toggleSecao = (i) =>
    setAbertos((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <aside className="w-[260px] min-h-screen bg-[#00871D] text-white flex flex-col justify-between">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 px-6 bg-[#1a4a1a] h-[68px]">
          <div className="bg-white text-[#00871D] font-bold text-lg w-9 h-9 flex items-center justify-center rounded">
            {usuario.inicial}
          </div>
          <span className="font-semibold text-xl">{usuario.nome}</span>
        </div>

        {/* Nav */}
        <nav className="mt-8 px-4 flex flex-col gap-3">

          {/* Home */}
          <div className="flex items-center gap-6 px-3 py-3 rounded-md bg-[#006b17] cursor-pointer hover:bg-[#005e14] transition-colors">
            <Home size={20} />
            <span className="text-base font-medium">Home</span>
          </div>

          {/* Seções dinâmicas */}
          {secoes.map((secao, i) => (
            <div key={i}>
              {/* Label da seção */}
              <p className="text-sm text-green-200 mt-6 mb-2 px-1 tracking-wide uppercase">
                {secao.label}
              </p>

              {/* Item principal com sub-itens */}
              <div
                className="flex items-center justify-between px-3 py-3 rounded-md bg-[#006b17] cursor-pointer hover:bg-[#005e14] transition-colors"
                onClick={() => toggleSecao(i)}
              >
                <div className="flex items-center gap-6 h-8">
                  {secao.icone && <span>{secao.icone}</span>}
                  <span className="text-base font-medium">{secao.titulo}</span>
                </div>
                {abertos[i] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {/* Sub-itens */}
              {abertos[i] && (
                <div className="ml-4 mt-2 flex flex-col text-base text-green-100">
                  {secao.itens.map((item, j, arr) => (
                    <div key={j}>
                      <div className="py-3 px-2 cursor-pointer hover:text-white transition-colors">
                        {item}
                      </div>
                      {j < arr.length - 1 && (
                        <div className="border-t border-green-600 opacity-50" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="px-4 pb-6">
        <div className="flex items-center gap-6 px-3 py-3 rounded-md cursor-pointer hover:bg-[#006b17] transition-colors">
          <LogOut size={20} />
          <span className="text-base font-medium">Sair</span>
        </div>
      </div>

    </aside>
  );
}
