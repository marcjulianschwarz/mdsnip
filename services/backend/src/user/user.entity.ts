export interface User {
  id: string;
  username: string;
}

export interface DBUser extends User {
  password: string;
}
