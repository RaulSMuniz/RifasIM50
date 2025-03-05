require("dotenv").config();

const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const GNRequest = require('./apis/gerencianet')

app.use(bodyParser.json());

app.set('view engine', 'ejs');
const viewsPath = path.join(__dirname, 'views');
app.set('views', viewsPath);

const reqGNAlready = GNRequest(
    {
        clientID: process.env.GN_CLIENT_ID,
        clientSecret: process.env.GN_CLIENT_SECRET
    }
);

app.get('/', async (req, res) => {
    const reqGN = await reqGNAlready;

    const dataCob = {
        calendario: {
            expiracao: 3600
        },
        valor: {
            original: '10.50'
        },
        chave: `${process.env.GN_CHAVE_PIX}`,
        solicitacaoPagador: 'Cobrança dos serviços prestados.'
    };

    const cobResponse = await reqGN.post('/v2/cob', dataCob);

    const qrcodeResponse = await reqGN.get(`v2/loc/${cobResponse.data.loc.id}/qrcode`);
    res.render('qrcode', { qrcodeImage: qrcodeResponse.data.imagemQrcode });
});

app.get('/cobrancas', async (req, res) => {
    const reqGN = await reqGNAlready;

    const cobResponse = await reqGN.get('/v2/cob?inicio=2021-02-15T16:01:35Z&fim=2025-03-05T03:11:00Z')
    res.send(cobResponse.data);
});

app.post('webhook(/pix)?', (req, res) => {
    console.log(req.body);
    res.send('200');
});

app.listen(8000, () => {
    console.log("Rodando na porta 8000.");
});


