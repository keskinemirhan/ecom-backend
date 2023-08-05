import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AccountService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async getUserByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } });
  }
}
