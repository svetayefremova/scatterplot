const express = require('express');
const graphqlHTTP = require('express-graphql');
const { GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt } = require('graphql');
const cors = require('cors');

const statusList = ['pass', 'error', 'fail'];

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
};

const plotpointsType = new GraphQLObjectType({
  name: 'plotpoints',
  fields: {
    start_time: { type: GraphQLString },
    status: { type: GraphQLString },
    duration: { type: GraphQLInt }
  }
});

const queryType = new GraphQLObjectType({
  name: 'rootQuery',
  fields: {
    plotpoints: {
      type: new GraphQLList(plotpointsType),
      args: {
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString },
        startDuration: { type: GraphQLInt },
        endDuration: { type: GraphQLInt }
      },
      resolve: (_, args) => {
        const startDate = new Date(args.startDate),
              endDate = new Date(args.endDate),
              days = (endDate.getTime() - startDate.getTime()) / (60 * 60 * 24) / 1000 + 1,
              result = [];

        for (var d = 0; d < days; ++d) {
          const randomPoints = getRandomInt(2, 8);

          for (var p = 0; p < randomPoints; ++p) {
            const randomDate = new Date(getRandomInt(startDate.getTime(), endDate.getTime()));

            result.push({
              // get random dates between "startDate" and "endDate" using format: YYYY-MM-DDTHH:MM:SSZ
              start_time: randomDate.toISOString().slice(0, -5) + 'Z',
              // get random value for a list of ["pass", "error", "fail"]
              status: statusList[getRandomInt(0, 3)],
              // get random value between "startDuration" and "endDuration"
              duration:getRandomInt(args.startDuration, args.endDuration)
            });
          }
        }

        return result;
      }
    }
  }
});

const app = express();

app.use('/scatterplot', cors(), graphqlHTTP({
  schema: new GraphQLSchema({ query: queryType }),
  graphiql: true,
}));

app.listen(4000);

console.log('Running a GraphQL API server at localhost:4000/scatterplot');