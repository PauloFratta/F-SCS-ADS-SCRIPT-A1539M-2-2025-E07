<?php
define('API_REQUEST', true);
require_once 'verificalogin.php';
require_once __DIR__ . '/../banco/conexao.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $codCliente = $_SESSION['CodCliente'] ?? null;

    // Se não autenticado, retorna lista vazia com sucesso
    if (!$codCliente) {
        echo json_encode(['sucesso' => true, 'gastos' => []]);
        exit;
    }

    $gastos = [];

    // Buscar gastos fixos
    $sql = "SELECT CodFixGR as id, NomeFixGR as nome, ValorFixGR as valor, 'fixa' as tipo 
            FROM FixGastoRenda 
            WHERE CodCliente = :codCliente AND FixRenOuGas = 'GASTO'
            ORDER BY NomeFixGR";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':codCliente' => $codCliente]);
    $gastosFixos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $gastos = array_merge($gastos, $gastosFixos);

    // Buscar gastos variáveis
    $sql = "SELECT CodVarGR as id, NomeVarGR as nome, 0.00 as valor, 'variavel' as tipo 
            FROM VarGastoRenda 
            WHERE CodCliente = :codCliente AND VarRenOuGas = 'GASTO'
            ORDER BY NomeVarGR";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':codCliente' => $codCliente]);
    $gastosVar = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $gastos = array_merge($gastos, $gastosVar);

    echo json_encode(['sucesso' => true, 'gastos' => $gastos]);

} catch (Throwable $e) {
    // Evita quebra por erro inesperado, sempre retorna JSON
    http_response_code(200);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao buscar gastos: ' . $e->getMessage()]);
}
?>
