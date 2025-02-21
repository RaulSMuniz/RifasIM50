const { connectDB } = require("../backend/server.js");

async function seedDB() {
    try {
        const db = await connectDB();
        const collection = db.collection("rifas");

        const rifas = [];

        for (i = 1; i <= 480; i++){
            rifas.push({
                numero: i,
                preco: 6,
                disponivel: true
            });
        };

        const result = await collection.insertMany(rifas);
        console.log(`${result.insertedCount} rifas inseridas com sucesso.`);
    } catch (err) {
        console.log("Error: " + err);
    };
};

seedDB();