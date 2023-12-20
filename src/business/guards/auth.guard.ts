import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { customError } from "src/controllers/dto/errors";
import { AccountService } from "../services/account.service";
import { User } from "../entities/user.entity";
import { TokenService } from "../services/token.service";
@Injectable()
export class AuthGuard implements CanActivate {
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
      const user = await this.accountService.getUserById(payload.sub);
      request["user"] = user;
    } catch {
      throw new UnauthorizedException(customError("INVALID_TOKEN"));
    }
    if (!(request["user"] as User).verified) {
      throw new UnauthorizedException(customError("ACCOUNT_NOT_VERIFIED"));
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
