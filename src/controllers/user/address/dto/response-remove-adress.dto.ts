import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Address } from "src/business/entities/address.entity";
import { User } from "src/business/entities/user.entity";

export class ResponseRemoveAddressDto {
  @ApiProperty({
    description: "Id of the address",
  })
  id: string;

  @ApiProperty({
    description: "Zipcode of the address",
  })
  zipCode: string;

  @ApiProperty({
    description: "Contact name of the address",
  })
  contactName: string;

  @ApiProperty({
    description: "Contact surname of the address",
  })
  contactSurname: string;

  @ApiProperty({
    description: "City of the address",
  })
  city: string;

  @ApiProperty({
    description: "Country of the address",
  })
  country: string;

  @ApiProperty({
    description: "Description of the address",
  })
  address: string;

  @Exclude()
  user: User;

  constructor(address: Address) {
    Object.assign(this, address);
  }
}
