import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  Repository,
} from "typeorm";
import { UtilityService } from "./utility.service";
import { ServiceException } from "../exceptions/service.exception";

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private utilityService: UtilityService
  ) {}

  /**
   * Query users
   * @param options query options
   * @returns query results
   */
  async getAllUser(options?: FindManyOptions<User>) {
    return this.userRepo.find(options);
  }

  /**
   * Get User entity by email address of user
   * @param email - email address of user
   * @returns - Promise of User entity
   * @throws {"USER_NOT_FOUND"} if user not found
   */
  async getUserByEmail(
    email: string,
    relations?: FindOptionsRelations<User>
  ): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email }, relations });
    if (!user) throw new ServiceException("USER_NOT_FOUND");
    return user;
  }
  /**
   * Updates user by given id
   * @param id - id of user that will be updated
   * @param userModel - user model that contains fields to update
   * @returns - updated user entity
   * @throws {"USER_NOT_FOUND"} if user not found
   */
  async updateUserById(id: string, userModel: DeepPartial<User>) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new ServiceException("USER_NOT_FOUND");
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
   * @throws {"USER_NOT_FOUND"}
   */
  async getUserById(id: string, relations?: FindOptionsRelations<User>) {
    const user = await this.userRepo.findOne({ where: { id }, relations });
    if (!user) throw new ServiceException("USER_NOT_FOUND");
    return user;
  }

  /**
   *
   * @param options query options
   * @returns  removed user
   * @throws {"USER_NOT_FOUND"}
   */
  async removeUser(options: FindOneOptions<User>) {
    const user = await this.userRepo.findOne(options);
    if (!user) throw new ServiceException("USER_NOT_FOUND");
    return this.userRepo.remove(user);
  }
}
