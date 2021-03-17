import { ApolloServer, gql } from 'apollo-server-express';
import { tagQueries, tagMutations } from '../api/tags/tag.resolver';
import { userMutations, userQueries } from '../api/users/user.resolver';
import { gqlContext } from './utils/gql-context.util';

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

  input SignInInput {
    username: String!
    password: String!
  }

  type Query {
    tag(input: GetOneTagInput!): Tag!
    tags: [Tag]

    self: User!
  }

  type Mutation {
    createTag(input: CreateTagInput!): Tag!
    updateTag(input: UpdateTagInput!): Tag!
    deleteTag(input: GetOneTagInput!): Tag!

    signUp(input: SignUpInput!): AuthPayload!
    signIn(input: SignInInput!): AuthPayload!
  }
`;

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
