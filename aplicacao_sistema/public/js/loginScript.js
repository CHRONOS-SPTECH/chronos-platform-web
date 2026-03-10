import { isValidEmail } from "./utils/validationForm";

document.addEventListener('DOMContentLoaded', () => {
    const btnEntrar = document.querySelector('.btn-entrar');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');

    btnEntrar.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();

        if (!email || !senha) {
            alert('Por favor, preencha email e senha.');
            return;
        }

        if(isValidEmail(email)){
            alert('Por favor, insira um e-mail válido')
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/alunos?email=${encodeURIComponent(email)}`);
            const users = await response.json();

            const user = users.find(u => u.senha === senha);

            if (user) {
                user.tipo = user.tipo.toLowerCase(); // 'aluno' ou 'voluntário'
                localStorage.setItem('chronos_user', JSON.stringify(user));
                window.location.href = 'telaAlunos.html';
            } else {
                alert('Email ou senha incorretos.');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao conectar ao servidor.');
        }
    });
});
