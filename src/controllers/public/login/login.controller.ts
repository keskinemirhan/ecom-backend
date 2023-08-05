import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { RequestLoginDto } from "./dto/request-login.dto";
import { LoginService } from "src/business/services/login.service";
import { customError, errorApiInfo } from "src/controllers/dto/errors";
import { ResponseLoginDto } from "./dto/response-login.dto";
@ApiTags("Register")
@Controller("login")
export class LoginController {
  constructor(private loginService: LoginService) {}
  @ApiOkResponse({
    type: ResponseLoginDto,
    description: "User login returns access token",
  })
  @ApiBadRequestResponse(errorApiInfo(["L001", "L002"]))
  @Post()
  async login(
    @Body() requestLogin: RequestLoginDto
  ): Promise<ResponseLoginDto> {
    const email = requestLogin.email;
    const password = requestLogin.password;
    const result = await this.loginService.login(email, password);

    if (result === -1 || result === 2)
      throw new BadRequestException(customError("L001"));
    if (result === 1) throw new BadRequestException(customError("L002"));

    return {
      access_token: result,
    };
  }
}
