require("dotenv").config();

const fs = require("fs");
const express = require('express');
const app = express();

const path = require("path");
const axios = require('axios');
const certPath = fs.readFileSync(
    path.resolve(__dirname, `../../certs/${process.env.GN_CERT}`)
);
const https = require("https");

// Agent para identificar o certificado
const agent = new https.Agent({
    pfx: certPath,
    passphrase: ''
});
// Converter credenciais para Base64
const auth = Buffer.from(`${process.env.GN_CLIENT_ID}:${process.env.GN_CLIENT_SECRET}`).toString("base64");

app.set('view engine', 'ejs');
app.set('views', '../../backend/src/views')

app.get('/', (req, res) => {
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
    }).then((response) => {
        const accessToken = response.data?.access_token;

        const reqGN = axios.create({
            baseURL: process.env.GN_ENDPOINT,
            httpsAgent: agent,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })

        const dataCob = {
            calendario: {
                expiracao: 3600
            },
            valor: {
                original: '10.50'
            },
            chave: '126bec4a-2eb6-4b79-a045-78db68412899',
            solicitacaoPagador: 'Cobrança dos serviços prestados.'
        };


        reqGN.post('v2/cob', dataCob).then(response => res.send(response.data));
    });
});

app.listen(8000, () => {
    console.log("Rodando na porta 8000.");
});


