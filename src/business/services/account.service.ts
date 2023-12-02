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
import { UserNotFoundException } from "../exceptions/account";

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private utilityService: UtilityService
  ) {}
  /**
   * Get User entity by email address of user
   * @param email - email address of user
   * @returns - Promise of User entity
   * @throws {UserNotFoundException} if user not found
   */
  async getUserByEmail(
    email: string,
    relations?: FindOptionsRelations<User>
  ): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email }, relations });
    if (!user) throw new UserNotFoundException();
    return user;
  }
  /**
   * Updates user by given id
   * @param id - id of user that will be updated
   * @param userModel - user model that contains fields to update
   * @returns - updated user entity
   * @throws {UserNotFoundException} if user not found
   */
  async updateUserById(id: string, userModel: DeepPartial<User>) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new UserNotFoundException();
    if (userModel.password) {
      const newPassword = await this.utilityService.hashString(
        userModel.password
      );
      userModel.password = newPassword;
    }
    Object.assign(user, userModel);
    return await this.userRepo.save(user);
  }
  /**
   *
   * @param id id of user
   * @param relations relation query
   * @returns user with given id
   * @throws {UserNotFoundException}
   */
  async getUserById(id: string, relations?: FindOptionsRelations<User>) {
    const user = await this.userRepo.findOne({ where: { id }, relations });
    if (!user) throw new UserNotFoundException();
    return user;
  }
}
