import { Body, Controller, Post } from "@nestjs/common";
import { AccountService } from "src/business/services/account.service";
import { RequestRefresh } from "./dto/request-refresh.dto";
import { TokenService } from "src/business/services/token.service";
import { ResponseRefresh } from "./dto/response-refresh.dto";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Refresh")
@Controller("refresh")
export class RefreshController {
  constructor(
    private accountService: AccountService,
    private tokenService: TokenService
  ) {}

  @ApiOkResponse({
    description: "Creates refresh and access tokens",
    type: ResponseRefresh,
  })
  @Post()
  async refresh(
    @Body() requestRefresh: RequestRefresh
  ): Promise<ResponseRefresh> {
    const tokenBody = await this.tokenService.verifyRefreshToken(
      requestRefresh.refresh_token
    );
    const userId = tokenBody.sub;
    const email = tokenBody.email;
    await this.accountService.getUser({ where: { id: userId, email } });
    const accessToken = await this.tokenService.createAccessToken({
      sub: userId,
      email,
    });
    const refreshToken = await this.tokenService.createRefreshToken({
      sub: userId,
      email,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
