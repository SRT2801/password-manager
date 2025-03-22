export class Password {
  id: number;
  serviceName: string;
  userName: string;
  encryptedPassword: string;
  userId: number;

  constructor(
    serviceName: string,
    username: string,
    encryptedPassword: string,
    userId: number,
  ) {
    this.serviceName = serviceName;
    this.userName = username;
    this.encryptedPassword = encryptedPassword;
    this.userId = userId;
  }
}
