import React, { Component } from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider }  from 'react-apollo';
import DayPicker, { DateUtils } from 'react-day-picker';
import TestRunScatterplot from './components/TestRunScatterplot/TestRunScatterplot';
import 'react-day-picker/lib/style.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000/scatterplot',
});

class App extends Component {
  constructor() {
    super();
    // get currentDate (this will be our end date in the range) 
    //using format: YYYY-MM-DDTHH:MM:SSZ
    const currentDate = new Date();
    // calculate 7 days before current date (this will be our start date in the range)
    // using format: YYYY-MM-DDTHH:MM:SSZ
    const startDate = new Date(currentDate.getTime() - 7 * 86400000);
    this.state = {
      from: startDate,
      to: currentDate
    }
  }

  handleDayClick = (day) => {
    const range = DateUtils.addDayToRange(day, this.state);
    //change selected range of dates in scatterplot
    this.setState(range);
  }
  
  render() {
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };
   
    return (
      <ApolloProvider client={client}>
        <div>
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
