export interface IAuthPayload {
  jwt: string;
  user: {
    username: string;
    email: string;
  };
}
