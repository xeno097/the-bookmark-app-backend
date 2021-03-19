export interface IFilterBookmarks {
  start?: number;
  limit?: number;
  filter?: {
    userId?: string;
  };
}
