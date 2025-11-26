<?php
// Recebe JSON com array de rendas e insere na tabela FixGastoRenda
// Espera { nome, valor, tipo } por item. Usa CodCliente da sessão.

require_once __DIR__ . '/../banco/conexao.php';
session_start();
header('Content-Type: application/json; charset=utf-8');

// Verifica sessão
if (empty($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true || empty($_SESSION['CodCliente'])) {
    http_response_code(401);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Usuário não autenticado.']);
    exit;
}

$codCliente = (int) $_SESSION['CodCliente'];

// Lê entrada JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Formato inválido. Esperado JSON array.']);
    exit;
}

$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare('INSERT INTO FixGastoRenda (NomeFixGR, ValorFixGR, FixRenOuGas, CodCliente) VALUES (?, ?, ?, ?)');
    $count = 0;

    foreach ($data as $item) {
        $nome = trim($item['nome'] ?? '');
        $valorRaw = trim($item['valor'] ?? '0');
        // normalizar valor: aceitar vírgula ou ponto
        $valorNormalized = str_replace(',', '.', $valorRaw);
        $valor = is_numeric($valorNormalized) ? (float)$valorNormalized : null;

        $tipo = trim(strtoupper($item['tipo'] ?? ''));

        if ($nome === '' || $valor === null) {
            // pular itens inválidos
            continue;
        }

        // Para rendas fixas/variaveis, gravamos na tabela de FixGastoRenda
        // ValorFixGR: decimal, FixRenOuGas: 'RENDA'
        $fixRenOuGas = 'RENDA';

        $stmt->execute([$nome, $valor, $fixRenOuGas, $codCliente]);
        $count++;
    }

    $pdo->commit();
    echo json_encode(['sucesso' => true, 'inseridos' => $count]);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro no servidor: ' . $e->getMessage()]);
}

?>