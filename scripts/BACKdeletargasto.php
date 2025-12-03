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

    if (!$id || !$tipo) {
        throw new Exception('ID e tipo são obrigatórios');
    }

    if ($tipo === 'fixa') {
        // Verificar se o gasto pertence ao cliente
        $sql = "SELECT CodFixGR FROM FixGastoRenda WHERE CodFixGR = :id AND CodCliente = :codCliente";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id, ':codCliente' => $codCliente]);
        
        if (!$stmt->fetch()) {
            throw new Exception('Gasto não encontrado ou não pertence a você');
        }

        $sql = "DELETE FROM FixGastoRenda WHERE CodFixGR = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

    } elseif ($tipo === 'variavel') {
        // Verificar se o gasto pertence ao cliente
        $sql = "SELECT CodVarGR FROM VarGastoRenda WHERE CodVarGR = :id AND CodCliente = :codCliente";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id, ':codCliente' => $codCliente]);
        
        if (!$stmt->fetch()) {
            throw new Exception('Gasto não encontrado ou não pertence a você');
        }

        $sql = "DELETE FROM VarGastoRenda WHERE CodVarGR = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
    } else {
        throw new Exception('Tipo inválido');
    }

    echo json_encode(['sucesso' => true, 'mensagem' => 'Gasto excluído com sucesso']);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => $e->getMessage()]);
}
?>
