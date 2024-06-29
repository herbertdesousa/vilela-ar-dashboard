export class UserUnauthed {
  type: 'UNAUTHED';

  constructor() {
    this.type = 'UNAUTHED';
  }
}

export class UserAuthed {
  type: 'AUTHED';

  token: string;

  email: string;

  constructor(token: string, email: string) {
    this.type = 'AUTHED';
    this.token = token;
    this.email = email;
  }
}

export class UserLoading {
  type: 'LOADING';

  constructor() {
    this.type = 'LOADING';
  }
}

export type User = UserLoading | UserAuthed | UserUnauthed;
