//Parte responsável por criar o servidor e conecta-lo ao banco de dados
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost', // local onde o servidor ficará hospedado
    user: 'root', // seu usuário MySQL
    database: 'StockCar' // nome do banco de dados
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados.');
});

//Parte de cadastros (clientes, telefones e carros)
// Criar clientes
app.post('/clientes', (req, res) => {
    const { nome, cpf, email, endereco, data_nascimento, data_cadastro } = req.body;
    const sql = 'INSERT INTO clientes (nome, cpf, email, endereco, data_nascimento, data_cadastro) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(sql, [nome, cpf, email, endereco, data_nascimento, data_cadastro], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ insertedId: result.insertId });
    });
});

// Listar clientes
app.get('/clientes', (req, res) => {
    db.query('SELECT * FROM clientes', (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(results);
    });
});

// Atualizar cliente
app.put('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const { nome, cpf, email, endereco, data_nascimento, data_cadastro } = req.body;
    const sql = 'UPDATE clientes SET nome = ?, cpf = ?, email = ?, endereco = ?, data_nascimento = ?, data_cadastro = ? WHERE cliente_id = ?';

    db.query(sql, [nome, cpf, email, endereco, data_nascimento, data_cadastro, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ message: `Cliente com ID ${id} atualizado com sucesso.` });
    });
});

// Deletar um cliente
app.delete('/clientes/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM clientes WHERE cliente_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ message: `Cadastro do cliente com ID ${id} deletado com sucesso.` });
    });
});

// Criar telefone
app.post('/telefones', (req, res) => {
    const { cliente_id, numero, tipo } = req.body; // Mantenha apenas 'tipo'
    const sql = 'INSERT INTO telefone (cliente_id, numero, tipo) VALUES (?, ?, ?)';
    db.query(sql, [cliente_id, numero, tipo], (err, result) => {
        if (err) {
            console.error(err); // Log do erro para ajudar na depuração
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ insertedId: result.insertId });
    });
});

// Listar telefones
app.get('/telefones', (req, res) => {
    db.query('SELECT * FROM telefone', (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(results);
    });
});

// Atualizar telefone
app.put('/telefones/:id', (req, res) => {
    const { id } = req.params;
    const { cliente_id, numero, tipo } = req.body;
    const sql = 'UPDATE telefone SET cliente_id = ?, numero = ?, tipo enum = ? WHERE telefone_id = ?';

    db.query(sql, [cliente_id, numero, tipo, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ message: `Telefone com ID ${id} atualizado com sucesso.` });
    });
});

// Deletar telefone
app.delete('/telefones/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM telefone WHERE telefone_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ message: `Telefone com ID ${id} deletado com sucesso.` });
    });
});

// Criar quarto
app.post('/carros', (req, res) => {
    const { marca_veiculo, modelo_veiculo, ano_veiculo, fabricacao_veiculo, cliente_id } = req.body;
    const sql = 'INSERT INTO carros (marca_veiculo, modelo_veiculo, ano_veiculo, fabricacao_veiculo, cliente_id) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [marca_veiculo, modelo_veiculo, ano_veiculo, fabricacao_veiculo, cliente_id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ insertedId: result.insertId });
    });
});

// Listar quartos
app.get('/carros', (req, res) => {
    db.query('SELECT * FROM carros', (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(results);
    });
});

// Atualizar quarto
app.put('/carros/:id', (req, res) => {
    const { id } = req.params;
    const { marca_veiculo, modelo_veiculo, ano_veiculo, fabricacao_veiculo, cliente_id } = req.body;
    const sql = 'UPDATE carros SET marca_veiculo = ?, modelo_veiculo = ?, ano_veiculo = ?, fabricacao_veiculo, cliente_id = ? WHERE carro_id = ?';

    db.query(sql, [marca_veiculo, modelo_veiculo, ano_veiculo, fabricacao_veiculo, cliente_id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ message: `Carro com ID ${id} atualizado com sucesso.` });
    });
});

// Deletar quarto
app.delete('/carros/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM carros WHERE carro_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ message: `Carro com ID ${id} deletado com sucesso.` });
    });
});

app.listen(port, () => {
    console.log(`API rodando no http://localhost:${port}`);
});