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

            // Salvar dados no banco de dados
            const saveBtn = document.getElementById('saveBtn');
            if (saveBtn) {
                saveBtn.addEventListener('click', function (e) {
                    e.preventDefault();

                    const rows = tbody.querySelectorAll('tr');
                    if (rows.length === 0) {
                        alert('Adicione pelo menos um gasto para salvar!');
                        return;
                    }

                    // Coletar todos os dados da tabela
                    const dados = [];
                    rows.forEach(row => {
                        const cells = row.querySelectorAll('td');
                        if (cells.length >= 3) {
                            dados.push({
                                nome: cells[0].textContent.trim(),
                                valor: cells[1].textContent.trim(),
                                tipo: cells[2].textContent.trim()
                            });
                        }
                    });

                    // Enviar para o servidor
                    fetch('scripts/BACKgastomensal.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(dados)
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.sucesso) {
                            alert('Gastos salvos com sucesso!');
                            // Limpar tabela após salvar
                            tbody.innerHTML = '';
                            // Recarregar a tabela de gastos salvos
                            carregarGastosSalvos();
                        } else {
                            alert('Erro ao salvar: ' + data.mensagem);
                        }
                    })
                    .catch(error => {
                        console.error('Erro:', error);
                        alert('Erro ao conectar com o servidor');
                    });
                });
            }

            // Salvar dados da renda no banco de dados
            const saveBtnRenda = document.getElementById('saveBtnRendaMensal');
            if (saveBtnRenda) {
                saveBtnRenda.addEventListener('click', function (e) {
                    e.preventDefault();

                    const rows = tbody.querySelectorAll('tr');
                    if (rows.length === 0) {
                        alert('Adicione pelo menos uma renda para salvar!');
                        return;
                    }

                    // Coletar todos os dados da tabela
                    const dados = [];
                    rows.forEach(row => {
                        const cells = row.querySelectorAll('td');
                        if (cells.length >= 3) {
                            dados.push({
                                nome: cells[0].textContent.trim(),
                                valor: cells[1].textContent.trim(),
                                tipo: cells[2].textContent.trim()
                            });
                        }
                    });

                    // Enviar para o servidor
                    fetch('scripts/BACKrendamensal.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(dados)
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.sucesso) {
                            alert('Renda salvos com sucesso!');
                            // Limpar tabela após salvar
                            tbody.innerHTML = '';
                            // Recarregar a tabela de rendas salvas
                            if (window.carregarRendasSalvas) {
                                carregarRendasSalvas();
                            }
                        } else {
                            alert('Erro ao salvar: ' + data.mensagem);
                        }
                    })
                    .catch(error => {
                        console.error('Erro:', error);
                        alert('Erro ao conectar com o servidor');
                    });
                });
            }



    })();

    // ==================== TABELA DE GASTOS SALVOS ====================
    (function () {
        const tabelaGastosSalvos = document.getElementById('tabelaGastosSalvos');
        if (!tabelaGastosSalvos) return; // Só executa se a tabela existir na página

        const tbody = tabelaGastosSalvos.querySelector('tbody');

        // Carregar gastos salvos do banco
        function carregarGastosSalvos() {
            console.log('Iniciando carregamento de gastos salvos...');
            fetch('scripts/BACKbuscagastomensal.php')
                .then(async (response) => {
                    console.log('Response status:', response.status);
                    const raw = await response.text();
                    console.log('RAW gastos response:', raw);
                    let data;
                    try {
                        data = JSON.parse(raw);
                        console.log('JSON parsed:', data);
                    } catch (e) {
                        console.error('Resposta não é JSON válido', e);
                        console.error('Raw text:', raw);
                        throw e;
                    }

                    tbody.innerHTML = '';

                    if (!data || data.sucesso !== true) {
                        const msg = (data && data.mensagem) ? data.mensagem : 'Falha ao carregar gastos';
                        console.warn('Carregar gastos falhou:', msg);
                        const tr = document.createElement('tr');
                        const td = document.createElement('td');
                        td.colSpan = 5;
                        td.textContent = msg === 'Usuário não autenticado' ? 'Faça login para ver seus gastos' : 'Nenhum gasto cadastrado';
                        td.style.textAlign = 'center';
                        tr.appendChild(td);
                        tbody.appendChild(tr);
                        return;
                    }

                    if (Array.isArray(data.gastos) && data.gastos.length > 0) {
                        data.gastos.forEach(gasto => adicionarLinhaGastoSalvo(gasto));
                    } else {
                        const tr = document.createElement('tr');
                        const td = document.createElement('td');
                        td.colSpan = 5;
                        td.textContent = 'Nenhum gasto cadastrado';
                        td.style.textAlign = 'center';
                        tr.appendChild(td);
                        tbody.appendChild(tr);
                    }
                })
                .catch(error => {
                    console.error('Erro ao carregar gastos:', error);
                    tbody.innerHTML = '';
                    const tr = document.createElement('tr');
                    const td = document.createElement('td');
                    td.colSpan = 5;
                    td.textContent = 'Erro ao carregar gastos';
                    td.style.textAlign = 'center';
                    tr.appendChild(td);
                    tbody.appendChild(tr);
                });
        }

        // Adicionar linha com gasto salvo
        function adicionarLinhaGastoSalvo(gasto) {
            const tr = document.createElement('tr');
            tr.dataset.id = gasto.id;
            tr.dataset.tipo = gasto.tipo;

            // ID
            const tdId = document.createElement('td');
            tdId.textContent = gasto.id;
            tr.appendChild(tdId);

            // Nome
            const tdNome = document.createElement('td');
            tdNome.textContent = gasto.nome;
            tdNome.classList.add('editable-nome');
            tr.appendChild(tdNome);

            // Valor
            const tdValor = document.createElement('td');
            if (gasto.tipo === 'variavel') {
                tdValor.textContent = 'Variável';
                tdValor.style.fontStyle = 'italic';
                tdValor.style.color = '#666';
            } else {
                tdValor.textContent = gasto.valor || '0.00';
            }
            tdValor.classList.add('editable-valor');
            tr.appendChild(tdValor);

            // Editar (coluna própria)
            const tdEditar = document.createElement('td');
            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'edit-btn';
            editBtn.textContent = 'Editar';
            editBtn.addEventListener('click', () => editarGasto(tr, gasto));
            tdEditar.appendChild(editBtn);
            tr.appendChild(tdEditar);

            // Excluir (coluna própria)
            const tdExcluir = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Excluir';
            deleteBtn.addEventListener('click', () => deletarGasto(gasto.id, gasto.tipo, tr));
            tdExcluir.appendChild(deleteBtn);
            tr.appendChild(tdExcluir);

            tbody.appendChild(tr);
        }

        // Editar gasto
        function editarGasto(tr, gasto) {
            const tdNome = tr.querySelector('.editable-nome');
            const tdValor = tr.querySelector('.editable-valor');

            const novoNome = prompt('Novo nome:', tdNome.textContent);
            if (novoNome === null) return; // Cancelou
            if (!novoNome.trim()) {
                alert('Nome não pode estar vazio');
                return;
            }

            let novoValor = tdValor.textContent;
            if (gasto.tipo === 'fixa') {
                novoValor = prompt('Novo valor:', novoValor);
                if (novoValor === null) return; // Cancelou
                if (!novoValor || isNaN(novoValor)) {
                    alert('Valor inválido');
                    return;
                }
            }

            // Enviar atualização para o servidor
            fetch('scripts/BACKeditargasto.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: gasto.id,
                    tipo: gasto.tipo,
                    nome: novoNome.trim(),
                    valor: novoValor
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.sucesso) {
                    tdNome.textContent = novoNome.trim();
                    if (gasto.tipo === 'fixa') {
                        tdValor.textContent = parseFloat(novoValor).toFixed(2);
                    }
                    alert('Gasto atualizado com sucesso!');
                } else {
                    alert('Erro: ' + data.mensagem);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao atualizar gasto');
            });
        }

        // Deletar gasto
        function deletarGasto(id, tipo, tr) {
            if (!confirm('Tem certeza que deseja deletar este gasto?')) return;

            fetch('scripts/BACKdeletargasto.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id,
                    tipo: tipo
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.sucesso) {
                    tr.remove();
                    alert('Gasto deletado com sucesso!');
                    // Recarregar se a tabela ficou vazia
                    if (tbody.children.length === 0) {
                        carregarGastosSalvos();
                    }
                } else {
                    alert('Erro: ' + data.mensagem);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao deletar gasto');
            });
        }

        // Carregar gastos ao abrir a página
        carregarGastosSalvos();

        // Tornar a função global para ser chamada após salvar novos gastos
        window.carregarGastosSalvos = carregarGastosSalvos;
    })();

    // ==================== TABELA DE RENDAS SALVAS ====================
    (function () {
        const tabelaRendaSalvas = document.getElementById('tabelaRenda');
        if (!tabelaRendaSalvas) return; // Só executa se a tabela existir na página

        const tbody = tabelaRendaSalvas.querySelector('tbody');

        // Carregar rendas salvos do banco
        function carregarRendasSalvas() {
            console.log('Iniciando carregamento de rendas salvas...');
            fetch('scripts/BACKbuscarendamensal.php')
                .then(async (response) => {
                    console.log('Response status:', response.status);
                    const raw = await response.text();
                    console.log('RAW rendas response:', raw);
                    let data;
                    try {
                        data = JSON.parse(raw);
                        console.log('JSON parsed:', data);
                    } catch (e) {
                        console.error('Resposta não é JSON válido', e);
                        console.error('Raw text:', raw);
                        throw e;
                    }

                    tbody.innerHTML = '';

                    if (!data || data.sucesso !== true) {
                        const msg = (data && data.mensagem) ? data.mensagem : 'Falha ao carregar rendas';
                        console.warn('Carregar rendas falhou:', msg);
                        const tr = document.createElement('tr');
                        const td = document.createElement('td');
                        td.colSpan = 5;
                        td.textContent = msg === 'Usuário não autenticado' ? 'Faça login para ver suas rendas' : 'Nenhuma renda cadastrada';
                        td.style.textAlign = 'center';
                        tr.appendChild(td);
                        tbody.appendChild(tr);
                        return;
                    }

                    if (Array.isArray(data.rendas) && data.rendas.length > 0) {
                        data.rendas.forEach(renda => adicionarLinhaRendaSalva(renda));
                    } else {
                        const tr = document.createElement('tr');
                        const td = document.createElement('td');
                        td.colSpan = 5;
                        td.textContent = 'Nenhuma renda cadastrada';
                        td.style.textAlign = 'center';
                        tr.appendChild(td);
                        tbody.appendChild(tr);
                    }
                })
                .catch(error => {
                    console.error('Erro ao carregar rendas:', error);
                    tbody.innerHTML = '';
                    const tr = document.createElement('tr');
                    const td = document.createElement('td');
                    td.colSpan = 5;
                    td.textContent = 'Erro ao carregar rendas';
                    td.style.textAlign = 'center';
                    tr.appendChild(td);
                    tbody.appendChild(tr);
                });
        }

        // Adicionar linha com renda salva
        function adicionarLinhaRendaSalva(renda) {
            const tr = document.createElement('tr');
            tr.dataset.id = renda.id;
            tr.dataset.tipo = renda.tipo;

            // ID
            const tdId = document.createElement('td');
            tdId.textContent = renda.id;
            tr.appendChild(tdId);

            // Nome
            const tdNome = document.createElement('td');
            tdNome.textContent = renda.nome;
            tdNome.classList.add('editable-nome');
            tr.appendChild(tdNome);

            // Valor
            const tdValor = document.createElement('td');
            if (renda.tipo === 'variavel') {
                tdValor.textContent = 'Variável';
                tdValor.style.fontStyle = 'italic';
                tdValor.style.color = '#666';
            } else {
                tdValor.textContent = renda.valor || '0.00';
            }
            tdValor.classList.add('editable-valor');
            tr.appendChild(tdValor);

            // Editar (coluna própria)
            const tdEditar = document.createElement('td');
            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'edit-btn';
            editBtn.textContent = 'Editar';
            editBtn.addEventListener('click', () => editarRenda(tr, renda));
            tdEditar.appendChild(editBtn);
            tr.appendChild(tdEditar);

            // Excluir (coluna própria)
            const tdExcluir = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Excluir';
            deleteBtn.addEventListener('click', () => deletarRenda(renda.id, renda.tipo, tr));
            tdExcluir.appendChild(deleteBtn);
            tr.appendChild(tdExcluir);

            tbody.appendChild(tr);
        }

        // Editar renda
        function editarRenda(tr, renda) {
            const tdNome = tr.querySelector('.editable-nome');
            const tdValor = tr.querySelector('.editable-valor');

            const novoNome = prompt('Novo nome:', tdNome.textContent);
            if (novoNome === null) return; // Cancelou
            if (!novoNome.trim()) {
                alert('Nome não pode estar vazio');
                return;
            }

            let novoValor = tdValor.textContent;
            if (renda.tipo === 'fixa') {
                novoValor = prompt('Novo valor:', novoValor);
                if (novoValor === null) return; // Cancelou
                if (!novoValor || isNaN(novoValor)) {
                    alert('Valor inválido');
                    return;
                }
            }

            // Enviar atualização para o servidor
            fetch('scripts/BACKeditarrenda.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: renda.id,
                    tipo: renda.tipo,
                    nome: novoNome.trim(),
                    valor: novoValor
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.sucesso) {
                    tdNome.textContent = novoNome.trim();
                    if (renda.tipo === 'fixa') {
                        tdValor.textContent = parseFloat(novoValor).toFixed(2);
                    }
                    alert('Renda atualizada com sucesso!');
                } else {
                    alert('Erro: ' + data.mensagem);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao atualizar renda');
            });
        }

        // Deletar renda
        function deletarRenda(id, tipo, tr) {
            if (!confirm('Tem certeza que deseja deletar esta renda?')) return;

            fetch('scripts/BACKdeletarrenda.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id,
                    tipo: tipo
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.sucesso) {
                    tr.remove();
                    alert('Renda deletada com sucesso!');
                    // Recarregar se a tabela ficou vazia
                    if (tbody.children.length === 0) {
                        carregarRendasSalvas();
                    }
                } else {
                    alert('Erro: ' + data.mensagem);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao deletar renda');
            });
        }

        // Carregar rendas ao abrir a página
        carregarRendasSalvas();

        // Tornar a função global para ser chamada após salvar novas rendas
        window.carregarRendasSalvas = carregarRendasSalvas;
    })();

});

