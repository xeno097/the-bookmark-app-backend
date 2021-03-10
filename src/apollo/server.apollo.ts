import { ApolloServer, gql } from 'apollo-server-express';

const typeDefs = [
  gql`
    type Query {
      hello: String
    }
  `,
];

const apolloServer = new ApolloServer({
  context: ({ req, res }) => ({
    req,
    res,
    auth: 'test',
  }),
  playground: true,
  typeDefs,
  resolvers: {
    Query: {
      hello: (parent, args, context, info) => {
        console.log(args);
        console.log(context);
        return 'Henlo';
      },
    },
  },
});

export { apolloServer };
