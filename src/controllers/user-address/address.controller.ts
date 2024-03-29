import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/business/decorators/current-user.decorator";
import { Address } from "src/business/entities/address.entity";
import { User } from "src/business/entities/user.entity";
import { AuthGuard } from "src/business/guards/auth.guard";
import { AccountService } from "src/business/services/account.service";
import { AddressService } from "src/business/services/address.service";
import { customError, errorApiInfo } from "src/controllers/dto/errors";
import { DeepPartial } from "typeorm";
import { RequestAddAddressDto } from "./dto/request-add-address.dto";
import { ResponseAddAddressDto } from "./dto/response-add-address.dto";
import { RequestUpdateAddressDto } from "./dto/request-update-address.dto";
import { ResponseUpdateAddressDto } from "./dto/response-update-address.dto";
import { ResponseRemoveAddressDto } from "./dto/response-remove-adress.dto";
import { ResponseGetAddressDto } from "./dto/response-get-address.dto";

@ApiTags("Address")
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller("address")
export class AddressController {
  constructor(
    private addressService: AddressService,
    private accountService: AccountService
  ) {}

  @ApiOkResponse({
    type: ResponseGetAddressDto,
    description: "Get address with given id",
  })
  @ApiBadRequestResponse(errorApiInfo(["USER_NOT_FOUND", "ADDRESS_NOT_FOUND"]))
  @Get(":id")
  async getAddress(@Param("id") id: string, @CurrentUser() payload: User) {
    const userId = payload["id"];
    const address = await this.addressService.getAddress({
      where: { user: { id: userId }, id },
    });
    return new ResponseGetAddressDto(address);
  }

  @ApiOkResponse({
    type: ResponseGetAddressDto,
    isArray: true,
    description: "Get all address of the user",
  })
  @ApiBadRequestResponse(errorApiInfo(["USER_NOT_FOUND"]))
  @Get()
  async getAllAddress(@CurrentUser() currentUser: User) {
    const userId = currentUser.id;
    const addresses = await this.addressService.getAllAddressByUserId(userId);

    const allAdress = addresses;
    const responseAllAdresses: ResponseGetAddressDto[] = [];
    for (const address of allAdress) {
      responseAllAdresses.push(new ResponseGetAddressDto(address));
    }
    return responseAllAdresses;
  }

  @ApiOkResponse({
    type: ResponseUpdateAddressDto,
    description: "Create address",
  })
  @ApiBadRequestResponse(errorApiInfo(["USER_NOT_FOUND"]))
  @Post()
  async createAddress(
    @Body() addAddressDto: RequestAddAddressDto,
    @CurrentUser() currentUser: User
  ) {
    const userId = currentUser.id;
    const user = await this.accountService.getUserById(userId);

    const addressModel: DeepPartial<Address> = {
      user,
      ...addAddressDto,
    };
    const newAddress = await this.addressService.createAddress(addressModel);
    return new ResponseAddAddressDto(newAddress);
  }

  @ApiOkResponse({
    type: ResponseUpdateAddressDto,
    description: "Update address with given id",
  })
  @ApiBadRequestResponse(errorApiInfo(["ADDRESS_NOT_FOUND"]))
  @Patch(":id")
  async updateAddress(
    @Param("id") id: string,
    @Body() updateAddressDto: RequestUpdateAddressDto,
    @CurrentUser() currentUser: User
  ) {
    const userId = currentUser.id;
    const address = await this.addressService.getAddress({
      where: { user: { id: userId }, id },
    });
    Object.assign(address, updateAddressDto);
    const updatedAddress = await this.addressService.updateAddess(id, address);
    return new ResponseUpdateAddressDto(updatedAddress);
  }

  @ApiOkResponse({
    type: ResponseRemoveAddressDto,
    description: "Remove address with given id",
  })
  @ApiBadRequestResponse(errorApiInfo(["ADDRESS_NOT_FOUND"]))
  @Delete(":id")
  async removeAddress(
    @Param("id") id: string,
    @CurrentUser() currentUser: User
  ) {
    const userId = currentUser.id;
    const address = await this.addressService.getAddress({
      where: { user: { id: userId }, id },
    });

    const removedAddress = await this.addressService.removeAddress(address.id);
    return new ResponseRemoveAddressDto(removedAddress);
  }
}
