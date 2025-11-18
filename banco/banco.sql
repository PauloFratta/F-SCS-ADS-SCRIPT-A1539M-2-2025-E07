CREATE DATABASE IF NOT EXISTS contador_digitalDB;
USE contador_digitalDB;

CREATE TABLE IF NOT EXISTS Clientes (
    CodCliente INT PRIMARY KEY AUTO_INCREMENT,
    NomeCliente VARCHAR(100) NOT NULL,
    EmailCliente VARCHAR(100) NOT NULL UNIQUE,
    SenhaCliente VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS VarGastoRenda (
    CodVarGR INT PRIMARY KEY AUTO_INCREMENT,
    NomeVarGR VARCHAR(100) NOT NULL,
    VarRenOuGas CHAR(5) NOT NULL CHECK (VarRenOuGas IN ('RENDA', 'GASTO')),
    CodCliente INT,
    FOREIGN KEY (CodCliente) REFERENCES Clientes(CodCliente)
);

CREATE TABLE IF NOT EXISTS FixGastoRenda (
    CodFixGR INT PRIMARY KEY AUTO_INCREMENT,
    NomeFixGR VARCHAR(100) NOT NULL,
    ValorFixGR DECIMAL(10,2) NOT NULL,
    FixRenOuGas CHAR(5) NOT NULL CHECK (FixRenOuGas IN ('RENDA', 'GASTO')),
    CodCliente INT,
    FOREIGN KEY (CodCliente) REFERENCES Clientes(CodCliente)
);

CREATE TABLE IF NOT EXISTS Analise(
    CodAnalise INT PRIMARY KEY AUTO_INCREMENT,
    DiaAnalise TEXT NOT NULL,
    MesAnalise TEXT NOT NULL,
    AnoAnalise TEXT NOT NULL,
    CodFixGR INT,
    CodVarGR INT,
    Receita DECIMAL(10,2) NOT NULL,
    Despesa DECIMAL(10,2) NOT NULL,
    ValLucroPreju DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (CodFixGR) REFERENCES FixGastoRenda(CodFixGR),
    FOREIGN KEY (CodVarGR) REFERENCES VarGastoRenda(CodVarGR)
);

CREATE TABLE IF NOT EXISTS ValorValGRAnalise (
    CodVarGR INT,
    CodAnalise INT,
    ValorVarGR DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (CodVarGR, CodAnalise),
    FOREIGN KEY (CodVarGR) REFERENCES VarGastoRenda(CodVarGR),
    FOREIGN KEY (CodAnalise) REFERENCES Analise(CodAnalise)
)