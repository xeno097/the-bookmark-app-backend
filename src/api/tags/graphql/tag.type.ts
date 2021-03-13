import { gql } from 'apollo-server-express';

export const TagType = gql`
  type Tag {
    id: ID!
    name: String!
    slug: String!
  }
`;
