import { ApolloServer, gql } from 'apollo-server-express';
import { tagQueries } from '../api/tags/tag.resolver';
import { GqlCustomExecutionContext } from '../common/interfaces/graphql-custom-context.interface';

const typeDefs = gql`
  type Tag {
    id: ID!
    name: String!
    slug: String!
  }

  input GetOneTagInput {
    id: ID
    slug: String
  }

  type Query {
    tag(input: GetOneTagInput!): Tag!
    tags: [Tag]
  }
`;

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
      ...tagQueries,
    },
  },
});

export { apolloServer };
