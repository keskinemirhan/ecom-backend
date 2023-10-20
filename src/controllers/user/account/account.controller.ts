import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { User } from "src/business/entities/user.entity";
import { AuthGuard } from "src/business/guards/auth.guard";
import { AccountService } from "src/business/services/account.service";
import { ResponseAccountDto } from "./dto/response-account.dto";
import { CurrentUser } from "src/business/decorators/current-user.decorator";
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { customError, errorApiInfo } from "src/controllers/dto/errors";
import { RequestUpdateAccountDto } from "./dto/request-update-account.dto";
import { LoginService } from "src/business/services/login.service";
import { ResponseUpdateAccountDto } from "./dto/response-update-account.dto";
@ApiTags("Account")
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller("account")
export class AccountController {
  constructor(
    private accountService: AccountService,
    private loginService: LoginService
  ) {}
  @ApiOkResponse({
    type: ResponseAccountDto,
    description: "Gives account information about current user with jwt",
  })
  @ApiBadRequestResponse(errorApiInfo(["AC001"]))
  @Get()
  async getAccountInfo(@CurrentUser() payload: User) {
    const user = await this.accountService.getUserByEmail(payload.email, {
      addresses: false,
      basketItems: false,
    });
    if (!user) return new BadRequestException(customError("AC001"));
    return new ResponseAccountDto(user);
  }

  @ApiOkResponse({
    type: ResponseUpdateAccountDto,
    description: "Updates user info",
  })
  @ApiUnauthorizedResponse(errorApiInfo(["AC001", "AC002"]))
  @Post()
  async updateAccount(
    @Body() requestUpdateAccount: RequestUpdateAccountDto,
    @CurrentUser() payload: User
  ) {
    const { authPassword, ...updateModel } = requestUpdateAccount;
    const passControl = await this.loginService.login(
      payload["email"],
      authPassword
    );
    if (passControl === 1)
      throw new UnauthorizedException(customError("AC002"));
    if (passControl === -1)
      throw new UnauthorizedException(customError("AC001"));

    const updated = await this.accountService.updateUserById(
      payload["id"],
      updateModel
    );
    if (updated === -1) throw new UnauthorizedException(customError("AC001"));
    return new ResponseUpdateAccountDto(updated);
  }
}
