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
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>Relatório</title>
    <link rel="stylesheet" href="styles/globals.css"/>
  </head>

  <body>
    <header class="site-header">
      <div class="container header-inner">
        <h1> <a href="index.php" class="logo">Contador Digital</a></h1>
      </div>
    </header>

    <main class="main-content">
      <section class="add-section">
        <h2 id="titulo-analise">Análise Financeira do Mês</h2>
        <div class="container-analise">
          <div class="lista-renda">
            <h3>Rendas Mensais</h3>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Valor</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody id="listaRendas">
                <!-- Itens de renda serão inseridos aqui -->
              </tbody>
            </table>
          </div>

          <div class="lista-despesa">
            <h3>Despesas Mensais</h3>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Valor</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody id="listaDespesas">
                <!-- Itens de despesa serão inseridos aqui -->
              </tbody>
            </table>
          </div>

          <div class="resumo-renda">
            <h3>Resumo de Renda</h3>
            <p id="totalRenda">Total de Renda: R$ 0,00</p>
          </div>

          <div class="resumo-despesa">
            <h3>Resumo de Despesa</h3>
            <p id="totalDespesa">Total de Despesa: R$ 0,00</p>
          </div>
        </div>

        <div class="balanco-final">
            <h3>Balanço Final</h3>
            <p id="balancoFinal">Balanço: R$ 0,00</p>
          </div>
      </section>
    </main>

    <script src="scripts/main.js"></script>
  </body>
</html>
