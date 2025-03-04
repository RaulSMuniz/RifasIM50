const fs = require("fs");
const path = require("path");
const axios = require('axios');
const https = require("https");

const certPath = fs.readFileSync(
    path.resolve(__dirname, `../../../certs/${process.env.GN_CERT}`)
);
// Agent para identificar o certificado
const agent = new https.Agent({
    pfx: certPath,
    passphrase: ''
});


const authenticate = ({ clientID, clientSecret }) => {
    // Converter credenciais para Base64
    const auth = Buffer.from(`${clientID}:${clientSecret}`).toString("base64");

    return axios({
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
    })
};

const GNRequest = async (credentials) => {
    const authResponse = await authenticate(credentials);
    const accessToken = authResponse.data?.access_token;

    return axios.create({
        baseURL: process.env.GN_ENDPOINT,
        httpsAgent: agent,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
};

module.exports = GNRequest