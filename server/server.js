'use strict'

// Importações
const mraa    = require('mraa') // Módulo MRAA
const express = require('express') // Módulo do Express para servidor de arquivos
const app     = express()
const port    = process.env.PORT || 80
const server  = app.listen(port, () => console.log('Servidor iniciado! Na porta %s.', port)) // Iniciando o servidor Express
const io      = require('socket.io')(server) // Iniciando o servidor WebSocket na mesma porta do Express

app.use('/', express.static(__dirname + '/static')) // Disponibiliza os arquivos da pasta "static" no link raiz

let ledVerde = new mraa.Gpio(7) // seta led verde no pino 7
ledVerde.dir(mraa.DIR_OUT) // Diz que é de Saída
ledVerde.write(0) // Inicializa com saída 0

let ledAmarelo = new mraa.Pwm(6) // seta led amarelo no pino 6
ledAmarelo.enable(true) // Habilita a saída
ledAmarelo.write(0) // Inicializa com saída 0

let ledVermelho = new mraa.Pwm(5) // seta led vermelho no pino 5
ledVermelho.enable(true) // Habilita a saída
ledVermelho.write(0) // Inicializa com saída 0

let fan = new mraa.Pwm(3) // seta fan no pino 3
fan.enable(true) // Habilita a saída
fan.write(0) // Inicializa com saída 0

let sensorLuz = new mraa.Aio(0) // seta sensor de luz no pino 0

io.on('connection', conectado) // Evento executado quando um novo usuário se conecta
function conectado(socket) { // Função executada quando um novo usuário se conecta
  console.log('\nRequisição - ', new Date(), socket.id)
  let gerandoDados = undefined,
    dado = 0, // Zera o dado de leitura
    cont = 1, // Zera o contador do tempo
    luz = 1 // Reseta com fator 1 a luminosidade de saída

  socket.on('controle', controle) // Evento executado quando um usuário aperta no botão de controle
  function controle(msg) { // Função executada quando um usuário aperta no botão de controle
    if (msg.ligado) { // Verifica se o botão tá ligado ou não
      ledVerde.write(1) // Acende o led verde
      gerarDados(msg.curva) // Gera gráfico de acordo com a curva escolhida na interface
      gerandoDados = setInterval(() => gerarDados(msg.curva), 1000) // Inicia o loop de 1 em 1 segundo
    } else { // Quando apertar no botão para desligar
      clearInterval(gerandoDados) // Para o loop
      ledVerde.write(0) // Apaga o led verde
      ledAmarelo.write(0) // Apaga o led amarelo
      ledVermelho.write(0) // Apaga o led vermelho
      fan.write(0) // Desliga o cooler
      dado = 0 // Zera o dado de leitura
      cont = 0 // Zera o contador do tempo
      luz = 0 // Zera a luminosidade de saída
    }
  }

  socket.on('disconnect', () => { // Evento executado quando um usuário sai da interface, resetando todo os parâmetros
    if (gerandoDados) {
      clearInterval(gerandoDados) // Para o loop
      ledVerde.write(0) // Apaga o led verde
      ledAmarelo.write(0) // Apaga o led amarelo
      ledVermelho.write(0) // Apaga o led vermelho
      fan.write(0) // Desliga o cooler
      dado = 0 // Zera o dado de leitura
      cont = 0 // Zera o contador do tempo
      luz = 0 // Zera a luminosidade de saída
    }
  })

  function gerarDados(curva) { // Função que recebe a curva escolhida
    if (sensorLuz.read() < 100) { // Verfica o valor lido do sensor de luz e seta o fator de luminosidade e escreve no led amarelo
      luz = 1.5
      ledAmarelo.write(1)
    } else if (sensorLuz.read() < 300) {
      luz = 1
      ledAmarelo.write(0.5)
    } else {
      luz = 0.5
      ledAmarelo.write(0.2)
    }

    // Verfica a curva recebida e seta o valor de saída de acordo com o contador do tempo e seus intervalos
    if (curva === 0) { // Curva 0
      if (cont <= 30)
        dado = cont*luz
      else if (cont > 30 && cont <= 60)
        dado = 30*luz
      else if (cont > 60 && cont <= 90)
        dado = ((1.5*cont) - 60)*luz
      else if (cont > 90 && cont <= 120)
        dado = 75*luz
      else if (cont > 120 && cont <= 180)
        dado = (225 - ((5*cont)/4))*luz
      else
        dado = 0
    }
    else if (curva === 1) { // Curva 1
      if (cont <= 20)
        dado = cont*luz*2
      else if (cont > 20 && cont <= 30)
        dado = 3*cont*luz/2
      else if (cont > 30 && cont <= 70)
        dado = (40 - (cont/2))*luz
      else if (cont > 70 && cont <= 90)
        dado = cont/2
      else if (cont > 90 && cont <= 120)
        dado = (50 - (cont/3))*luz
      else if (cont > 120 && cont <= 180)
        dado = (100 - (cont/2))*luz
      else
        dado = 0
    }
    else if (curva === 2) { // Curva 2
      if (cont <= 40)
        dado = 50*luz
      else if (cont > 40 && cont <= 80)
        dado = (cont - 20)*luz
      else if (cont > 80 && cont <= 130)
        dado = 60*luz
      else if (cont > 130 && cont <= 180)
        dado = cont*luz/1.5 - 100
      else
        dado = 0
    }

    dado = dado.toFixed(1) // Pega o valor calculado e deixa com máximo 1 casa decimal
    console.log('Dado - ', dado)
    socket.emit('valor', dado) // Retorna para a interface o valor gerado
    ledVermelho.write(dado/100) // Escreve no led vermelho na escala entre 0 e 1
    fan.write(dado/100) // Escreve no fan na escala entre 0 e 1
    cont += 1 // Soma o contador + 1

    if (cont === 180) { // O contador vai até 180 segundos
      clearInterval(gerandoDados) // Para o loop
      ledVerde.write(0) // Apaga o led verde
      ledAmarelo.write(0) // Apaga o led amarelo
      ledVermelho.write(0) // Apaga o led vermelho
      fan.write(0) // Desliga o cooler
      dado = 0 // Zera o dado de leitura
      cont = 0 // Zera o contador do tempo
      luz = 0 // Zera a luminosidade de saída
    }
  }
}
