import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { UtilityService } from "./utility.service";

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private utilityService: UtilityService
  ) {}

  /**
   * Returns Jwt of logged in user if credentials match
   * if credentials does not match returns undefined
   * if user does not exists returns -1
   * if user is not verified returns 1
   * if password wrong returns 2
   * @param email - email of user
   * @param password - password of user
   * @returns access token if something wrong returns numbers according to error type
   */
  async login(email: string, password: string): Promise<string | -1 | 1 | 2> {
    const user = await this.userRepo.findOne({
      where: {
        email,
      },
    });
    if (!user) return -1;

    if (!user.verified) return 1;
    const comparisonResult = await this.utilityService.compareHash(
      password,
      user.password
    );
    if (!comparisonResult) return 2;

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return access_token;
  }
}