// Função para mostrar ou esconder a senha no formulário de cadastro/login
function mostrarSenha() 
{
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

// Função para exibir despesas mensais no relatório
async function exibirDespesasRelatorio() 
{
    const rendasBody = document.getElementById('listaRendas');
    const despesasBody = document.getElementById('listaDespesas');
    const erroEl = document.getElementById('erro');

    if (!rendasBody || !despesasBody) return; // página não é relatorio.php

    erroEl && (erroEl.textContent = '');

    try {
        const resp = await fetch('scripts/BACKrelatorio.php', { credentials: 'same-origin' });
        if (!resp.ok) throw new Error('Erro na requisição: ' + resp.status);
        const data = await resp.json();

        if (!data.sucesso) throw new Error(data.mensagem || 'Resposta sem sucesso');

        // Limpa tabelas
        rendasBody.innerHTML = '';
        despesasBody.innerHTML = '';

        const formatValor = (v) => {
            const n = Number(String(v).replace(',', '.')) || 0;
            return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        };

        // Preenche rendas
        const rendas = data.rendas || [];
        if (rendas.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="3" style="text-align:center;color:#666">Nenhuma renda registrada</td>';
            rendasBody.appendChild(tr);
        } else {
            rendas.forEach(item => {
                const tr = document.createElement('tr');
                const nomeTd = document.createElement('td');
                const valorTd = document.createElement('td');
                const tipoTd = document.createElement('td');
                nomeTd.textContent = item.NomeFixGR ?? item.NomeVarGR ?? '';
                if (item.NomeFixGR == null)
                {
                    valorTd.innerHTML = "";

                    tipoTd.textContent = "Variável";
                    const valor = document.createElement('input');
                    valor.type = "number";
                    valor.placeholder = "00,00";
                    valor.addEventListener('input', atualizarTotais);


                    const container = document.createElement('span');
                    container.classList.add("valor-var-tabela")

                    const prefixo = document.createElement('span');
                    prefixo.textContent = "R$";

                    container.appendChild(prefixo)
                    container.appendChild(valor);

                    valorTd.appendChild(container);
                }
                else
                {
                    tipoTd.textContent = "Fixo";
                    valorTd.textContent = formatValor(item.valor ?? item.ValorFixGR ?? 0);
                }
                tr.appendChild(nomeTd);
                tr.appendChild(valorTd);
                tr.appendChild(tipoTd);
                rendasBody.appendChild(tr);
            });
        }

        // Preenche despesas (gastos)
        const gastos = data.gastos || [];
        if (gastos.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="3" style="text-align:center;color:#666">Nenhuma despesa registrada</td>';
            despesasBody.appendChild(tr);
        } else {
            gastos.forEach(item => {
                const tr = document.createElement('tr');
                const nomeTd = document.createElement('td');
                const valorTd = document.createElement('td');
                const tipoTd = document.createElement('td');
                nomeTd.textContent = item.nome ?? item.NomeFixGR ?? item.NomeVarGR ?? '';
                if (item.NomeFixGR == null)
                {
                    valorTd.innerHTML = "";

                    tipoTd.textContent = "Variável";
                    const valor = document.createElement('input');
                    valor.type = "number";
                    valor.placeholder = "00,00";
                    valor.addEventListener('input', atualizarTotais);


                    const container = document.createElement('span');
                    container.classList.add("valor-var-tabela")

                    const prefixo = document.createElement('span');
                    prefixo.textContent = "R$";

                    container.appendChild(prefixo)
                    container.appendChild(valor);

                    valorTd.appendChild(container);
                }
                else
                {
                    tipoTd.textContent = "Fixo";
                    valorTd.textContent = formatValor(item.valor ?? item.ValorFixGR ?? 0);
                }
                tr.appendChild(nomeTd);
                tr.appendChild(valorTd);
                tr.appendChild(tipoTd);
                despesasBody.appendChild(tr);
            });
        }
        atualizarTotais();
    } catch (err) {
        console.error(err);
        if (erroEl) erroEl.textContent = 'Erro ao carregar relatório: ' + (err.message || '');
    }
}

function atualizarTotais() {
    const rendasBody = document.getElementById('listaRendas');
    const despesasBody = document.getElementById('listaDespesas');

    let totalRenda = 0;
    let totalDespesa = 0;

    const parseValor = (v) => Number(String(v).replace('R$', '').replace('.', '').replace(',', '.')) || 0;

    // --- SOMAR RENDAS ---
    rendasBody.querySelectorAll('tr').forEach(tr => {
        const tdValor = tr.children[1];
        if (!tdValor) return;

        const input = tdValor.querySelector('input');
        if (input) {
            // valor variável
            totalRenda += parseValor(input.value);
        } else {
            // valor fixo (texto)
            totalRenda += parseValor(tdValor.textContent);
        }
    });

    // --- SOMAR DESPESAS ---
    despesasBody.querySelectorAll('tr').forEach(tr => {
        const tdValor = tr.children[1];
        if (!tdValor) return;

        const input = tdValor.querySelector('input');
        if (input) {
            totalDespesa += parseValor(input.value);
        } else {
            totalDespesa += parseValor(tdValor.textContent);
        }
    });

    // Atualizar resumo
    document.getElementById('totalRenda').textContent =
        totalRenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    document.getElementById('totalDespesa').textContent =
        totalDespesa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Atualizar balanço final
    const balanco = totalRenda - totalDespesa;

    document.getElementById('balancoFinal').textContent =
        balanco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


// Chama automaticamente quando a página tiver o DOM pronto
document.addEventListener('DOMContentLoaded', () => {
    // se estivermos na página de relatório, carrega os dados
    exibirDespesasRelatorio();
});