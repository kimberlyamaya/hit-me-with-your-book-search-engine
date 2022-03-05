const express = require('express');
const path = require('path');
const db = require('./config/connection');
// no longer need routes
// const routes = require('./routes');
// apollo server
const { ApolloServer } = require('apollo-server-express')
// typedefs and resolvers
const { typeDefs, resolvers } = require('./schemas')
// auth middleware
const { authMiddleware } = require('./utils/auth')

const app = express();
const PORT = process.env.PORT || 3001;

// create new apollo server
const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
  })
  // await server.start()
  server.applyMiddleware( {app} )
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
}

// initialize Apollo server
startServer ()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// no longer using routes
// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
