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


    // Função que adiciona uma linha à tabela com os valores dos inputs
    (function () {
            const addBtn = document.getElementById('addBtn');
            const col1 = document.getElementById('col1');
            const col2 = document.getElementById('col2');
            const tipo = document.getElementById('tipo');
            const tbody = document.querySelector('#dataTable tbody');

            function clearInputs() {
                col1.value = '';
                col2.value = '';
                tipo.value = 'fixa';
                col1.focus();
            }

            function addRow() {
                const v1 = col1.value.trim();
                const v2 = col2.value.trim();
                const v3 = tipo.value;

                if (!v1 && !v2 && !v3) {
                    // Não adiciona linhas vazias
                    return;
                }

                const tr = document.createElement('tr');
                [v1, v2, v3].forEach(text => {
                    const td = document.createElement('td');
                    td.textContent = text;
                    tr.appendChild(td);
                });

                // Coluna de ações com botão Remover
                const actionTd = document.createElement('td');
                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'remove-btn';
                removeBtn.textContent = 'Remover';
                removeBtn.addEventListener('click', function () {
                    tr.remove();
                });
                actionTd.appendChild(removeBtn);
                tr.appendChild(actionTd);

                tbody.appendChild(tr);
                clearInputs();
            }

            addBtn.addEventListener('click', addRow);

            // Permite adicionar com Enter em qualquer input (melhora usabilidade)
            [col1, col2].forEach(input => {
                input.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        addRow();
                    }
                });
            });
    })();

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