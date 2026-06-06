import React, { useState, useEffect } from "react";
import {
  FileInput,
  Search,
  Layers,
  Calendar,
  User,
  Trash2,
  X,
  CloudUpload,
  FileSpreadsheet,
  Filter,
} from "lucide-react";
import api from "../../services/api";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";

export default function GestaoAulasView() {
  const [listaDeAulas, setListaDeAulas] = useState([]);
  const [filtroBusca, setFiltroBusca] = useState("");
  const [filtroTurma, setFiltroTurma] = useState("");
  const [filtroAno, setFiltroAno] = useState("2026");
  const [listaTurmas, setListaTurmas] = useState([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const [arrastandoArquivo, setArrastandoArquivo] = useState(false);
  const [carregandoImportacao, setCarregandoImportacao] = useState(false);

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

  const aoArrastarSobre = (e) => {
    e.preventDefault();
    setArrastandoArquivo(true);
  };

  const aoSairDeCima = () => {
    setArrastandoArquivo(false);
  };

  const aoSoltarArquivo = (e) => {
    e.preventDefault();
    setArrastandoArquivo(false);
    validarArquivo(e.dataTransfer.files[0]);
  };

  const aoSelecionarArquivoPorInput = (e) => {
    validarArquivo(e.target.files[0]);
  };

  const validarArquivo = (arquivo) => {
    if (!arquivo) return;
    const extensao = arquivo.name.split(".").pop().toLowerCase();
    if (extensao !== "xlsx" && extensao !== "xls" && extensao !== "csv") {
      alert("Selecione apenas arquivos Excel (.xlsx, .xls) ou .CSV");
      return;
    }
    setArquivoSelecionado(arquivo);
  };

  const processarEnvioExcel = () => {
    if (!arquivoSelecionado) return;
    setCarregandoImportacao(true);
    const formData = new FormData();
    formData.append("file", arquivoSelecionado);

    api
      .post("/aulas/importar-matriz", formData)
      .then(() => {
        alert("Matriz letiva importada com sucesso!");
        setModalAberto(false);
        setArquivoSelecionado(null);
        carregarDados();
      })
      .catch((err) =>
        alert(err.response?.data?.message || "Erro ao processar planilha."),
      )
      .finally(() => setCarregandoImportacao(false));
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
    <div className="flex h-screen bg-slate-50 font-sans antialiased text-slate-600">
      <Sidebar tipoUsuario="secretario" />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header titulo="Matriz Geral de Aulas" icone={Layers} />

        <main className="flex-1 overflow-auto p-8 custom-scroll">
          {/* Seção do Título Alinhado com image_7b0a08.png */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider">
                Quadro Geral de Aulas
              </h2>
            </div>

            <button
              onClick={() => setModalAberto(true)}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-2xl shadow-sm transition-colors flex items-center gap-2 border-0 cursor-pointer"
            >
              <span className="text-base leading-none font-light">+</span>
              <span className="uppercase tracking-wider text-[11px]">
                Novo Ano Letivo
              </span>
            </button>
          </div>

          {/* Filtros Sóbrios com Contador Discreto no canto direito */}
          <div className="flex items-center justify-between mb-4 bg-white p-4 border border-slate-100 rounded-xl">
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

          {/* Tabela Idêntica à Estrutura da image_7b0a08.png */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="bg-slate-50/60 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px]">Nome / Tema</th>
                    <th className="px-6 py-4 text-[10px]">Professor</th>
                    <th className="px-6 py-4 text-[10px]">Vínculo Turma</th>
                    <th className="px-6 py-4 text-[10px]">Data Distribuição</th>
                    <th className="px-6 py-4 text-[10px] text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] text-center">Ações</th>
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

                          {/* Badge Retangular Neutro baseado no da imagem */}
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

                          {/* Bolinha indicativa de Status */}
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span
                              className={`inline-block w-2 h-2 rounded-full ${estaAgendada ? "bg-emerald-400" : "bg-slate-300"}`}
                            ></span>
                          </td>

                          {/* Botão de Ação Circular Discreto igual ao da imagem */}
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <button
                              onClick={() =>
                                deletarAulaTotal(item.aula.id_aula)
                              }
                              className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 bg-white rounded-full cursor-pointer transition-colors"
                              title="Remover permanentemente"
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

      {/* MODAL DE IMPORTAÇÃO NEUTRO */}
      {modalAberto && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={15} className="text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Importar Planilha Matriz
                </h3>
              </div>
              <button
                onClick={() => {
                  setModalAberto(false);
                  setArquivoSelecionado(null);
                }}
                className="w-6 h-6 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg cursor-pointer border-0 transition-colors"
              >
                <X size={12} />
              </button>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Insira o arquivo Excel (.xlsx) para popular a grade cadastral de
                aulas e matérias do ano letivo de forma automatizada.
              </p>

              <div
                onDragOver={aoArrastarSobre}
                onDragLeave={aoSairDeCima}
                onDrop={aoSoltarArquivo}
                className={`border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  arrastandoArquivo
                    ? "border-emerald-500 bg-emerald-50/50 text-emerald-700"
                    : arquivoSelecionado
                      ? "border-slate-400 bg-slate-50 text-slate-800"
                      : "border-slate-200 bg-slate-50/60 text-slate-400 hover:border-slate-300"
                }`}
              >
                {arquivoSelecionado ? (
                  <>
                    <FileSpreadsheet
                      size={30}
                      className="text-slate-600 mb-1"
                    />
                    <span className="text-xs font-bold text-slate-700 block max-w-full truncate px-2">
                      {arquivoSelecionado.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setArquivoSelecionado(null);
                      }}
                      className="mt-2 text-[11px] font-bold text-red-500 border-0 bg-transparent cursor-pointer underline"
                    >
                      Remover arquivo
                    </button>
                  </>
                ) : (
                  <>
                    <CloudUpload size={30} className="mb-1 text-slate-300" />
                    <span className="text-xs font-bold text-slate-600">
                      Arraste a planilha ou
                    </span>
                    <label className="text-xs text-emerald-600 hover:text-emerald-700 font-bold underline cursor-pointer mt-0.5">
                      procure arquivos
                      <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        className="hidden"
                        onChange={aoSelecionarArquivoPorInput}
                      />
                    </label>
                  </>
                )}
              </div>

              <div className="flex gap-2 justify-end mt-6 pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    setModalAberto(false);
                    setArquivoSelecionado(null);
                  }}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-lg cursor-pointer border-0 transition-colors"
                  disabled={carregandoImportacao}
                >
                  Cancelar
                </button>
                <button
                  onClick={processarEnvioExcel}
                  disabled={!arquivoSelecionado || carregandoImportacao}
                  className={`px-4 py-1.5 text-white font-bold text-xs rounded-lg border-0 transition-all ${
                    arquivoSelecionado && !carregandoImportacao
                      ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {carregandoImportacao ? "Processando..." : "Confirmar Carga"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
