import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsRelations,
  Repository,
} from "typeorm";
import { UtilityService } from "./utility.service";

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private utilityService: UtilityService
  ) {}
  /**
   * Get User entity by email address of user
   * @param email - email address of user
   * @returns - Promise of User entity if user not found returns null
   */
  async getUserByEmail(
    email: string,
    relations?: FindOptionsRelations<User>
  ): Promise<User | null> {
    return await this.userRepo.findOne({ where: { email }, relations });
  }
  /**
   * Updates user by given id
   * @param id - id of user that will be updated
   * @param userModel - user model that contains fields to update
   * @returns - updated user entity if user does not exists returns -1
   */
  async updateUserById(id: string, userModel: DeepPartial<User>) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) return -1;
    if (userModel.password) {
      const newPassword = await this.utilityService.hashString(
        userModel.password
      );
      userModel.password = newPassword;
    }
    Object.assign(user, userModel);
    return await this.userRepo.save(user);
  }
}
