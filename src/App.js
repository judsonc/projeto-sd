import React from 'react'
import {Container, Row} from 'react-grid-system'
import injectTapEventPlugin from 'react-tap-event-plugin'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import Historico from './components/Historico'
import ModalAbertura from './components/ModalAbertura'
import {
  lightBlue500, lightBlue700, lightBlue900,
  grey200, grey300, grey400, grey500, grey700,
  white,
} from 'material-ui/styles/colors'

const muiTheme = getMuiTheme({
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: lightBlue900,
    primary2Color: lightBlue700,
    primary3Color: grey400,
    accent1Color: lightBlue500,
    accent2Color: grey200,
    accent3Color: grey500,
    textColor: grey700,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    pickerHeaderColor: lightBlue500,
    shadowColor: grey700,
  },
})

injectTapEventPlugin()

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar
            showMenuIconButton={false}
            title="Projeto SD"
          />
          <Container>
            <Row>
              <Historico />
            </Row>
          </Container>
          <ModalAbertura />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App
