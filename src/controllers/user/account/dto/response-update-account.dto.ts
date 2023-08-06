import { Exclude } from "class-transformer";
import { User } from "src/business/entities/user.entity";

export class ResponseUpdateAccountDto {
  @Exclude()
  id: string;

  name: string;

  surname: string;

  email: string;

  phoneNumber: string;

  @Exclude()
  password: string;

  @Exclude()
  verified: boolean;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
