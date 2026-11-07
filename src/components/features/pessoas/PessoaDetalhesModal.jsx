import X from "lucide-react/icons/x";
import UserRound from "lucide-react/icons/user-round";
import MapPin from "lucide-react/icons/map-pin";
import GraduationCap from "lucide-react/icons/graduation-cap";
import Fingerprint from "lucide-react/icons/fingerprint";
import { formatarCPF, formatarDataBr } from "../../../utils/DateUtils";

const valor = (item) => item === null || item === undefined || item === "" ? "Não informado" : item;

function Secao({ titulo, icone: Icone, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
        <Icone size={16} className="text-emerald-700" /> {titulo}
      </h3>
      {children}
    </section>
  );
}

function Campo({ titulo, conteudo }) {
  return <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{titulo}</p><p className="mt-1 break-words text-sm font-semibold text-slate-800">{valor(conteudo)}</p></div>;
}

export default function PessoaDetalhesModal({ pessoa, carregando, onClose }) {
  if (!carregando && !pessoa) return null;
  const vinculoNormalizado = String(pessoa?.vinculo?.nome_vinculo || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const publicoExterno = vinculoNormalizado === "publico externo";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="pessoa-detalhes-titulo" className="flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/60 bg-slate-50 shadow-2xl">
        <header className="flex shrink-0 items-start justify-between bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 px-6 py-5 text-white sm:px-8">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">Ficha completa</p>
            <h2 id="pessoa-detalhes-titulo" className="mt-1 truncate text-xl font-black sm:text-2xl">{carregando ? "Carregando cadastro" : valor(pessoa?.nome)}</h2>
            <p className="mt-1 text-sm text-slate-300">{carregando ? "Buscando dados detalhados..." : valor(pessoa?.vinculo?.nome_vinculo)}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar detalhes" className="ml-4 rounded-xl border border-white/15 p-2 text-slate-200 transition hover:bg-white/10"><X size={18} /></button>
        </header>

        {carregando ? <div className="flex min-h-64 items-center justify-center text-sm font-semibold text-slate-500">Carregando detalhes...</div> : (
          <div className="custom-scrollbar min-h-0 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-6">
            {publicoExterno && <div className="flex gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-950">
              <span className="mt-0.5 rounded-lg bg-white p-2 text-blue-700"><UserRound size={17} /></span>
              <div><p className="text-sm font-bold">Cadastro de Público Externo</p><p className="mt-1 text-xs leading-5 text-blue-800">Este perfil participa como público externo. Informações de turmas, frequência e histórico acadêmico são próprias do cadastro de aluno e podem não estar disponíveis aqui.</p></div>
            </div>}
            <div className={`grid gap-4 ${publicoExterno ? "lg:grid-cols-1" : "lg:grid-cols-2"}`}>
              <Secao titulo="Dados pessoais e contato" icone={UserRound}>
                <div className={`grid gap-x-6 gap-y-4 sm:grid-cols-2 ${publicoExterno ? "xl:grid-cols-5" : ""}`}>
                  <Campo titulo="E-mail" conteudo={pessoa.email} />
                  <Campo titulo="Telefone" conteudo={pessoa.telefone} />
                  <Campo titulo="CPF" conteudo={pessoa.cpf ? formatarCPF(pessoa.cpf) : null} />
                  <Campo titulo="Gênero" conteudo={pessoa.genero} />
                  <Campo titulo="Nascimento" conteudo={formatarDataBr(pessoa.data_nascimento)} />
                  <Campo titulo="Bolsista" conteudo={pessoa.bolsista == null ? null : pessoa.bolsista ? "Sim" : "Não"} />
                  <Campo titulo="Vínculo" conteudo={pessoa.vinculo?.nome_vinculo} />
                  <Campo titulo="Ingresso" conteudo={formatarDataBr(pessoa.data_ingresso)} />
                  <Campo titulo="Data de membro" conteudo={formatarDataBr(pessoa.data_membro)} />
                  <Campo titulo="Data de saída" conteudo={formatarDataBr(pessoa.data_saida)} />
                </div>
              </Secao>

              <div className="space-y-4">
                <Secao titulo="Endereço" icone={MapPin}>
                  {pessoa.endereco ? <div className={`grid gap-4 sm:grid-cols-2 ${publicoExterno ? "xl:grid-cols-5" : ""}`}>
                    <Campo titulo="CEP" conteudo={pessoa.endereco.cep} />
                    <Campo titulo="Logradouro" conteudo={[pessoa.endereco.logradouro, pessoa.endereco.numero].filter(Boolean).join(", ")} />
                    <Campo titulo="Complemento" conteudo={pessoa.endereco.complemento} />
                    <Campo titulo="Bairro" conteudo={pessoa.endereco.bairro} />
                    <Campo titulo="Cidade / UF" conteudo={[pessoa.endereco.cidade, pessoa.endereco.uf].filter(Boolean).join(" / ")} />
                  </div> : <p className="text-sm text-slate-500">Endereço não informado.</p>}
                </Secao>
                {!publicoExterno && <Secao titulo="Biometria" icone={Fingerprint}>
                  <p className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${pessoa.possui_biometria === true ? "bg-emerald-50 text-emerald-700" : pessoa.possui_biometria === false ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
                    <span className={`size-2 rounded-full ${pessoa.possui_biometria === true ? "bg-emerald-500" : pessoa.possui_biometria === false ? "bg-amber-500" : "bg-slate-400"}`} />
                    {pessoa.possui_biometria === true ? "Biometria cadastrada" : pessoa.possui_biometria === false ? "Biometria pendente" : "Não foi possível verificar"}
                  </p>
                </Secao>}
              </div>
            </div>

            {!publicoExterno && <Secao titulo="Turmas e frequência" icone={GraduationCap}>
              {pessoa.turmas?.length ? <div className="grid gap-3 md:grid-cols-2">
                {pessoa.turmas.map((turma) => <article key={`${turma.id_turma}-${turma.data_matricula}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3"><div><h4 className="font-bold text-slate-800">{valor(turma.nome_turma)}</h4><p className="mt-1 text-xs text-slate-500">Matrícula: {formatarDataBr(turma.data_matricula)}</p></div><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase text-slate-500">{valor(turma.status_turma)}</span></div>
                  <div className="mt-4 flex items-end justify-between"><span className="text-xs text-slate-500">{valor(turma.presencas)} / {valor(turma.total_chamadas)} presenças</span><strong className="text-lg text-emerald-700">{turma.percentual_presenca == null ? "—" : `${turma.percentual_presenca}%`}</strong></div>
                </article>)}
              </div> : <p className="text-sm text-slate-500">Nenhuma turma vinculada.</p>}
              <div className="mt-4 flex flex-wrap gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white">
                <span>Total de chamadas: <strong>{valor(pessoa.total_chamadas)}</strong></span>
                <span>Presenças: <strong>{valor(pessoa.presencas)}</strong></span>
                <span>Presença geral: <strong>{pessoa.percentual_presenca == null ? "—" : `${pessoa.percentual_presenca}%`}</strong></span>
              </div>
            </Secao>}

            {!publicoExterno && <Secao titulo="Histórico acadêmico" icone={GraduationCap}>
              {pessoa.historico_academico?.length ? <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-400"><th className="pb-3 pr-4">Matéria</th><th className="pb-3 pr-4">Nível</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Data</th></tr></thead><tbody className="divide-y divide-slate-100">{pessoa.historico_academico.map((item, index) => <tr key={item.id_historico ?? `${item.id_materia}-${index}`}><td className="py-3 pr-4 font-semibold text-slate-800">{valor(item.materia)}</td><td className="py-3 pr-4 text-slate-600">{valor(item.nivel)}</td><td className="py-3 pr-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{valor(item.status_materia)}</span></td><td className="py-3 text-slate-600">{formatarDataBr(item.data_status)}</td></tr>)}</tbody></table></div> : <p className="text-sm text-slate-500">Nenhum histórico acadêmico registrado.</p>}
            </Secao>}
          </div>
        )}
      </section>
    </div>
  );
}
