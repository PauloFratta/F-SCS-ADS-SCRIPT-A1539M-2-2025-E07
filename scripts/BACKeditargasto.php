<?php
define('API_REQUEST', true);
require_once 'verificalogin.php';
require_once __DIR__ . '/../banco/conexao.php';

$input = file_get_contents('php://input');
$dados = json_decode($input, true);

try {
    $codCliente = $_SESSION['CodCliente'] ?? null;
    if (!$codCliente) {
        throw new Exception('Usuário não autenticado');
    }

    $id = $dados['id'] ?? null;
    $tipo = $dados['tipo'] ?? null;
    $nome = trim($dados['nome'] ?? '');
    $valor = trim($dados['valor'] ?? '');

    if (!$id || !$tipo || !$nome) {
        throw new Exception('ID, tipo e nome são obrigatórios');
    }

    if ($tipo === 'fixa') {
        if (empty($valor) || !is_numeric($valor)) {
            throw new Exception('Valor inválido para gasto fixo');
        }

        $sql = "SELECT CodFixGR FROM FixGastoRenda WHERE CodFixGR = :id AND CodCliente = :codCliente";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id, ':codCliente' => $codCliente]);
        
        if (!$stmt->fetch()) {
            throw new Exception('Gasto não encontrado ou não pertence a você');
        }

        $sql = "UPDATE FixGastoRenda SET NomeFixGR = :nome, ValorFixGR = :valor WHERE CodFixGR = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':nome' => $nome, ':valor' => (float)$valor, ':id' => $id]);
    } elseif ($tipo === 'variavel') {
        $sql = "SELECT CodVarGR FROM VarGastoRenda WHERE CodVarGR = :id AND CodCliente = :codCliente";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id, ':codCliente' => $codCliente]);
        
        if (!$stmt->fetch()) {
            throw new Exception('Gasto não encontrado ou não pertence a você');
        }

        $sql = "UPDATE VarGastoRenda SET NomeVarGR = :nome WHERE CodVarGR = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':nome' => $nome, ':id' => $id]);
    } else {
        throw new Exception('Tipo inválido');
    }

    echo json_encode(['sucesso' => true, 'mensagem' => 'Gasto atualizado com sucesso']);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => $e->getMessage()]);
}
?>
