export interface Todo {
  id?: number;
  title: string;
  body: string;
  media: string;
  status: 'todo' | 'done';
  created: string;
  edited: string;
  deleted: boolean;
  owner: string;
}
