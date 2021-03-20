import { gql } from 'apollo-server-express';

export const typeDefs = gql`
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

  type Bookmark {
    id: String!
    name: String!
    description: String
    tags: [Tag]!
    url: String!
  }

  input GetOneBookmarkInput {
    id: String!
  }

  input FilterBookmarksInput {
    start: Int
    limit: Int
  }

  type Query {
    tag(input: GetOneTagInput!): Tag!
    tags: [Tag]

    self: User!

    bookmark(input: GetOneBookmarkInput!): Bookmark!
    bookmarks(input: FilterBookmarksInput): [Bookmark]!
  }

  type Mutation {
    createTag(input: CreateTagInput!): Tag!
    updateTag(input: UpdateTagInput!): Tag!
    deleteTag(input: GetOneTagInput!): Tag!

    signUp(input: SignUpInput!): AuthPayload!
    signIn(input: SignInInput!): AuthPayload!
    signOut: Boolean!

    deleteBookmark(input: GetOneTagInput!): Bookmark!
  }
`;
