import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsRelations,
  Repository,
} from "typeorm";
import { Address } from "../entities/address.entity";
import { AccountService } from "./account.service";
import { ServiceException } from "../exceptions/service.exception";

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepo: Repository<Address>,
    private accountService: AccountService
  ) {}
  /**
   * Returns address with given id with specified relations
   * @param id id of user
   * @param relations relations to be queried
   * @returns address with given id
   * @throws {"ADDRESS_NOT_FOUND"}
   */
  async getAddress(options: FindOneOptions<Address>) {
    const address = await this.addressRepo.findOne(options);
    if (!address) throw new ServiceException("ADDRESS_NOT_FOUND");
    return address;
  }
  /**
   * Updates address with given id with given model
   * @param id id of address to be updated
   * @param addressModel model of updated address
   * @returns updated address
   * @throws {"ADDRESS_NOT_FOUND"}
   */
  async updateAddess(id: string, addressModel: DeepPartial<Address>) {
    const address = await this.addressRepo.findOne({ where: { id } });
    if (!address) throw new ServiceException("ADDRESS_NOT_FOUND");
    Object.assign(address, addressModel);
    return await this.addressRepo.save(address);
  }

  /**
   * Removes address with given id
   * @param id id of address to be removed
   * @returns removed address
   * @throws {"ADDRESS_NOT_FOUND"}
   */
  async removeAddress(id: string) {
    const address = await this.addressRepo.findOne({ where: { id } });
    if (!address) throw new ServiceException("ADDRESS_NOT_FOUND");
    return await this.addressRepo.remove(address);
  }

  /**
   * Creates address with given address model
   * @param addressModel model of address to be created
   * @returns created address model
   */
  async createAddress(addressModel: DeepPartial<Address>) {
    const address = this.addressRepo.create(addressModel);
    return await this.addressRepo.save(address);
  }

  /**
   * Returns all addresses of user with given id
   * @param userId id of user
   * @returns all addresses of user with given id
   * @throws {"USER_NOT_FOUND"}
   */
  async getAllAddressByUserId(userId: string) {
    const user = await this.accountService.getUserById(userId);
    const allAdress = await this.addressRepo.find({ where: { user } });
    return allAdress;
  }
}
