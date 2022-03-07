const express = require('express');
// +ka apollo server
const { ApolloServer } = require('apollo-server-express')
// +ka auth middleware
const {authMiddleware} = require('./utils/auth')

const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');


// +ka typedefs and resolvers
const { typeDefs, resolvers } = require('./schemas')


const app = express();
const PORT = process.env.PORT || 3001;

// +ka create new apollo server

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
  })

  server.applyMiddleware( {app} )

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`))
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
  ;
});
