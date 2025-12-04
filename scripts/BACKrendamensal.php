<?php
define('API_REQUEST', true);
require_once 'verificalogin.php';
require_once __DIR__ . '/../banco/conexao.php';

header('Content-Type: application/json; charset=utf-8');

// Receber dados em JSON
$input = file_get_contents('php://input');
$dados = json_decode($input, true);

// Validar se é um array
if (!is_array($dados) || empty($dados)) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Nenhum dado recebido']);
    exit;
}

try {

    // Pegar o ID do cliente logado da sessão
    $codCliente = $_SESSION['CodCliente'] ?? null;
    
    if ($codCliente === null) {
        throw new Exception('Usuário não autenticado');
    }

    $pdo->beginTransaction();
    $erros = [];

    // Inserir cada gasto
    foreach ($dados as $item) {
        $nome = trim($item['nome'] ?? '');
        $valor = trim($item['valor'] ?? '');
        $tipo = strtoupper(trim($item['tipo'] ?? ''));

        // Validações básicas
        if (empty($nome)) {
            $erros[] = 'Nome da renda não pode estar vazio';
            continue;
        }

        // Normalizar tipo
        if ($tipo === 'VARIÁVEL' || $tipo === 'VARIAVEL') {
            $tipo = 'RENDA';
            $tabela = 'VarGastoRenda';
            
            // Inserir em VarGastoRenda (só nome)
            $sql = "INSERT INTO VarGastoRenda (NomeVarGR, VarRenOuGas, CodCliente) 
                    VALUES (:nome, :tipo, :codCliente)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':nome' => $nome,
                ':tipo' => 'RENDA',
                ':codCliente' => $codCliente
            ]);

        } elseif ($tipo === 'FIXA' || $tipo === 'FIXO') {
            // Validar valor apenas para rendas fixas
            if (!preg_match('/^[0-9.,]+$/', $valor)) 
            {
                $erros[] = "Valor inválido para a renda fixa '{$nome}'";
                continue;
            }
            
            $tipo = 'RENDA';
            $tabela = 'FixGastoRenda';
            
            // Inserir em FixGastoRenda (nome + valor)
            $sql = "INSERT INTO FixGastoRenda (NomeFixGR, ValorFixGR, FixRenOuGas, CodCliente) 
                    VALUES (:nome, :valor, :tipo, :codCliente)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':nome' => $nome,
                ':valor' => (float)$valor,
                ':tipo' => 'RENDA',
                ':codCliente' => $codCliente
            ]);
        } else {
            $erros[] = "Tipo inválido para o gasto '{$nome}'. Use 'Fixa' ou 'Variável'";
        }
    }

    $pdo->commit();

    if (empty($erros)) {
        echo json_encode(['sucesso' => true, 'mensagem' => 'Renda salvos com sucesso']);
    } else {
        echo json_encode(['sucesso' => false, 'mensagem' => implode('; ', $erros)]);
    }

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro no banco de dados: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['sucesso' => false, 'mensagem' => $e->getMessage()]);
}
?>
