import React from 'react'
import {Row, Col} from 'react-grid-system'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Grafico from './Grafico'
import {paper, botaoControle} from '../assets/style'
import {curvas} from '../dados'

class Historico extends React.Component {
  constructor() {
    super()
    this.state = {
      ligado: false,
      listaCurvas: [],
      valorCurva: 0,
      historico: {
        x: [],
        y: [],
      },
    }
    this.gerandoDados = undefined
  }

  componentDidMount() {
    this.setState({
      listaCurvas: curvas,
    })
  }

  handleClicado = () => {
    this.setState({
      ligado: !this.state.ligado,
    })
    this.handleControle()
  }

  handleControle = () => {
    console.log((this.state.ligado) ? 'Desligou' : 'Ligou')
    // Isso tudo será tirado pra receber do servidor
    if (!this.state.ligado) {
      const dados = {
        x: [],
        y: [],
      }
      this.gerandoDados = setInterval(() => {
        dados.x.push(`${dados.y.length}s`)
        dados.y.push(Math.round(Math.random() * 100))
        this.setState({
          historico: dados
        })
        if (dados.y.length === 300) {
          clearInterval(this.gerandoDados)
        }
      }, 1000)
    } else {
      clearInterval(this.gerandoDados)
    }
  }

  handleChangeCurva = (event, index, valor) => {
    console.log('Trocou de curva: ', valor)
    this.setState({
      valorCurva: valor,
    })
  }

  render() {
    const listaCurvas = this.state.listaCurvas.map(curva => <MenuItem key={curva.id} value={curva.id} primaryText={curva.nome} />)
    const grafico = (this.state.ligado) ? <Grafico dados={this.state.historico} /> : null
    return (
      <Col xs={12}>
        <Paper style={paper}>
          <Row>
            <Col xs={12} sm={6}>
              <SelectField
                floatingLabelText="Curva de fluxo de ar"
                floatingLabelFixed={true}
                value={this.state.valorCurva}
                onChange={this.handleChangeCurva}
                autoWidth={true}
                disabled={this.state.ligado}
              >
                {listaCurvas}
              </SelectField>
            </Col>
            <Col xs={12} sm={6} style={botaoControle}>
              <RaisedButton onTouchTap={this.handleClicado} primary={true} label={(this.state.ligado) ? "Desligar" : "Ligar"} />
            </Col>
          </Row>
        </Paper>
        {grafico}
      </Col>
    )
  }
}

export default Historico
