import React, { Component } from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider }  from 'react-apollo';
import TestRunScatterplot from './components/TestRunScatterplot/TestRunScatterplot';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000/scatterplot',
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      from: new Date('2018-04-01'),
      to: new Date('2018-04-08')
    }
  }

  handleDayClick = (day) => {
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState(range);
  }
  
  render() {
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };
   
    return (
      <ApolloProvider client={client}>
        <div class="App">
          <DayPicker
            className="Selectable"
            numberOfMonths={1}
            selectedDays={[from, { from, to }]}
            modifiers={modifiers}
            onDayClick={this.handleDayClick}
          />
          <TestRunScatterplot from={this.state.from} to={this.state.to}/>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
