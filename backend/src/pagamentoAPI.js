require("dotenv").config();

const fs = require("fs");
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

    const endpoint = `${process.env.GN_ENDPOINT}/v2/cob`

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

    const config = {
        httpsAgent: agent,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };

    axios.post(endpoint, dataCob, config).then(response => console.log(response.data));
})
