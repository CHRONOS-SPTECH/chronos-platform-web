{/* PARTE INFERIOR */}
<div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-4">

  {/* ✅ CARD 1 — ALUNOS */}
  <div className="bg-white rounded-xl p-4 shadow flex flex-col h-[320px]">

    <h3 className="text-sm font-bold text-gray-700 mb-3">
      ALUNOS POR NÍVEL
    </h3>

    {/* CONTROLE DE ALTURA */}
    <div className="flex-1 overflow-hidden">
      <StudentsChart />
    </div>

  </div>

  {/* ✅ CARD 2 — INCLUSÃO + FAIXA */}
  <div className="bg-white rounded-xl p-4 shadow flex flex-col h-[320px]">

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">

      {/* INCLUSÃO */}
      <div className="flex flex-col justify-between">

        <div>
          <h3 className="text-xs font-bold text-gray-700 mb-1">
            INCLUSÃO
          </h3>

          <p className="text-xs text-gray-500 mb-4">
            Distribuição por gênero
          </p>
        </div>

        <div className="space-y-3">

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center text-green-700">
              <Users size={13} />
            </div>

            <div>
              <h1 className="text-lg font-bold">562</h1>
              <p className="text-[11px] text-gray-500">Mulheres</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-50 rounded-md flex items-center justify-center text-green-600">
              <Users size={13} />
            </div>

            <div>
              <h1 className="text-lg font-bold">468</h1>
              <p className="text-[11px] text-gray-500">Homens</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-100 rounded-md flex items-center justify-center text-cyan-700">
              <Users size={13} />
            </div>

            <div>
              <h1 className="text-lg font-bold">12</h1>
              <p className="text-[11px] text-gray-500">Outros</p>
            </div>
          </div>

        </div>

      </div>

      {/* FAIXAS ETÁRIAS */}
      <div className="flex flex-col">

        <h3 className="text-xs font-bold text-gray-700 mb-1">
          FAIXAS ETÁRIAS
        </h3>

        <p className="text-xs text-gray-500 mb-2">
          Volume por idade
        </p>

        <div className="flex-1 overflow-hidden">
          <AgeChart />
        </div>

      </div>

    </div>

  </div>

</div>