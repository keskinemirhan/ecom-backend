import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { customError } from "src/controllers/dto/errors";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(customError("A001"));
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env["JWT_SECRET"] || "secret",
      });
      const user = await this.userRepo.findOne({
        where: { id: payload["id"] },
      });
      if (!user.isAdmin) throw new NotFoundException();

      request["user"] = payload;
    } catch {
      throw new UnauthorizedException(customError("A002"));
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}