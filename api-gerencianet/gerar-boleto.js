const Gerencianet = require('gn-api-sdk-node');
const options = require('./credentials');

module.exports = {

  async gerarBoleto(pedido){

    // Gerar data de pagamento do boleto como data atual mais uma semana
    var date = new Date();
    date.setDate(date.getDate() + 7);
  
    const dateString = date.toISOString().split('T')[0];
  
    // Gerar e-mail genérico utilizando o nome do cliente
    const nomeSemAcento = pedido.cliente.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    const email = nomeSemAcento.toLowerCase().replace(/\s/g, "")+"@email.com";
  
    let body = {
    
      payment: {
        banking_billet: {
          expire_at: dateString, 
          customer: {
            name: pedido.cliente,
            email: email,
            cpf: '04267484171', 
            birth: '2000-01-01', 
            phone_number: '5144916523'
          }
        }
      },
    
      items: [{
        name: pedido.produto,
        value: parseInt(pedido.valor * 100, 10),
        amount: 1
      }],
    
      shippings: [{
        name: 'Frete Simples',
        value: 2000
      }]
    }
    
    const gerencianet = new Gerencianet(options);
    
    return gerencianet
      .createOneStepCharge({}, body)
      .then((resposta) => {
        return resposta;
      })
      .catch((error) => {
        console.log(error)
      })

  }

}

