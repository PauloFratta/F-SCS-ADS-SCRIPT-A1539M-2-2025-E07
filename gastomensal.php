
<?php
  session_start();

  if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
      header('Location: login.html');
      exit;
  }

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Despesas Mensais</title>
  <link rel="stylesheet" href="styles/globals.css" />
</head>
<body>
  
  <header class="site-header">
    <div class="container header-inner">
      <h1> <a href="index.php" class="logo">Contador Digital </a></h1>
    </div>
  </header>
  <main class="main-content">
    <section class="add-section">
        <h2>Adicionar Novas Despesas</h2>
        <div class="add-form">
            <div class="field">
                <label for="col1">Nome da Despesa</label>
                <input type="text" id="col1" placeholder="Nome da Despesa">
            </div>
            <div class="field">
                <label for="col2">Valor</label>
                <input type="text" id="col2" placeholder="00,00">

                <script>
                    const valor = document.getElementById('col2');
                    valor.inputMode = "decimal";
                    
                    valor.addEventListener("beforeinput", (e) => {
                        // permite deletar
                        if (e.inputType === "deleteContentBackward" ||
                            e.inputType === "deleteContentForward" ||
                            e.inputType === "deleteByCut") {
                            return;
                        }

                        // pega caractere digitado
                        const char = e.data;

                        // aceita dígitos, vírgula e ponto
                        const permitido = /[0-9.,]/;

                        // se não for permitido → bloquear
                        if (char && !permitido.test(char)) {
                            e.preventDefault();
                        }
                    });
                </script>
            </div>
            <div class="field">
                <label for="tipo">Tipo</label>
                <select id="tipo">
                    <option value="fixa">Fixa</option>
                    <option value="variavel">Variável</option>
                </select>
            </div>
            <button type="button" id="addBtn">Adicionar</button>
        </div>

        <table id="dataTable" class="table-finance">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Valor</th>
                    <th>Tipo</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <!-- os itens irao aparecer aqui -->
            </tbody>
        </table>
        <div class="salvar">
            <button type="button" id="saveBtn">Salvar Novos Gastos</button>
        </div>
    </section>

    <section class="add-section">
        <h2>Despesas Salvas</h2>
        <table id="tabelaGastosSalvos" class="table-finance">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Valor</th>
                    <th>Editar</th>
                    <th>Excluir</th>
                </tr>
            </thead>
            <tbody>
                <!-- Gastos salvos do banco aparecem aqui -->
            </tbody>
        </table>
    </section>
  </main>

  <script src="scripts/main.js"></script>
</body>
</html>
