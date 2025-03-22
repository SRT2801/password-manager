export class InvalidatedToken {
  id: number;
  token: string;
  expiresAt: Date;

  constructor(token: string, expiresAt: Date) {
    this.token = token;
    this.expiresAt = expiresAt;
  }
}
