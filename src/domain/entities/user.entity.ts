export class User {
  id: number;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;

  constructor(
    email: string,
    passwordHash: string,
    firstName?: string,
    lastName?: string,
  ) {
    this.email = email;
    this.passwordHash = passwordHash;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
