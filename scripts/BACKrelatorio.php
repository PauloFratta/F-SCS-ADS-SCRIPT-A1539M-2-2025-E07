<?php
    require_once __DIR__ . '/../banco/conexao.php';

    try 
    {
        session_start();

        // Pegar o ID do cliente logado da sessão
        $codCliente = $_SESSION['CodCliente'] ?? null;
        
        if ($codCliente === null) 
        {
            throw new Exception('Usuário não autenticado');
        }

        // Consultar gastos fixos
        $sqlFixo = "SELECT NomeFixGR, ValorFixGR, FixRenOuGas
                    FROM FixGastoRenda
                    WHERE CodCliente = :codCliente AND FixRenOuGas = 'GASTO'";

        $stmtFixo = $pdo->prepare($sqlFixo);
        $stmtFixo->execute([':codCliente' => $codCliente]);
        $gastosFixos = $stmtFixo->fetchAll(PDO::FETCH_ASSOC);

        // Consultar gastos variáveis
        $sqlVariavel = "SELECT NomeVarGR, VarRenOuGas
                        FROM VarGastoRenda
                        WHERE CodCliente = :codCliente AND VarRenOuGas = 'GASTO'";

        $stmtVariavel = $pdo->prepare($sqlVariavel);
        $stmtVariavel->execute([':codCliente' => $codCliente]);
        $gastosVariaveis = $stmtVariavel->fetchAll(PDO::FETCH_ASSOC);

        // Combinar ambos os tipos de gastos
        $todosGastos = array_merge($gastosFixos, $gastosVariaveis);

        // Consultar rendas fixas
        $sqlRendaFixa = "SELECT NomeFixGR, ValorFixGR, FixRenOuGas
                        FROM FixGastoRenda
                        WHERE CodCliente = :codCliente AND FixRenOuGas = 'RENDA'";
        
        $stmtRendaFixa = $pdo->prepare($sqlRendaFixa);
        $stmtRendaFixa->execute([':codCliente' => $codCliente]);
        $rendasFixas = $stmtRendaFixa->fetchAll(PDO::FETCH_ASSOC);

        // Consultar rendas variáveis
        $sqlRendaVariavel = "SELECT NomeVarGR, VarRenOuGas
                            FROM VarGastoRenda
                            WHERE CodCliente = :codCliente AND VarRenOuGas = 'RENDA'";
        
        $stmtRendaVariavel = $pdo->prepare($sqlRendaVariavel);
        $stmtRendaVariavel->execute([':codCliente' => $codCliente]);
        $rendasVariaveis = $stmtRendaVariavel->fetchAll(PDO::FETCH_ASSOC);

        // Combinar ambos os tipos de rendas
        $todasRendas = array_merge($rendasFixas, $rendasVariaveis);

        // Retornar os dados em JSON
        header('Content-Type: application/json');
        echo json_encode(['sucesso' => true, 'gastos' => $todosGastos, 'rendas' => $todasRendas]);
    } 
    catch (PDOException $e) 
    {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro no banco de dados: ' . $e->getMessage()]);
    }
    catch (Exception $e) 
    {
        http_response_code(401);
        echo json_encode(['sucesso' => false, 'mensagem' => $e->getMessage()]);
    }
?>