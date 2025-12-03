<?php
session_start();

// Verifica se o usuário está logado
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    // Se não estiver logado, redireciona para login (apenas em páginas, não em APIs)
    // Para APIs, apenas deixa a sessão vazia e o script decide o que fazer
    if (!defined('API_REQUEST')) {
        header('Location: ../login.html');
        exit;
    }
}
?>
