const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  // -ka authMiddleware: function (req, res, next) {
    authMiddleware: function ({req}) {
      
    // allows token to be sent via  req.query or headers
    let token = req.body.token || req.headers.authorization || req.query.token;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      // -ka return res.status(400).json({ message: 'You have no token!' });
      return req
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
      // -ka return res.status(400).json({ message: 'invalid token!' });
    }
      return req

    // send to next endpoint
    // -ka next();
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
