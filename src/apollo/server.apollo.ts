import { ApolloServer, gql } from 'apollo-server-express';
import { tagQueries, tagMutations } from '../api/tags/tag.resolver';
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

  type User {
    username: String!
    email: String!
  }

  type AuthPayload {
    jwt: String!
    user: User!
  }

  input SignUpInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Query {
    tag(input: GetOneTagInput!): Tag!
    tags: [Tag]
  }

  type Mutation {
    createTag(input: CreateTagInput!): Tag!
    updateTag(input: UpdateTagInput!): Tag!
    deleteTag(input: GetOneTagInput!): Tag!

    signUp(input: SignUpInput!): AuthPayload!
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
      ...tagMutations,
    },
  },
});

export { apolloServer };
