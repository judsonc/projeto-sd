import React from 'react'
import RC2 from 'react-chartjs2'
import Paper from 'material-ui/Paper'
import {paper} from '../assets/style'

class Grafico extends React.Component {
  render() {
    const data = {
      labels: this.props.dados.x,
      datasets: [
        {
          label: 'Fluxo de Ar',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(1,87,155,0.8)',
          borderColor: 'rgba(1,87,155,0.8)',
          hoverBackgroundColor: 'rgba(1,87,155,0.6)',
          hoverBorderColor: 'rgba(1,87,155,0.6)',
          borderWidth: 0,
          data: this.props.dados.y,
        },
      ],
    }

    return (!data.labels.length) ? null : (
      <Paper style={paper}>
        <RC2 data={data} type="line" />
      </Paper>
    )
  }
}

export default Grafico
