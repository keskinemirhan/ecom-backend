import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOptionsRelations, Repository } from "typeorm";
import { Address } from "../entities/address.entity";
import { AccountService } from "./account.service";
import { AddressNotFoundException } from "../exceptions/address";
import { UserNotFoundException } from "../exceptions/account";

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
   * @throws {AddressNotFoundException}
   */
  async getAddress(id: string, relations?: FindOptionsRelations<Address>) {
    const address = await this.addressRepo.findOne({
      where: { id },
      relations,
    });
    if (!address) throw new AddressNotFoundException();
    return address;
  }
  /**
   * Updates address with given id with given model
   * @param id id of address to be updated
   * @param addressModel model of updated address
   * @returns updated address
   * @throws {AddressNotFoundException}
   */
  async updateAddess(id: string, addressModel: DeepPartial<Address>) {
    const address = await this.addressRepo.findOne({ where: { id } });
    if (!address) throw new AddressNotFoundException();
    Object.assign(address, addressModel);
    return await this.addressRepo.save(address);
  }

  /**
   * Removes address with given id
   * @param id id of address to be removed
   * @returns removed address
   * @throws {AddressNotFoundException}
   */
  async removeAddress(id: string) {
    const address = await this.addressRepo.findOne({ where: { id } });
    if (!address) throw new AddressNotFoundException();
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
   * @throws {UserNotFoundException}
   */
  async getAllAddressByUserId(userId: string) {
    const user = await this.accountService.getUserById(userId);
    const allAdress = await this.addressRepo.find({ where: { user } });
    return allAdress;
  }
}
