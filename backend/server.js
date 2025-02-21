const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const uri = process.env.URI;
const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());

// Conexão única com o banco de dados
let db;

async function connectDB() {
    try {
        if (!db) {
            await client.connect();
            console.log("Database connected.");
            db = client.db("rifasDB");
            console.log("rifasDB database selected.");
        }
        return db;
    } catch (err) {
        console.log("Error: " + err);
    }
}

// Middleware para disponibilizar a conexão com o DB
app.use(async (req, res, next) => {
    req.db = await connectDB();
    next();
});

// Rota inicial
app.get("/", (req, res) => {
    res.send("Server connected to MongoDB Atlas.");
});

// Rota para obter rifas disponíveis
app.get("/rifas", async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("rifas");
        const rifas = await collection.find({ disponivel: true }).toArray();
        res.json(rifas);
    } catch (err) {
        console.log("Error: " + err);
        res.status(500).json({ message: "Rifas obtainment failed." });
    }
});

app.listen(port, () => {
    console.log(`Rodando na porta: ${port}`);
});

module.exports = { client, connectDB };
