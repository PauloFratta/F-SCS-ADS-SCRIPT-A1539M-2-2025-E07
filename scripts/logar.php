<?php
    require_once __DIR__ . '/../banco/conexao.php';

    $email = trim($_POST['EmailCliente'] ?? '');
    $senha = $_POST['SenhaCliente'] ?? '';

    if (!$email || !$senha) 
    {
        die('Preencha todos os campos.');
    }

    try 
    {
        $stmt = $pdo->prepare('SELECT CodCliente, NomeCliente FROM Clientes WHERE EmailCliente = ? AND SenhaCliente = ?');
        $stmt->execute([$email, $senha]);
        $usuario = $stmt->fetch();

        if ($usuario) 
        {
            session_start();
            $_SESSION['CodCliente'] = $usuario['CodCliente'];
            $_SESSION['NomeCliente'] = $usuario['NomeCliente'];

            header('Location: ../index.html');
            exit;
        } 
        else 
        {
            die('Email ou senha incorretos.');
        }
    } 
    catch (PDOException $e) 
    {
        die('Erro no servidor: ' . $e->getMessage());
    }
?>