import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { RequestLoginDto } from "./dto/request-login.dto";
import { LoginService } from "src/business/services/login.service";
import { customError, errorApiInfo } from "src/controllers/dto/errors";
import { ResponseLoginDto } from "./dto/response-login.dto";
import { AccountService } from "src/business/services/account.service";
import { ResponseLogadminDto } from "./dto/response-logadmin.dto";
@ApiTags("Login")
@Controller("login")
export class LoginController {
  constructor(
    private loginService: LoginService,
    private accountService: AccountService
  ) {}

  @ApiOkResponse({
    type: ResponseLoginDto,
    description: "User login returns access token",
  })
  @ApiBadRequestResponse(errorApiInfo(["INVALID_CREDENTIALS"]))
  @Post()
  async login(
    @Body() requestLogin: RequestLoginDto
  ): Promise<ResponseLoginDto> {
    const email = requestLogin.email;
    const password = requestLogin.password;

    const result = await this.loginService.login(email, password);

    const user = await this.accountService.getUserByEmail(email);

    const verified = user.verified;

    return {
      access_token: result,
      verified,
    };
  }

  @ApiOkResponse({
    type: ResponseLogadminDto,
    description: "Admin login returns access token",
  })
  @ApiBadRequestResponse(errorApiInfo(["INVALID_CREDENTIALS"]))
  @Post("logadmin")
  async adminLogin(
    @Body() requestLogin: RequestLoginDto
  ): Promise<ResponseLogadminDto> {
    const email = requestLogin.email;

    const password = requestLogin.password;
    const result = await this.loginService.login(email, password, true);

    return {
      access_token: result,
    };
  }
}
