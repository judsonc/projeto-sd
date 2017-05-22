import React from 'react'
import {Col, Row} from 'react-grid-system'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import {paper, botaoControle} from '../assets/style'

class Controle extends React.Component {
  render() {
    let listaCurvas = this.props.listaCurvas.map(curva => <MenuItem key={curva.id} value={curva.id} primaryText={curva.nome} />)
    return (
      <Paper style={paper}>
        <Row>
          <Col xs={12} sm={6}>
            <SelectField
              floatingLabelText="Curva de fluxo de ar"
              floatingLabelFixed={true}
              value={this.props.valorCurva}
              onChange={this.props.handleChangeCurva}
              autoWidth={true}
              disabled={this.props.ligado}
            >
              {listaCurvas}
            </SelectField>
          </Col>
          <Col xs={12} sm={6} style={botaoControle}>
            <RaisedButton onTouchTap={this.props.handleClicado} primary={true} label={(this.props.ligado) ? 'Desligar' : 'Ligar'} />
          </Col>
        </Row>
      </Paper>
    )
  }
}

export default Controle
