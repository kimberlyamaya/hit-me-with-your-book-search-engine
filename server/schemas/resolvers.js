const { AuthenticationError } = require('apollo-server-express')
const { User, Book } = require('../models')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {

        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('savedBooks')

                return userData
            }

            throw new AuthenticationError('Not logged in')
        },


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
        }, 
    },

    Mutation: {
            addUser: async (parent, args) => {
                console.log('*****resolvers.38******')
                const user = await User.create(args)
                const token = signToken(user)
    
                return { token, user }
            },
    
            login: async (parent, { email, password }) => {
                const user = await User.findOne({ email })
    
                if (!user) {
                    throw new AuthenticationError('Incorrect credentials');
                  }
    
                  const correctPw = await user.isCorrectPassword(password);
    
                  if (!correctPw) {
                    throw new AuthenticationError('Incorrect credentials');
                  }
    
                  const token = signToken(user);
                  return { token, user };
            }
        }
}

module.exports = resolvers;