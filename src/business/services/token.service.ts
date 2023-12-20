import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ServiceException } from "../exceptions/service.exception";

interface TokenBody {
  sub: string;
  email: string;
  refresh: boolean;
}

interface TokenInfo {
  sub: string;
  email: string;
}

@Injectable()
export class TokenService {
  private readonly secret = process.env["JWT_SECRET"] || "secret";
  private readonly refreshExpire =
    process.env["JWT_REFRESH_EXPIRE_HOURS"] + "h";
  private readonly accessExpire = process.env["JWT_EXPIRE_SECONDS"] + "s";

  constructor(private jwtService: JwtService) {}

  /**
   * Verify given token
   * @param token token string
   * @returns token body
   * @throws {"INVALID_TOKEN"}
   */
  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.secret,
      });
      return payload as TokenBody;
    } catch {
      throw new ServiceException("INVALID_TOKEN");
    }
  }

  /**
   * Verify  given token is refresh token
   * @param token token string
   * @returns body of token
   * @throws {"INVALID_TOKEN"}
   */
  async verifyRefreshToken(token: string) {
    const body = await this.verifyToken(token);
    if (!body.refresh) throw new ServiceException("INVALID_TOKEN");
    return body;
  }

  /**
   * Verify  given token is access token
   * @param token token string
   * @returns body of token
   * @throws {"INVALID_TOKEN"}
   */
  async verifyAccessToken(token: string) {
    const body = await this.verifyToken(token);
    if (body.refresh) throw new ServiceException("INVALID_TOKEN");
    return body;
  }
  /**
   * Create refresh token
   * @param payload token body info
   * @returns refresh token
   */
  async createRefreshToken(payload: TokenInfo) {
    const tokenBody = { ...payload, refresh: true }; // indicate refresh token
    const token = await this.jwtService.signAsync(tokenBody, {
      expiresIn: this.refreshExpire,
    });
    return token;
  }

  /**
   * Create access token
   * @param payload token body info
   * @returns access token
   */
  async createAccessToken(payload: TokenInfo) {
    const tokenBody = { ...payload, refresh: false };
    const token = await this.jwtService.signAsync(tokenBody, {
      expiresIn: this.accessExpire,
    });
    return token;
  }
}
