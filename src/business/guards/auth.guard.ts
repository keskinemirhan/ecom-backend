import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { customError } from "src/controllers/dto/errors";
import { AccountService } from "../services/account.service";
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private accountService: AccountService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(customError("LOGIN_REQUIRED"));
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env["JWT_SECRET"] || "secret",
      });
      const user = await this.accountService.getUserById(payload["sub"]);
      request["user"] = user;
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
