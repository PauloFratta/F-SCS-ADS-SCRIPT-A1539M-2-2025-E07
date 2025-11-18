// Navegação dos botões da página inicial
document.addEventListener('DOMContentLoaded', () => {
    const btnGastoMensal = document.getElementById('btn-gastoMensal');
    const btnRendaMensal = document.getElementById('btn-rendaMensal');
    const btnRelatorio = document.getElementById('btn-relatorio');
    const btnLogin = document.getElementById('btn-login');
    const btnCadastro = document.getElementById('btn-cadastro');

    if(btnGastoMensal) btnGastoMensal.addEventListener('click', () => {
        window.location.href = 'gastoMensal.html';
    });

    if(btnRendaMensal) btnRendaMensal.addEventListener('click', () => {
        window.location.href = 'rendamensal.html';
    });

    if(btnRelatorio) btnRelatorio.addEventListener('click', () => {
        window.location.href = 'relatorio.html';
    });

    if(btnLogin) btnLogin.addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    if(btnCadastro) btnCadastro.addEventListener('click', () => {
        window.location.href = 'cadastro.html';
    });

});
