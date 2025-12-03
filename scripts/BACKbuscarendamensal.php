<?php
define('API_REQUEST', true);
require_once 'verificalogin.php';
require_once __DIR__ . '/../banco/conexao.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $codCliente = $_SESSION['CodCliente'] ?? null;

    if (!$codCliente) {
        echo json_encode(['sucesso' => true, 'rendas' => []]);
        exit;
    }

    $rendas = [];

    // Buscar rendas fixas
    $sql = "SELECT CodFixGR as id, NomeFixGR as nome, ValorFixGR as valor, 'fixa' as tipo 
            FROM FixGastoRenda 
            WHERE CodCliente = :codCliente AND FixRenOuGas = 'RENDA'
            ORDER BY NomeFixGR";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':codCliente' => $codCliente]);
    $rendasFixas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $rendas = array_merge($rendas, $rendasFixas);

    // Buscar rendas variáveis
    $sql = "SELECT CodVarGR as id, NomeVarGR as nome, 0.00 as valor, 'variavel' as tipo 
            FROM VarGastoRenda 
            WHERE CodCliente = :codCliente AND VarRenOuGas = 'RENDA'
            ORDER BY NomeVarGR";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':codCliente' => $codCliente]);
    $rendasVar = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $rendas = array_merge($rendas, $rendasVar);

    echo json_encode(['sucesso' => true, 'rendas' => $rendas]);

} catch (Throwable $e) {
    http_response_code(200);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao buscar rendas: ' . $e->getMessage()]);
}
?>
