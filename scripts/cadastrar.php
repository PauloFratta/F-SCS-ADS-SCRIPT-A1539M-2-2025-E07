<?php
require_once __DIR__ . '/../banco/conexao.php';

$nome = trim($_POST['NomeCliente'] ?? '');
$email = trim($_POST['EmailCliente'] ?? '');
$emailConfirm = trim($_POST['ConfirmarEmail'] ?? '');
$senha = $_POST['SenhaCliente'] ?? '';
$senhaConfirm = $_POST['ConfirmarSenha'] ?? '';

// validações 
if (!$nome || !$email || !$emailConfirm || !$senha || !$senhaConfirm) {
    die('Preencha todos os campos.');
}
if ($email !== $emailConfirm) {
    die('Emails não correspondem.');
}
if ($senha !== $senhaConfirm) {
    die('Senhas não correspondem.');
}

try {
    // verificacao de email
    $stmt = $pdo->prepare('SELECT CodCliente FROM Clientes WHERE EmailCliente = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        die('Email já cadastrado.');
    }

    $insert = $pdo->prepare('INSERT INTO Clientes (NomeCliente, EmailCliente, SenhaCliente) VALUES (?, ?, ?)');
    $insert->execute([$nome, $email, $senhaConfirm]);

    // redireciona para login (ou mostrar mensagem de erro)
    header('Location: login.html');
    exit;
} catch (PDOException $e) {
    die('Erro no servidor: ' . $e->getMessage());
}
?>