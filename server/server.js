const express = require('express');
const path = require('path');
const db = require('./config/connection');
// -ka no need for routes anymore
// const routes = require('./routes');

// +ka apollo server
const { ApolloServer } = require('apollo-server-express')
// +ka typedefs and resolvers
const { typeDefs, resolvers } = require('./schemas')
// +ka auth middleware
const { authMiddleware } = require('./utils/auth')

const app = express();
const PORT = process.env.PORT || 3001;

// +ka create new apollo server
const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
  })
  await server.start()
  server.applyMiddleware( {app} )
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
}

// +ka initialize Apollo server
startServer ()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// -ka no longer using routes
// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
