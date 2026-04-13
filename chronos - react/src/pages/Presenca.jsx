import "../styles/presenca.css";
import Header from "../components/presenca/Header";
import Sidebar from "../components/presenca/Sidebar";
import CardPresenca from "../components/presenca/CardPresenca";

function Presenca() {

  const alunos = [
    { nome: "Natalia", presenca: 80, cpf: "123.456.789-00" },
    { nome: "Emilly", presenca: 95, cpf: "987.654.321-00" },
    { nome: "Daniel", presenca: 60, cpf: "456.789.123-00" },
    { nome: "Fernando", presenca: 100, cpf: "321.654.987-00" },
    { nome: "Zozo", presenca: 70, cpf: "789.123.456-00" },
    { nome: "Natally", presenca: 85, cpf: "654.321.987-00" },
  ];

  return (
   <div className="layout">
  <Sidebar />

  <main className="main">
    <Header />
    <CardPresenca alunos={alunos} />
  </main>
</div>

  );
}

export default Presenca;