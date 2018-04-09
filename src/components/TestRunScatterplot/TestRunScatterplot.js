import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { extent } from 'd3-array';
import Scatterplot from '../Scatterplot/Scatterplot';

// use query to get random data
const query = gql`
  query plotpoints($startDate: String!, $endDate: String!) {
    plotpoints(
      startDate: $startDate,
      endDate: $endDate,
      startDuration: 0,
      endDuration: 300) {
      start_time
      status
      duration
    }
  }
`;

class TestRunScatterplot extends Component {
  componentWillReceiveProps(newProps) {
    if (!newProps.data.loading) {
      // when fetching of random data is finished format objects of data to apropriate values
      const data = this.formatData(newProps.data.plotpoints);
      // find maximum and minimum date in the list
      const domain = extent(data, d => d.start_time);
      this.setState({
        from: domain[0],
        to: domain[1]
      }) 
    }

    if (newProps.from !== this.props.from || newProps.to !== this.props.to)  {
      this.props.data.refetch({
         varibles: {
          startDate: newProps.from,
          endDate: newProps.to
        }
      });
    }
  }

  // use this method to format fetching data
  formatData = (data, start, end) => {
    const newData = [];
    data.forEach((d) => {
      newData.push({
        start_time: new Date(d.start_time), // format start_time to full text string format (example Wed Mar 25 2015 01:00:00 GMT+0100 (CET)
        duration: d.duration / 60, // fromat seconds in minutes
        status: d.status
      })
    });
    return newData;
  }

  render() {
    const { error, loading, plotpoints } = this.props.data;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    
    return (
      <Scatterplot 
        data={this.formatData(plotpoints)}
        from={this.props.from} 
        to={this.props.to} 
      />
    );
  }
}

export default graphql(query, {
  options: (ownProps) => ({
    variables: {
      startDate: ownProps.from,
      endDate: ownProps.to
    }
  })
})(TestRunScatterplot);