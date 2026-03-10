import { checkPageAccess } from './utils/validationUser.js';

// Verificação de login e permissões ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    checkPageAccess(['aluno', 'voluntario']); // Permite alunos e voluntários
});

// Tornar funções globais para onclick no HTML
window.setTab = setTab;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.adicionarAluno = adicionarAluno;
window.listarAlunos = listarAlunos;
window.deletarAluno = deletarAluno;
window.editarAluno = editarAluno;

function setTab(ativo) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    ativo.classList.add('active');
}

function abrirModal() {
    // procura a classe ".fundo" no html 
    // querySelector sempre pega o primeiro elemento que encontrar.
    // classList - permite manipular classes
    // add a classe abrir no elemento 
    document.querySelector('.fundo').classList.add('abrir');
}

function fecharModal(event) {
    if (event.target.classList.contains('fundo')) {
        event.target.classList.remove('abrir');
    }
}

// json-server 
async function adicionarAluno() {
    const resposta = await fetch("http://localhost:8080/alunos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: input_nome.value,
            email: input_email.value,
            turma: input_turma.value,
            nascimento: input_dtNasc.value,
            dataIngresso: input_dtaIngresso.value,
            genero: select_genero.value,
            tipo: select_tipo.value,
            senha: input_senha.value
        })
    });

    const dados = await resposta.json();
    limparCamposModal();
    console.log("Aluno criado", dados);
}


async function listarAlunos() {
    const resposta = await fetch("http://localhost:8080/alunos", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });

    const dadosAlunos = await resposta.json();

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "" // limpa a tabela antes de inserir

    dadosAlunos.forEach(aluno => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
  <td class="name">${aluno.nome}</td>
  <td class="email">${aluno.email}</td>
  <td class="turma">${aluno.turma}</td>
  <td>${aluno.nascimento}</td>
  <td>${aluno.dataIngresso}</td>
  <td>${aluno.genero}</td>
  <td class="tag"><span>${aluno.tipo}</span></td>
  <td class="actions">
      <button class="btn-icon edit">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
      <button class="btn-icon delete">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </button>
  </td>
        `;
        tbody.appendChild(tr);

        const btnDelete = tr.querySelector(".btn-icon.delete");
        btnDelete.addEventListener("click", () => deletarAluno(aluno.id));

        const btnEdit = tr.querySelector(".btn-icon.edit");
        btnEdit.addEventListener("click", () => editarAluno(aluno));
    });

}
listarAlunos();


async function deletarAluno(id) {
    const confirmar = confirm("Deseja realmente excluir este aluno?");
    if (!confirmar) return;

    try {
        await fetch(`http://localhost:8080/alunos/${id}`, {
            method: "DELETE"
        });

        alert("Aluno deletado com sucesso!");
        listarAlunos(); // atualiza a tabela
    } catch (error) {
        console.error("Erro ao deletar aluno:", error);
        alert("Erro ao deletar aluno.");
    }
}


let alunoAtual = null; // guarda o aluno que está sendo editado
async function editarAluno(aluno) {
    alunoAtual = aluno;

    abrirModal();

    // preencher inputs com os dados do aluno
    input_nome.value = aluno.nome;
    input_email.value = aluno.email;
    input_turma.value = aluno.turma;
    input_dtNasc.value = aluno.nascimento;
    input_dtaIngresso.value = aluno.dataIngresso;
    select_genero.value = aluno.genero;
    select_tipo.value = aluno.tipo;
    input_senha.value = aluno.senha;
    

    // alterar o texto do botão de adicionar para atualizar
    const btnAdicionar = document.querySelector(".botoes .adicionar");
    btnAdicionar.textContent = "Atualizar";
    btnAdicionar.onclick = atualizarAluno;

    async function atualizarAluno() {

        if (!alunoAtual) return;

        const resposta = await fetch(`http://localhost:8080/alunos/${alunoAtual.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: input_nome.value,
                email: input_email.value,
                turma: input_turma.value,
                nascimento: input_dtNasc.value,
                dataIngresso: input_dtaIngresso.value,
                genero: select_genero.value,
                tipo: select_tipo.value,
                senha: input_senha.value
            })
        });

        const dados = await resposta.json();
        console.log("Aluno atualizado", dados);

        // fechar modal
        fecharModal({ target: document.getElementById("modal") });

        // reset botão
        limparCamposModal()
        const btnAdicionar = document.querySelector(".botoes .adicionar");
        btnAdicionar.textContent = "Adicionar";
        btnAdicionar.onclick = adicionarAluno;

        // atualizar tabela
        listarAlunos();

        alunoAtual = null;

    }
}


function limparCamposModal() {
    input_nome.value = '';
    input_email.value = '';
    input_turma.value = '';
    input_dtNasc.value = '';
    input_dtaIngresso.value = '';
    select_genero.value = '';
    select_tipo.value = '';
    input_senha.value = '';
}