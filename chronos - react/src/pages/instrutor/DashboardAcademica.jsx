import { Home, Users } from "lucide-react";

import Header from "../../components/homeSecretario/Header";
import Sidebar from "../../components/sidebar/SideBar";

import StudentsChart from "../../components/charts/StudentsChart";
import AgeChart from "../../components/charts/AgeChart";

function DashboardAcademica() {
  return (
    <div className="flex min-h-screen bg-[#f4f5f7]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="p-6">

          {/* TÍTULO */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Home size={18} />

              <h2 className="text-2xl font-semibold text-gray-800">
                Dashboard’s
              </h2>
            </div>

            <span className="text-sm text-gray-500">
              Dom, 22 de março de 2026
            </span>
          </div>

          {/* TABS */}
          <div className="flex gap-3 mb-7">
            <button className="bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold">
              Panorama Acadêmico
            </button>

            <button className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold">
              Engajamento de Atividade
            </button>
          </div>

          {/* CARDS SUPERIORES */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">

            {/* CARD 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">

              <span className="text-xs font-bold text-gray-500">
                COMUNIDADE ACADÊMICA
              </span>

              <div className="flex items-end gap-3 mt-5">
                <h1 className="text-6xl font-bold text-green-700">
                  1.042
                </h1>

                <p className="text-gray-500 mb-2">
                  Pessoas
                </p>
              </div>

              <div className="flex justify-between mt-6">

                <div className="flex flex-col">
                  <strong className="text-gray-800">
                    504
                  </strong>

                  <span className="text-xs text-gray-500">
                    Membros
                  </span>
                </div>

                <div className="flex flex-col">
                  <strong className="text-gray-800">
                    300
                  </strong>

                  <span className="text-xs text-gray-500">
                    Provacionistas
                  </span>
                </div>

                <div className="flex flex-col">
                  <strong className="text-gray-800">
                    200
                  </strong>

                  <span className="text-xs text-gray-500">
                    Público Externo
                  </span>
                </div>

              </div>

              <div className="w-full h-2 bg-green-700 rounded-full mt-6"></div>

            </div>

            {/* CARD 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">

              <span className="text-xs font-bold text-gray-500">
                CAPACIDADE PEDAGÓGICA
              </span>

              <div className="flex items-center gap-5 mt-10">

                <div className="w-16 h-16 rounded-full bg-green-700 flex items-center justify-center text-white text-2xl font-bold">
                  L
                </div>

                <div>
                  <h1 className="text-6xl font-bold text-green-700">
                    18
                  </h1>

                  <p className="text-gray-500">
                    Instrutores
                  </p>
                </div>

              </div>

            </div>

            {/* CARD 3 */}
            <div className="bg-green-700 rounded-2xl p-6 shadow-sm text-white">

              <span className="text-xs font-bold">
                ENGAJAMENTO VOLUNTÁRIO
              </span>

              <div className="flex justify-between items-center mt-6">

                <div>
                  <h1 className="text-6xl font-bold">
                    501
                  </h1>

                  <p className="text-sm">
                    Membros Ativos
                  </p>
                </div>

                <div className="text-right">
                  <h2 className="text-4xl font-bold">
                    78%
                  </h2>

                  <span className="text-xs">
                    Do quadro de membros
                  </span>
                </div>

              </div>

              <div className="w-full h-2 bg-white rounded-full mt-8"></div>

            </div>

          </div>

          {/* PARTE INFERIOR */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.8fr_1.3fr] gap-5">

            {/* GRÁFICO */}
            {/* <StudentsChart /> */}

            {/* CARD CENTRAL */}
            <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[450px]">

              <h3 className="text-sm font-bold text-gray-700 mb-2">
                INCLUSÃO
              </h3>

              <p className="text-sm text-gray-500 mb-8">
                Distribuição por autodeclaração de gênero na base
              </p>

              {/* ITEM */}
              <div className="flex items-center gap-4 mb-8">

                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-700">
                  <Users size={18} />
                </div>

                <div>
                  <h1 className="text-4xl font-bold text-gray-800">
                    562
                  </h1>

                  <p className="text-gray-500">
                    Mulheres
                  </p>
                </div>

              </div>

              {/* ITEM */}
              <div className="flex items-center gap-4 mb-8">

                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
                  <Users size={18} />
                </div>

                <div>
                  <h1 className="text-4xl font-bold text-gray-800">
                    468
                  </h1>

                  <p className="text-gray-500">
                    Homens
                  </p>
                </div>

              </div>

              {/* ITEM */}
              <div className="flex items-center gap-4 mb-8">

                <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-700">
                  <Users size={18} />
                </div>

                <div>
                  <h1 className="text-4xl font-bold text-gray-800">
                    12
                  </h1>

                  <p className="text-gray-500">
                    Outros
                  </p>
                </div>

              </div>

              {/* BOX */}
              <div className="bg-green-50 rounded-2xl p-4 flex gap-4 mt-10">

                <div className="w-3 h-3 rounded-full bg-green-700 mt-2"></div>

                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-2">
                    EQUILÍBRIO DE GÊNERO
                  </h4>

                  <p className="text-sm text-gray-600 leading-6">
                    Mantém uma distribuição equilibrada feminina de 52%,
                    refletindo um crescimento contínuo da força matriculada.
                  </p>
                </div>

              </div>

            </div>

            {/* GRÁFICO DIREITO */}
            {/* <AgeChart /> */}

          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAcademica;