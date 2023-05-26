// Importação das dependências
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

// Importação do Gerador de Boletos
const GeradorBoleto = require('./api-gerencianet/gerar-boleto');

// Configuração do express
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint para registro de um pedido
app.post('/novopedido', async (req, res) => {
  const pedido = req.body;

  const pedidos = JSON.parse(fs.readFileSync('pedidos.json'));

  let novoPedido = {id: pedidos.length + 1, ...pedido};

  const info_boleto = await GeradorBoleto.gerarBoleto(novoPedido);

  novoPedido = {... novoPedido, link_cobranca: info_boleto.data.link, pdf: info_boleto.data.pdf.charge}

  pedidos.push(novoPedido);
  fs.writeFileSync('pedidos.json', JSON.stringify(pedidos));

  // Salvar os dados do pedido no banco de dados ou arquivo
  res.status(201).json(novoPedido);
});

// Endpoint para listar todos os pedidos registrados
app.get('/pedidos', (req, res) => {
  // Buscar todos os pedidos no banco de dados ou arquivo
  const pedidos = JSON.parse(fs.readFileSync('pedidos.json'));
  res.status(200).json(pedidos);
});

// Endpoint para buscar um pedido pelo seu ID
app.get('/pedidos/:id', (req, res) => {
    const pedidos = JSON.parse(fs.readFileSync('pedidos.json'));
    const pedido = pedidos.find(pedido => pedido.id === parseInt(req.params.id));

    if(!pedido){
        res.status(404).json({mensagem: 'Pedido não encontrado.'});
    } else {
        // Buscar o pedido pelo ID no banco de dados ou arquivo
        res.status(200).json({ pedido: pedido });
    }
});

// Inicialização do servidor
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
