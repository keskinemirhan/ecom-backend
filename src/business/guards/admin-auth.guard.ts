import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { customError } from "src/controllers/dto/errors";
import { AccountService } from "../services/account.service";
import { TokenService } from "../services/token.service";

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private tokenService: TokenService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(customError("LOGIN_REQUIRED"));
    }
    try {
      const payload = await this.tokenService.verifyAccessToken(token);
      const user = await this.accountService.getUserByEmail(payload.email);

      if (!user.isAdmin) throw new NotFoundException();

      request["user"] = payload;
    } catch {
      throw new UnauthorizedException(customError("INVALID_TOKEN"));
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
