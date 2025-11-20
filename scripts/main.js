// Navegação dos botões da página inicial
document.addEventListener('DOMContentLoaded', () => {
    const btnGastoMensal = document.getElementById('btn-gastoMensal');
    const btnRendaMensal = document.getElementById('btn-rendaMensal');
    const btnRelatorio = document.getElementById('btn-relatorio');
    const btnLogin = document.getElementById('btn-login');
    const btnCadastro = document.getElementById('btn-cadastro');

    if(btnGastoMensal) btnGastoMensal.addEventListener('click', () => {
        window.location.href = 'gastomensal.php';
    });

    if(btnRendaMensal) btnRendaMensal.addEventListener('click', () => {
        window.location.href = 'rendamensal.php';
    });

    if(btnRelatorio) btnRelatorio.addEventListener('click', () => {
        window.location.href = 'relatorio.php';
    });

    if(btnLogin) btnLogin.addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    if(btnCadastro) btnCadastro.addEventListener('click', () => {
        window.location.href = 'cadastro.html';
    });


});


function mostrarSenha() {
    var senhaInput = document.getElementById("SenhaCliente");
    var confirmarSenhaInput = document.getElementById("ConfirmarSenha");
    var checkbox = document.getElementById("mostrar");
    if (checkbox.checked) 
    {
        senhaInput.type = "text";
        confirmarSenhaInput.type = "text";
    } 
    else 
    {
        senhaInput.type = "password";
        confirmarSenhaInput.type = "password";
    }
}