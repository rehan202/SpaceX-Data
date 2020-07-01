import React, { Component } from 'react';
import Contacts from './contacts';
import {gridComponent} from '@syncfusion/ej2-react-grids';

class App extends Component {

  state = {
    contacts: []
  }
  componentDidMount() {
    fetch('https://api.spacexdata.com/v4/launches')
    .then(res => res.json())
    .then((data) => {
      this.setState({ contacts: data })
    })
    .catch(console.log)
  }
  render() {
    return (
      <Contacts contacts={this.state.contacts} />
    )
  }
  

}
export default App