import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommercialItem } from "../entities/commercial-item.entity";
import { DeepPartial, MoreThan, Repository } from "typeorm";
import { ServiceException } from "../exceptions/service.exception";

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(CommercialItem)
    private itemRepo: Repository<CommercialItem>
  ) {}

  /**
   * Returns all commercial items with pagination
   * @param inStock if it is true returns only in stock items
   * @param page page number
   * @param take page item count
   * @returns all items if instock false
   * @returns in stock items if instock true
   */
  async getAllItems(inStock: boolean, page: number, take: number) {
    const skip = (page - 1) * take;
    if (inStock) {
      const items = await this.itemRepo.findAndCount({
        where: { quantity: MoreThan(0) },
        take,
        skip,
      });
      return {
        items,
        page,
        take,
      };
    } else {
      const items = await this.itemRepo.findAndCount({ take, skip });
      return {
        items,
        page,
        take,
      };
    }
  }

  /**
   * Returns item with given id
   * @param id id of the item
   * @returns item
   * @throws {"ITEM_NOT_FOUND"}
   */
  async getItem(id: string) {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new ServiceException("ITEM_NOT_FOUND");
    return item;
  }

  /**
   * Creates item with given item model
   * @param itemModel item model
   * @returns created item
   */
  async createItem(itemModel: DeepPartial<CommercialItem>) {
    return await this.itemRepo.save(itemModel);
  }

  /**
   * Removes item with given id
   * @param id id of the item
   * @returns removed item
   * @throws {"ITEM_NOT_FOUND"}
   */
  async removeItem(id: string) {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new ServiceException("ITEM_NOT_FOUND");
    return await this.itemRepo.remove(item);
  }

  /**
   * Updates item with given model
   * @param itemModel item model with id (neccessary)
   * @throws {"ITEM_NOT_FOUND"}
   */
  async updateItem(itemModel: DeepPartial<CommercialItem>) {
    const item = await this.itemRepo.findOne({ where: { id: itemModel.id } });
    if (!item) throw new ServiceException("ITEM_NOT_FOUND");
    Object.assign(item, itemModel);
    return await this.itemRepo.save(item);
  }

  /**
   * Return quantity of item with given id
   * @param id id of item
   * @returns stock count of item
   * @throws {"ITEM_NOT_FOUND"}
   */
  async getItemStock(id: string) {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new ServiceException("ITEM_NOT_FOUND");
    return item.quantity;
  }

  async setItemStock(id: string, quantity: number) {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) return -1;
    item.quantity = quantity;
    return quantity;
  }
}
