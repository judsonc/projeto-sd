import React from 'react'
import {Col} from 'react-grid-system'
import Controle from './Controle'
import Grafico from './Grafico'
import {curvas} from '../dados'
import io from 'socket.io-client'

const socket = io(`http://${location.host}`)
socket.on('connect', () => console.log('Conectado!'))

class Historico extends React.Component {
  constructor() {
    super()
    this.state = {
      ligado: false,
      listaCurvas: curvas,
      valorCurva: 0,
      historico: {
        x: [],
        y: [],
      },
    }
    this.dados = undefined
  }

  componentDidMount() {
    socket.on('valor', this.handleControle)
  }

  handleClicado = () => {
    let msg = {
      ligado: !this.state.ligado,
      curva: this.state.valorCurva,
    }
    socket.emit('controle', msg)
    this.setState({
      ligado: !this.state.ligado,
    })
    if (this.state.ligado) {
      this.setState({
        historico: {
          x: [],
          y: [],
        },
      })
    }
  }

  handleControle = (valor) => {
    this.dados = this.state.historico
    this.dados.y.push(valor)
    this.dados.x.push(`${this.dados.y.length}s`)
    this.setState({
      historico: this.dados,
    })
  }

  handleChangeCurva = (event, index, valor) => {
    this.setState({
      valorCurva: valor,
    })
  }

  render() {
    return (
      <Col xs={12}>
        <Controle
          handleClicado={this.handleClicado}
          ligado={this.state.ligado}
          handleChangeCurva={this.handleChangeCurva}
          valorCurva={this.state.valorCurva}
          listaCurvas={this.state.listaCurvas}
        />
        <Grafico dados={this.state.historico} />
      </Col>
    )
  }
}

export default Historico
