import { ApolloServer, gql } from 'apollo-server-express';
import { tagQueries, createTag, updateTag } from '../api/tags/tag.resolver';
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

  input CreateTagInput {
    name: String!
  }

  input UpdateTagPayload {
    name: String!
  }

  input UpdateTagInput {
    filter: GetOneTagInput!
    data: UpdateTagPayload!
  }

  type Query {
    tag(input: GetOneTagInput!): Tag!
    tags: [Tag]
  }

  type Mutation {
    createTag(input: CreateTagInput!): Tag!
    updateTag(input: UpdateTagInput!): Tag!
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
    Mutation: {
      createTag,
      updateTag,
    },
  },
});

export { apolloServer };
