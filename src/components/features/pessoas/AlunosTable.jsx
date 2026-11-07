import Eye from "lucide-react/icons/eye";
import Pencil from "lucide-react/icons/pencil";
import Trash2 from "lucide-react/icons/trash-2";
import Camera from "lucide-react/icons/camera";

const badgeVinculo = {
  Membro: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Provacionista: "border-amber-200 bg-amber-50 text-amber-700",
  "Membro Força Viva": "border-blue-200 bg-blue-50 text-blue-700",
};

function Cabecalho({ children, className = "" }) {
  return <th className={`sticky top-0 z-10 whitespace-nowrap bg-slate-900 px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-100 ${className}`}>{children}</th>;
}

function BotaoAcao({ rotulo, titulo, onClick, children, className = "" }) {
  return <button type="button" onClick={onClick} aria-label={rotulo} title={titulo} className={`rounded-xl border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 ${className}`}>{children}</button>;
}

function AcoesAluno({ aluno, onDetalhes, onEditar, onBiometria, onInativar }) {
  const { pessoa, nome } = aluno;
  const fotoPendente = !pessoa.url_foto_perfil;
  return <div className="flex justify-end gap-1">
    <BotaoAcao rotulo={`Visualizar ${nome}`} titulo="Ver ficha completa" onClick={() => onDetalhes(pessoa)}><Eye size={14} /></BotaoAcao>
    <BotaoAcao rotulo={`Editar ${nome}`} titulo="Editar dados" onClick={() => onEditar(pessoa)}><Pencil size={14} /></BotaoAcao>
    <BotaoAcao rotulo={`${fotoPendente ? "Cadastrar foto" : "Atualizar foto"} de ${nome}`} titulo={fotoPendente ? "Foto pendente — abrir câmera" : "Foto cadastrada — atualizar foto"} onClick={() => onBiometria(pessoa)} className={fotoPendente ? "border-amber-400 bg-amber-100 text-amber-900 ring-2 ring-amber-200 hover:bg-amber-200 hover:text-amber-950" : "border-emerald-200 bg-emerald-50 text-emerald-700"}><Camera size={16} /></BotaoAcao>
    <BotaoAcao rotulo={`Inativar ${nome}`} titulo="Inativar cadastro" onClick={() => onInativar(aluno.id, nome)} className="hover:border-red-200 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></BotaoAcao>
  </div>;
}

function AcoesPublico({ pessoa, onDetalhes, onEditar, onInativar }) {
  return <div className="flex justify-end gap-1.5">
    <BotaoAcao rotulo={`Visualizar ${pessoa.nome}`} titulo="Ver ficha completa" onClick={() => onDetalhes(pessoa.raw)}><Eye size={14} /></BotaoAcao>
    <BotaoAcao rotulo={`Editar ${pessoa.nome}`} titulo="Editar dados" onClick={() => onEditar(pessoa.raw)}><Pencil size={14} /></BotaoAcao>
    <BotaoAcao rotulo={`Inativar ${pessoa.nome}`} titulo="Inativar cadastro" onClick={() => onInativar(pessoa.id, pessoa.nome)} className="hover:border-red-200 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></BotaoAcao>
  </div>;
}

