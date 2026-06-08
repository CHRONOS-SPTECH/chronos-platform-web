import React, { useState, useEffect } from "react";
import { Search, Layers, Trash2 } from "lucide-react";
import api from "../../services/api";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import ModalCargaLetiva from "../../components/gestaoAulas/modalAulas";

export default function GestaoAulasView() {
  const [listaDeAulas, setListaDeAulas] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);

  const [filtroBusca, setFiltroBusca] = useState("");
  const [filtroTurma, setFiltroTurma] = useState("");
  const [filtroAno, setFiltroAno] = useState("2026");

  // Estados gerenciadores do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [relatorioResult, setRelatorioResult] = useState(null);

  const carregarDados = () => {
    api
      .get("/aulas/detalhadas")
      .then((res) => setListaDeAulas(res.data))
      .catch((err) => console.error("Erro ao buscar aulas:", err));

    api
      .get("/turmas")
      .then((res) => setListaTurmas(res.data))
      .catch((err) => console.error("Erro ao buscar turmas:", err));
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const aoSelecionarArquivo = (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    const extensao = arquivo.name.split(".").pop().toLowerCase();
    if (extensao !== "xlsx" && extensao !== "xls") {
      alert("Selecione apenas arquivos Excel (.xlsx, .xls)");
      return;
    }
    setArquivoSelecionado(arquivo);
  };

  const processarEnvioExcel = () => {
    if (!arquivoSelecionado) return;

    setCarregando(true);
    const formData = new FormData();
    formData.append("file", arquivoSelecionado);

    api
      .post("/aulas/importar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setRelatorioResult(res.data);
        carregarDados();
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Erro ao processar planilha.");
      })
      .finally(() => setCarregando(false));
  };

  const fecharModalLimpo = () => {
    setModalAberto(false);
    setArquivoSelecionado(null);
    setRelatorioResult(null);
  };

  const deletarAulaTotal = (idAula) => {
    if (!confirm("Deseja deletar esta aula da matriz permanentemente?")) return;
    api
      .delete(`/aulas/${idAula}`)
      .then(() => carregarDados())
      .catch(() => alert("Erro ao deletar registro."));
  };

  const aulasFiltradas = listaDeAulas.filter((item) => {
    if (!item.aula) return false;
    const termo = filtroBusca.toLowerCase();
    const bateTexto =
      item.tema.titulo_tema.toLowerCase().includes(termo) ||
      item.instrutor.nome.toLowerCase().includes(termo);
    const bateTurma =
      filtroTurma === "" || item.aula.id_turma.toString() === filtroTurma;
    const anoDaAula = item.aula.data_aula
      ? item.aula.data_aula.substring(0, 4)
      : "2026";

    return (
      bateTexto && bateTurma && (filtroAno === "" || anoDaAula === filtroAno)
    );
  });

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased text-slate-600 overflow-hidden">
      <Sidebar />

      {/* h-screen e overflow-hidden aqui garantem que o layout principal nunca role a janela do navegador */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header titulo="Matriz Geral de Aulas" icone={Layers} />

        <main className="flex-1 flex flex-col p-8 overflow-hidden">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <div>
              <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider">
                Quadro Geral de Aulas
              </h2>
            </div>

            <button
              onClick={() => setModalAberto(true)}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-2xl shadow-sm transition-colors flex items-center gap-2 border-0 cursor-pointer"
            >
              <span className="uppercase tracking-wider text-[11px]">
                Importar Carga de Aulas
              </span>
            </button>
          </div>

          {/* Filtros */}
          <div className="flex items-center justify-between mb-4 bg-white p-4 border border-slate-100 rounded-xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center bg-slate-50 rounded-lg border border-slate-200 px-3 transition-all focus-within:bg-white focus-within:border-slate-300">
                <Search size={14} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar tema ou professor..."
                  value={filtroBusca}
                  onChange={(e) => setFiltroBusca(e.target.value)}
                  className="text-xs py-2 border-0 bg-transparent text-slate-700 focus:outline-none pl-2 font-medium w-56"
                />
              </div>

              <div className="bg-slate-50 rounded-lg border border-slate-200 px-2">
                <select
                  value={filtroTurma}
                  onChange={(e) => setFiltroTurma(e.target.value)}
                  className="text-xs py-2 border-0 bg-transparent text-slate-600 focus:outline-none font-bold cursor-pointer"
                >
                  <option value="">Todas as Turmas</option>
                  {listaTurmas.map((t) => (
                    <option key={t.id_turma} value={t.id_turma.toString()}>
                      {t.nome_turma}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-50 rounded-lg border border-slate-200 px-2">
                <select
                  value={filtroAno}
                  onChange={(e) => setFiltroAno(e.target.value)}
                  className="text-xs py-2 border-0 bg-transparent text-slate-600 focus:outline-none font-bold cursor-pointer"
                >
                  <option value="2026">Ano: 2026</option>
                  <option value="2027">Ano: 2027</option>
                  <option value="2028">Ano: 2028</option>
                </select>
              </div>
            </div>

            <div className="text-[11px] font-bold text-slate-400">
              {aulasFiltradas.length} aulas cadastradas
            </div>
          </div>

          {/* TABELA PRINCIPAL DINÂMICA COM ALTURA MÁXIMA E SCROLL ISOLADO */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex-1 overflow-hidden flex flex-col">
            <div className="overflow-y-auto flex-1 custom-scroll max-h-[calc(100vh-280px)]">
              <table className="w-full border-collapse text-left text-xs">
                {/* Cabeçalho FIXO no topo via sticky */}
                <thead className="bg-slate-50 text-slate-400 uppercase font-bold tracking-wider sticky top-0 z-10 shadow-xs border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] bg-slate-50">
                      Nome / Tema
                    </th>
                    <th className="px-6 py-4 text-[10px] bg-slate-50">
                      Professor
                    </th>
                    <th className="px-6 py-4 text-[10px] bg-slate-50">
                      Vínculo Turma
                    </th>
                    <th className="px-6 py-4 text-[10px] bg-slate-50">
                      Data Distribuição
                    </th>
                    <th className="px-6 py-4 text-[10px] text-center bg-slate-50">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] text-center bg-slate-50">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100/70 text-slate-500 font-medium">
                  {aulasFiltradas.length > 0 ? (
                    aulasFiltradas.map((item) => {
                      const estaAgendada = !!item.aula.data_aula;
                      return (
                        <tr
                          key={item.aula.id_aula}
                          className="hover:bg-slate-50/40 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800 text-sm">
                              {item.tema.titulo_tema}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-700 text-sm font-semibold">
                            {item.instrutor.nome}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-block bg-emerald-50 text-emerald-600 border border-emerald-100 font-extrabold px-3 py-1 rounded text-[10px] uppercase tracking-wide">
                              {item.turma?.nome_turma ||
                                `TURMA ${item.aula.id_turma}`}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {estaAgendada
                              ? item.aula.data_aula
                                  .split("T")[0]
                                  .split("-")
                                  .reverse()
                                  .join("/")
                              : "--/--/----"}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span
                              className={`inline-block w-2 h-2 rounded-full ${estaAgendada ? "bg-emerald-400" : "bg-slate-300"}`}
                            ></span>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <button
                              onClick={() =>
                                deletarAulaTotal(item.aula.id_aula)
                              }
                              className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 bg-white rounded-full cursor-pointer transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-slate-400 bg-white"
                      >
                        Nenhuma aula encontrada para os parâmetros selecionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Componentizado */}
      <ModalCargaLetiva
        isOpen={modalAberto}
        onClose={fecharModalLimpo}
        arquivo={arquivoSelecionado}
        onSelecionarArquivo={aoSelecionarArquivo}
        onLimparArquivo={() => setArquivoSelecionado(null)}
        onConfirmar={processarEnvioExcel}
        carregando={carregando}
        relatorio={relatorioResult}
      />
    </div>
  );
}
