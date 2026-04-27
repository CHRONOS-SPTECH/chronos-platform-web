import { ClipboardList } from "lucide-react";
import "../styles/presenca.css";
import Header from "../components/homeSecretario/Header";
import Sidebar from "../components/sidebar/SideBar";
import Profile from "../components/homeSecretario/Profile";
import CardPresenca from "../components/presenca/CardPresenca";

function Presenca() {
  const alunos = [
    { nome: "Daniel Costa", presenca: 80, cpf: "123.456.789-00" },
    { nome: "Emilly Dos Reis", presenca: 95, cpf: "987.654.321-00" },
    { nome: "Nathalii Ribeiro", presenca: 60, cpf: "456.789.123-00" },
    { nome: "Matheus Zorzete", presenca: 100, cpf: "321.654.987-00" },
    { nome: "Fernando Fefe", presenca: 70, cpf: "789.123.456-00" },
    { nome: "Natalia Souza", presenca: 85, cpf: "654.321.987-00" },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <Sidebar
        tipoUsuario="instrutor"
        usuario={{ inicial: "H", nome: "Henrique" }}
      />

      {/* Painel Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header titulo="Registro de Presença" icone={ClipboardList} />

        <main className="flex-1 min-h-0">
          {/* HEADER */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <Profile nome="Henrique" cargo="Instrutor" />

            <div className="w-[210px] bg-gray-50 border-l-4 border-l-green-500 rounded-lg p-3 shadow-sm text-xs leading-relaxed">
              <p>
                <strong>Turma Iniciada:</strong> Janeiro/2026
              </p>
              <p>
                <strong>Previsão:</strong> Setembro/2026
              </p>
            </div>
          </div>

          <div className="px-8 h-full">
            <CardPresenca alunos={alunos} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Presenca;
