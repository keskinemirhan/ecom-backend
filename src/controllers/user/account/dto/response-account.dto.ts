import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { Address } from "src/business/entities/address.entity";
import { CommercialItem } from "src/business/entities/commercial-item.entity";
import { User } from "src/business/entities/user.entity";

export class ResponseAccountDto {
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

  @ApiProperty({
    description: "Specifies whether the user is verified or not",
  })
  verified: boolean;

  @Exclude()
  password: string;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
