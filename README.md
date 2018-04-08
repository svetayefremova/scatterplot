# Coding Challenge

## Front-end 

This front-end part uses D3.js and React. Project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

### Features

This Scatterplot is mock-up which represents data visualization. X-axis represents a timeline. Y-axis represents a duration. Component dimensions adapt to container size. Dots with status in the appropriate color appear on the scatterplot. Each dot has selected styles.

## Back-end service API

This back-end service uses Facebook's GraphQL and Express.js.

GraphQL is a query language for APIs and provides an alternative to REST.

### Features

This simple service API returns a list of plotpoints regarding to the template provided by the document. The number of items in the list, as well as start and ending date can be parameterized using some specific arguments. Also the values for start and ending duration time is adjustable. All returned values are randomized between their specified range.

## Getting started

To install and run the front-end and back-end service just install the necessary Node.js modules using **yarn**.

```
yarn install 
```

## Starting the client

```
yarn start
```

## Starting the service API

```
cd server
node server.js
```

If the back-end service is started you can also use GraphiQL to verfiy the API is up and running correctly by using following URL: ```http://localhost:4000/scatterplot```

Use following query as an example to check results from service API:
```
{
  plotpoints(
    startDate: "2018-04-01",
    endDate: "2018-04-08",
    startDuration: 0,
    endDuration: 300) {
      start_time,
      status,
      duration
  }
}
```

Short description of arguments:

|Name|Type|Descriptions|
|-|:-:|:-:|
|points|int|Number of plotpoints which will be returned|
|startDate|string|Start date of plotpoints in format **YYYY-MM-DD**|
|endDate|string|End date of plotpoints in format **YYYY-MM-DD**|
|startDuration|int|Start of the duration time (in secs)|
|endDuration|int|End of the duration time (in secs)|