export interface Comment {
  id: string;
  postId: string;
  message: string;
  from: {
    id?: string;
    name: string;
  };
  created_time: string;
  parent_id?: string;
}
