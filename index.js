const { GraphQLServer } = require('graphql-yoga')
const {
  makeSchema,
  objectType,
  idArg,
  stringArg,
  booleanArg,
} = require('@nexus/schema')

const { PrismaClient } = require('@prisma/client')
const { nexusPrismaPlugin } = require('nexus-prisma')

const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id()
    t.model.title()
  },
})

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.crud.posts()
  },
})

const prisma = new PrismaClient()

const server = new GraphQLServer({
  schema: makeSchema({
    types: [Query, Post],
    plugins: [nexusPrismaPlugin()],
  }),
  context: req => ({ ...req, prisma }),
  middlewares: [],
})

server.start(
  {
    endpoint: '/graphql',
    playground: '/graphql',
    subscriptions: false,
    // cors: {
    //   credentials: true,
    //   origin: process.env.FRONTEND_URL,
    // },
  },
  () =>
    console.log(
      `🚀 Server ready at: http://localhost:4000\n⭐️ See sample queries: http://pris.ly/e/js/graphql#5-using-the-graphql-api`,
    ),
)
