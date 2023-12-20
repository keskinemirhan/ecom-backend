import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { UtilityService } from "./utility.service";
import { ConfigService } from "@nestjs/config";
import { ServiceException } from "../exceptions/service.exception";
import { TokenService } from "./token.service";

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private utilityService: UtilityService,
    private configService: ConfigService,
    private tokenService: TokenService
  ) {
    // Default admin register
    const adminEmail = this.configService.get<string>(
      "ADMIN_EMAIL",
      "mail@mail.com"
    );
    const adminName = this.configService.get<string>("ADMIN_NAME", "Admin");
    const adminSurname = this.configService.get<string>(
      "ADMIN_SURNAME",
      "Adminson"
    );
    const adminPassword = this.configService.get<string>(
      "ADMIN_PASSWORD",
      "password"
    );

    const adminControl = this.userRepo.findOne({
      where: { isAdmin: true },
    });

    adminControl.then(async (admin) => {
      if (admin) await this.userRepo.remove(admin);
      const newAdmin = this.userRepo.create();
      newAdmin.name = adminName;
      newAdmin.surname = adminSurname;
      newAdmin.email = adminEmail;
      newAdmin.password = await this.utilityService.hashString(adminPassword);
      newAdmin.phoneNumber = "";
      newAdmin.verified = true;
      newAdmin.isAdmin = true;

      await this.userRepo.save(newAdmin);
    });
  }

  /**
   * Returns Jwt of logged in user if credentials match
   * @param email - email of user
   * @param password - password of user
   * @throws {"INVALID_CREDENTIALS"}
   * @returns refresh and access token
   */
  async login(
    email: string,
    password: string,
    admin: boolean = false
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userRepo.findOne({
      where: {
        email,
      },
    });
    if (!user) throw new ServiceException("INVALID_CREDENTIALS");

    if (admin) {
      if (!user.isAdmin) throw new ServiceException("INVALID_CREDENTIALS");
    }
    const comparisonResult = await this.utilityService.compareHash(
      password,
      user.password
    );
    if (!comparisonResult) throw new ServiceException("INVALID_CREDENTIALS");

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const access_token = await this.tokenService.createAccessToken(payload);
    const refresh_token = await this.tokenService.createRefreshToken(payload);
    return {
      access_token,
      refresh_token,
    };
  }
}
