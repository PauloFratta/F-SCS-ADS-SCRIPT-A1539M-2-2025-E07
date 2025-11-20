<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu Principal</title>
    <link rel="stylesheet" href="styles/globals.css" />
</head>
<body>
    <header class="site-header">
        <div class="container header-inner">
            <h1 class="logo">Contador Digital</h1>
            <nav class="main-nav">
                <?php
                    session_start();

                    if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
                        echo '<ul>
                                <li><a href="perfil.php">Perfil</a></li>
                                <li><a href="scripts/logout.php">Logout</a></li>
                              </ul>';
                    } else {
                        echo '<ul>
                                <li><a href="login.html">Login</a></li>
                                <li><a href="cadastro.html">Cadastrar-se</a></li>
                              </ul>';
                    }
                ?>
            </nav>
        </div>
    </header>

    <main class="main-content">
        <section class="hero">
            <h2>Bem-vindo ao Contador Digital</h2>
            <img src="images/contabilidade-digital.jpg" alt="Imagem de Contabilidade Digital"/>
            <h2>Facilitando sua gestão financeira!</h2>
            <p>Escolha uma das seções abaixo para navegar pelo site.</p>
            <div class="buttons-row">
                <button id="btn-gastoMensal" class="nav-btn">Gasto Mensal</button>
                <button id="btn-rendaMensal" class="nav-btn">Renda Mensal</button>
                <button id="btn-relatorio" class="nav-btn">Lucro ou Prejuizo</button>
            </div>
        </section>
    </main>

    <script src="scripts/main.js"></script>
</body>
</html>

