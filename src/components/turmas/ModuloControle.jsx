import React from "react";
import { useNavigate } from "react-router-dom"; // Importado corretamente

function ModulosControle({ moduloAtivo }) {
  const navigate = useNavigate(); // Instanciado o hook

  const opcoes = [
    { label: "Aluno", value: "Alunos", rota: "/alunos" },
    { label: "Turmas", value: "Turmas", rota: "/turmas" },
    { label: "Eventos", value: "Eventos", rota: "/eventos" },
  ];

  return (
    <div className="flex flex-col">
      <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase ml-1 mb-2">
        Módulos de Controle
      </p>
      <div className="flex gap-2 bg-slate-200/60 p-1 rounded-2xl w-fit">
        {opcoes.map((opcao) => {
          const ativo = moduloAtivo === opcao.value;
          return (
            <button
              key={opcao.value}
              onClick={() => navigate(opcao.rota)} // Navega para a rota absoluta mapeada
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200
                ${
                  ativo
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
            >
              {opcao.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ModulosControle;
