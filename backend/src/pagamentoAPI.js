require("dotenv").config();

const fs = require("fs");
const path = require("path");
const axios = require('axios');
const fetch = require("node-fetch");

const certPath = fs.readFileSync(
    path.resolve(__dirname, `../certs/${process.env.GN_CERT}`)
);
const https = require("https");

// Agent para identificar o certificado
const agent = new https.Agent({
    pfx: certPath,
    passphrase: ''
});
// Converter credenciais para Base64
const auth = Buffer.from(`${process.env.GN_CLIENT_ID}:${process.env.GN_CLIENT_SECRET}`).toString("base64");

axios({
    method: 'POST',
    url: `${process.env.GN_ENDPOINT}/oauth/token`,
    headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json'
    },
    httpsAgent: agent,
    data: {
        grant_type: "client_credentials",

    }
}).then(console.log)
