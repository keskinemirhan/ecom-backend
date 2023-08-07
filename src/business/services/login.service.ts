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
   * if user does not exists returns -1
   * if password wrong returns 1
   * @param email - email of user
   * @param password - password of user
   * @returns -1 if user does not exists
   * @returns 1 if user does not exists
   * @returns 2 if specified admin and user is not admin
   *
   */
  async login(
    email: string,
    password: string,
    admin: boolean = false
  ): Promise<string | -1 | 1 | 2> {
    const user = await this.userRepo.findOne({
      where: {
        email,
      },
    });
    if (!user) return -1;

    if (admin) {
      if (!user.isAdmin) return 2;
    }
    const comparisonResult = await this.utilityService.compareHash(
      password,
      user.password
    );
    if (!comparisonResult) return 1;

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return access_token;
  }
}
