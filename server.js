import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';

const app = express();
const __dirname = path.resolve();

// Gerar certificados locais autoassinados (veja abaixo como criar)

const options = {
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem')
};

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar servidor HTTPS
https.createServer(options, app).listen(5500, () => {
  console.log('Servidor HTTPS rodando em https://localhost:5500');
});