const { AuthenticationError } = require('apollo-server-express')
const { User, Book } = require('../models')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {

        // get all users
        users: async () => {
            return User.find()
            .select('-__v -password')
            .populate('savedBooks')
        },

        // get one user by ID
        user: async (parent, { username }) => {
            return User.findOne({ username })
            .select('-__v -password')
            .populate('savedBooks')
        }   
    }
}

module.exports = resolvers;