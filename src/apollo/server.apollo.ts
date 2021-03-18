import { ApolloServer, gql } from 'apollo-server-express';
import { tagQueries, tagMutations } from '../api/tags/tag.resolver';
import { userMutations, userQueries } from '../api/users/user.resolver';
import { typeDefs } from './schema';
import { gqlContext } from './utils/gql-context.util';

const apolloServer = new ApolloServer({
  context: gqlContext,
  playground: true,
  typeDefs,
  resolvers: {
    Query: {
      ...tagQueries,
      ...userQueries,
    },
    Mutation: {
      ...tagMutations,
      ...userMutations,
    },
  },
});

export { apolloServer };
