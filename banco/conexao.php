<?php
    $host = "localhost";
    $usuario = "root";
    $senha = "";
    $banco = "contador_digitalDB";

    try 
    {
        $pdo = new PDO("mysql:host=$host;dbname=$banco;charset=utf8", $usuario, $senha);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch (PDOException $ex) 
    {
        die("Erro ao conectar: " . $ex->getMessage());
    }
?>