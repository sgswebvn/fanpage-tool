export interface Comment {
  commentId: string;
  postId: string;
  message: string;
  from: string;
  picture: string | null;
  created_time: string;
  parent_id?: string;
  hidden: boolean;
}