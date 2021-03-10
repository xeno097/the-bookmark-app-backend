import { ApolloServer, gql } from 'apollo-server-express';
import { DocumentNode } from 'graphql';
import { GqlCustomExecutionContext } from '../common/interfaces/graphql-custom-context.interface';

const typeDefs: DocumentNode[] = [
  gql`
    type Query {
      hello: String
    }
  `,
];

const apolloServer = new ApolloServer({
  context: ({ req, res }): GqlCustomExecutionContext => ({
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
