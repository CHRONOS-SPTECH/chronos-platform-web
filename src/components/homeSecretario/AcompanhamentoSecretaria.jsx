import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ClipboardCheck,
  ListTodo,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import aulaService from "../../services/aulaService";

const dataLocalISO = (data) => {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

const dataDaAula = (item) => item?.aula?.data_aula?.split("T")[0] || "";
const chamadaFeita = (item) => Boolean(item?.chamadaFeita ?? item?.aula?.chamadaFeita);
const horaDaAula = (item) => String(item?.aula?.hora_inicio || "").slice(0, 5);
const tituloAula = (item) => item?.tema?.titulo_tema || "Aula";
const turmaAula = (item) => item?.turma?.nome_turma || "Turma não informada";
const instrutorAula = (item) => item?.instrutor?.nome || "Instrutor não alocado";

function AulaLinha({ item, hoje, pendencia, abrirCronograma }) {
  const data = dataDaAula(item);
  const horario = data === hoje ? horaDaAula(item) || "Hoje" : data
    ? new Date(`${data}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    : "Sem data";

  return (
    <button onClick={abrirCronograma} className="flex w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 text-left transition hover:border-green-200 hover:bg-green-50/30">
      <span className={`shrink-0 rounded-lg p-2 ${pendencia ? "bg-amber-50 text-amber-600" : "bg-green-50 text-[#1E7A3C]"}`}>
        {pendencia ? <AlertCircle size={15} /> : <CalendarDays size={15} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-bold text-slate-800">{turmaAula(item)} <span className="font-medium text-slate-400">· {tituloAula(item)}</span></span>
        <span className="block truncate text-[10px] text-slate-500">{instrutorAula(item)}{pendencia ? ` · ${pendencia}` : ""}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1 text-[10px] font-bold text-slate-500"><Clock3 size={12} />{horario}</span>
      <ArrowRight size={14} className="shrink-0 text-slate-300" />
    </button>
  );
}

function Indicador({ titulo, valor, detalhe, icone: Icone, cor }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-100 bg-white px-3 py-2.5">
      <div className={`rounded-lg bg-slate-50 p-2 ${cor}`}><Icone size={16} /></div>
      <div className="min-w-0"><p className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-400">{titulo}</p><p className="text-base font-black leading-tight text-slate-800">{valor}<span className="ml-1 text-[10px] font-medium text-slate-400">{detalhe}</span></p></div>
    </div>
  );
}

export default function AcompanhamentoSecretaria() {
  const navigate = useNavigate();
  const [aulas, setAulas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const hoje = dataLocalISO(new Date());

  useEffect(() => {
    let ativo = true;
    aulaService.listarAulasDetalhadas()
      .then((resultado) => { if (ativo) setAulas(Array.isArray(resultado) ? resultado.filter((item) => item?.aula) : []); })
      .catch((error) => { console.error("Erro ao carregar acompanhamento da secretaria:", error); if (ativo) setErro(true); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []);

  const dados = useMemo(() => {
    const ordenadas = [...aulas].sort((a, b) => `${dataDaAula(a)} ${horaDaAula(a)}`.localeCompare(`${dataDaAula(b)} ${horaDaAula(b)}`));
    const hojeAulas = ordenadas.filter((item) => dataDaAula(item) === hoje);
    const semData = ordenadas.filter((item) => !dataDaAula(item));
    const chamadasPendentes = ordenadas.filter((item) => dataDaAula(item) && dataDaAula(item) <= hoje && !chamadaFeita(item));
    const proximaAula = ordenadas.find((item) => dataDaAula(item) > hoje) || null;
    const pendencias = [
      ...semData.map((item) => ({ item, tipo: "Sem agendamento" })),
      ...chamadasPendentes.map((item) => ({ item, tipo: "Chamada pendente" })),
    ];
    return { hojeAulas, semData, chamadasPendentes, proximaAula, pendencias };
  }, [aulas, hoje]);

  const abrirCronograma = () => navigate("/cronograma");
  const totalHoje = dados.hojeAulas.length;
  const totalPendencias = dados.semData.length + dados.chamadasPendentes.length;
  const totalAtencaoExibido = Math.min(3, dados.pendencias.length);

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/70 p-4 shadow-sm">
      <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Resumo do dia</p><h2 className="truncate text-base font-black text-slate-800">Acompanhamento das aulas</h2></div>
        <button onClick={abrirCronograma} className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-2 text-[11px] font-bold text-[#1E7A3C] transition hover:bg-green-50">Cronograma <ArrowRight size={13} /></button>
      </div>

      {carregando ? (
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-2"><div className="animate-pulse rounded-xl bg-slate-200" /><div className="animate-pulse rounded-xl bg-slate-200" /><div className="animate-pulse rounded-xl bg-slate-200" /></div>
      ) : erro ? (
        <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-4 text-center text-xs text-slate-500">Não foi possível carregar as aulas. Consulte o cronograma para tentar novamente.</div>
      ) : <>
        <div className="mb-3 grid shrink-0 grid-cols-3 gap-2">
          <Indicador titulo="Agenda" valor={totalHoje} detalhe="hoje" icone={CalendarDays} cor="text-[#1E7A3C]" />
          <Indicador titulo="Sem data" valor={dados.semData.length} detalhe="aulas" icone={ListTodo} cor="text-amber-500" />
          <Indicador titulo="Presença" valor={dados.chamadasPendentes.length} detalhe="pendente" icone={ClipboardCheck} cor="text-blue-500" />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-2">
          <section className="flex min-h-0 flex-col rounded-2xl border border-slate-100 bg-white p-3">
            <div className="mb-2 flex shrink-0 items-center justify-between"><h3 className="text-[11px] font-black uppercase tracking-wider text-slate-500">Aulas de hoje</h3><span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-[#1E7A3C]">{totalHoje}</span></div>
            <div className="min-h-0 space-y-1.5">
              {dados.hojeAulas.length ? dados.hojeAulas.slice(0, 3).map((item) => <AulaLinha key={item.aula.id_aula} item={item} hoje={hoje} abrirCronograma={abrirCronograma} />) : <p className="rounded-xl bg-slate-50 px-3 py-4 text-center text-xs text-slate-500">Nenhuma aula agendada para hoje.</p>}
              {totalHoje > 3 && <button onClick={abrirCronograma} className="w-full py-1 text-[10px] font-bold text-[#1E7A3C]">+ {totalHoje - 3} aulas no cronograma</button>}
            </div>
            {dados.proximaAula && <div className="mt-auto flex shrink-0 items-center gap-2 border-t border-slate-100 pt-2 text-[10px] text-slate-500"><Clock3 size={13} className="text-[#1E7A3C]" /><span className="truncate"><strong className="text-slate-700">Próxima:</strong> {turmaAula(dados.proximaAula)} · {new Date(`${dataDaAula(dados.proximaAula)}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} {horaDaAula(dados.proximaAula)}</span></div>}
          </section>

          <section className="flex min-h-0 flex-col rounded-2xl border border-slate-100 bg-white p-3">
            <div className="mb-2 flex shrink-0 items-center justify-between"><h3 className="text-[11px] font-black uppercase tracking-wider text-slate-500">Pontos de atenção</h3><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${totalPendencias ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>{totalPendencias}</span></div>
            {totalPendencias === 0 ? <div className="flex min-h-0 flex-1 items-center justify-center gap-2 rounded-xl bg-green-50/70 px-3 text-center text-xs font-medium text-green-800"><CheckCircle2 size={16} />Tudo em dia, sem chamadas pendentes.</div> : <div className="min-h-0 space-y-1.5">
              {dados.pendencias.slice(0, 3).map(({ item, tipo }) => <AulaLinha key={`${tipo}-${item.aula.id_aula}`} item={item} hoje={hoje} pendencia={tipo} abrirCronograma={abrirCronograma} />)}
              {dados.pendencias.length > totalAtencaoExibido && <button onClick={abrirCronograma} className="w-full py-1 text-[10px] font-bold text-[#1E7A3C]">+ {dados.pendencias.length - totalAtencaoExibido} pendências no cronograma</button>}
            </div>}
          </section>
        </div>
      </>}
    </section>
  );
}