export function AlunosTable({ alunos, mensagemVazia, onDetalhes, onEditar, onBiometria, onInativar }) {
  return <table className="w-[1400px] table-fixed border-collapse text-left">
    <thead><tr className="bg-slate-900">
      <Cabecalho className="w-[18%]">Aluno</Cabecalho><Cabecalho className="w-[11%]">Vínculo</Cabecalho><Cabecalho className="w-[20%]">Turmas e presença</Cabecalho><Cabecalho className="w-[9%]">Nascimento</Cabecalho><Cabecalho className="w-[8%]">Bolsista</Cabecalho><Cabecalho className="w-[9%]">Data de membro</Cabecalho><Cabecalho className="w-[13%]">Ingresso e saída</Cabecalho><Cabecalho className="w-[12%] text-right">Ações</Cabecalho>
    </tr></thead>
    <tbody className="divide-y divide-slate-100">{alunos.length === 0 ? <tr><td colSpan={8} className="p-10 text-center text-sm text-slate-500">{mensagemVazia}</td></tr> : alunos.map((aluno) => <tr key={aluno.id} className="group odd:bg-white even:bg-slate-50/70 transition-colors hover:bg-emerald-50/70">
      <td className="p-4"><div className="flex min-w-0 items-center gap-3"><span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-xs font-black text-slate-700 ring-1 ring-slate-200">{aluno.pessoa.url_foto_perfil ? <img src={aluno.pessoa.url_foto_perfil} alt="" className="h-full w-full object-cover" /> : aluno.nome.slice(0, 1).toUpperCase()}</span><div className="min-w-0"><p className="truncate font-bold text-sm text-slate-800" title={aluno.nome}>{aluno.nome}</p><p className="mt-1 truncate text-xs text-slate-500" title={aluno.email}>{aluno.email}</p></div></div></td>
      <td className="p-4"><span className={`block max-w-full truncate rounded-md border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${badgeVinculo[aluno.vinculo] || "border-slate-200 bg-slate-50 text-slate-600"}`} title={aluno.vinculo}>{aluno.vinculo}</span></td>
      <td className="p-4"><div className="flex min-w-0 flex-col gap-1.5">{aluno.turmasAtuais.length ? aluno.turmasAtuais.map((turma) => <span key={turma.id_turma} title={turma.nome_turma} className="max-w-full truncate rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-800">{turma.nome_turma}</span>) : <span className="truncate text-xs text-slate-400">Sem turma em andamento</span>}<div className="flex min-w-0 items-center gap-2" title="Percentual de presença"><div className="h-2 max-w-32 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-[width]" style={{ width: `${Math.max(0, Math.min(100, aluno.percentualPresenca ?? 0))}%` }} /></div><span className="shrink-0 text-xs font-black text-slate-700">{aluno.percentualPresenca == null ? "—" : `${aluno.percentualPresenca}%`}</span></div></div></td>
      <td className="truncate p-4 text-xs text-slate-600" title={aluno.dataNascimento || "Não informada"}>{aluno.dataNascimento || "Não informada"}</td>
      <td className="p-4"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ${aluno.bolsista ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>{aluno.bolsista ? "Sim" : "Não"}</span></td>
      <td className="truncate p-4 text-xs text-slate-600" title={aluno.dataMembro || "Não informado"}>{aluno.dataMembro || "Não informado"}</td>
      <td className="p-4 text-xs text-slate-600"><span className="block truncate" title={`Ingresso: ${aluno.dataIngresso || "Não informado"}`}>Ingresso: {aluno.dataIngresso || "Não informado"}</span><span className="mt-1 block truncate" title={`Saída: ${aluno.dataSaida || "Não informada"}`}>Saída: {aluno.dataSaida || "Não informada"}</span></td>
      <td className="min-w-44 p-4"><AcoesAluno aluno={aluno} onDetalhes={onDetalhes} onEditar={onEditar} onBiometria={onBiometria} onInativar={onInativar} /></td>
    </tr>)}</tbody>
  </table>;
}

export function PublicoExternoTable({ pessoas, mensagemVazia, onDetalhes, onEditar, onInativar }) {
  return <table className="w-full min-w-[1200px] table-fixed border-collapse text-left">
    <thead><tr className="bg-slate-900"><Cabecalho className="w-[20%]">Pessoa</Cabecalho><Cabecalho className="w-[23%]">E-mail</Cabecalho><Cabecalho className="w-[15%]">Telefone</Cabecalho><Cabecalho className="w-[15%]">CPF</Cabecalho><Cabecalho className="w-[15%]">Vínculo</Cabecalho><Cabecalho className="w-[12%] text-right">Ações</Cabecalho></tr></thead>
    <tbody className="divide-y divide-slate-100">{pessoas.length === 0 ? <tr><td colSpan={6} className="p-10 text-center text-sm text-slate-500">{mensagemVazia}</td></tr> : pessoas.map((pessoa) => <tr key={pessoa.id} className="group odd:bg-white even:bg-slate-50/70 transition-colors hover:bg-blue-50/60">
      <td className="p-4"><div className="flex min-w-0 items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-black text-slate-700 ring-1 ring-slate-200">{pessoa.nome.slice(0, 1).toUpperCase()}</span><span className="truncate text-sm font-bold text-slate-800" title={pessoa.nome}>{pessoa.nome}</span></div></td><td className="truncate p-4 text-xs font-semibold text-slate-700" title={pessoa.email}>{pessoa.email}</td><td className="truncate p-4 text-xs text-slate-600" title={pessoa.telefone}>{pessoa.telefone}</td><td className="truncate p-4 font-mono text-[11px] text-slate-500" title={pessoa.cpf}>{pessoa.cpf}</td><td className="truncate p-4" title={pessoa.tipoVinculoNome}><span className="whitespace-nowrap rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700">{pessoa.tipoVinculoNome}</span></td><td className="p-4"><AcoesPublico pessoa={pessoa} onDetalhes={onDetalhes} onEditar={onEditar} onInativar={onInativar} /></td>
    </tr>)}</tbody>
  </table>;
}
