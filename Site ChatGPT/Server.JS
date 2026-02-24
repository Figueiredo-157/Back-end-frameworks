const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Conectar ao banco
const db = new sqlite3.Database("./database.db");

// Criar tabela se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`);

// Rota para listar usuários
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

// Rota para criar usuário
app.post("/users", (req, res) => {
  const { name } = req.body;

  db.run("INSERT INTO users (name) VALUES (?)", [name], function (err) {
    if (err) {
      return res.status(500).json(err);
    }
    res.json({ id: this.lastID, name });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
