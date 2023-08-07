import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommercialItem } from "../entities/commercial-item.entity";
import { DeepPartial, Repository } from "typeorm";

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(CommercialItem)
    private itemRepo: Repository<CommercialItem>
  ) {}

  /**
   * Returns all commercial items
   * @param inStock if it is true returns only in stock items
   * @returns all items if instock false
   * @returns in stock items if instock true
   */
  async getAllItems(inStock: boolean) {
    if (inStock) {
      const items = await this.itemRepo.find();
      const filteredItems = items.filter((item) => item.quantity > 0);
      return filteredItems;
    } else {
      return await this.itemRepo.find();
    }
  }

  /**
   * Returns item with given id
   * @param id id of the item
   * @returns item
   * @returns -1 if item not found
   */
  async getItem(id: string) {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) return -1;
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
   * @returns -1 if deletion failed
   */
  async removeItem(id: string) {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) return -1;
    return await this.itemRepo.remove(item);
  }

  /**
   * Updates item with given model
   * @param itemModel item model with id (neccessary)
   * @returns -1 if item with given id in item model not found
   */
  async updateItem(itemModel: DeepPartial<CommercialItem>) {
    const item = await this.itemRepo.findOne({ where: { id: itemModel.id } });
    if (!item) return -1;
    Object.assign(item, itemModel);
    return await this.itemRepo.save(item);
  }
}
