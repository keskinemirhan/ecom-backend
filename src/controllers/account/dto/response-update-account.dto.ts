import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { User } from "src/business/entities/user.entity";

export class ResponseUpdateAccountDto {
  @Exclude()
  id: string;

  @ApiProperty({
    description: "Name of the user",
  })
  name: string;

  @ApiProperty({
    description: "Surname of the user",
  })
  surname: string;

  @ApiProperty({
    description: "Email address of the user",
  })
  email: string;

  @ApiProperty({
    description: "Phone number of the user",
  })
  phoneNumber: string;

  @Exclude()
  password: string;

  @Exclude()
  verified: boolean;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
