import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CommercialItem } from "../entities/commercial-item.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BasketService {
  basketLimit: number;
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(CommercialItem)
    private itemRepo: Repository<CommercialItem>,
    private configService: ConfigService
  ) {
    this.basketLimit = Number(
      this.configService.get<string>("BASKET_LIMIT", "500")
    );
  }

  /**
   * Returns basket array of user given id
   * If user not found returns -1
   * @param id - userId
   * @returns -1 if user not found
   * @returns basket array if successful
   */
  async getBasketByUserId(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { basketItems: true },
    });

    if (!user) return -1;
    return user.basketItems;
  }
  /**
   * Adds item with given id to basket of user with given id
   * Returns basket array if error returns number accordingly
   * @param userId - Id of User of basket
   * @param itemId - Id of the item
   * @param quantity - Quantity of item
   * @returns -1 if item not found
   * @returns 1 if user not found
   * @returns 2 if basket limit exceeded
   * @returns new basket if successfully added
   */
  async addBasketItem(userId: string, itemId: string, quantity: number) {
    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) return -1;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return 1;

    if (user.basketItems.length + quantity > this.basketLimit) return 2;

    for (let index = 0; index < quantity; index++) {
      user.basketItems.push(item);
    }

    await this.userRepo.save(user);
    return await this.getBasketByUserId(user.id);
  }
  /**
   * Calculates total basket price of given basket array
   * @param basket - basket array
   * @returns total price of the basket
   */
  calculateBasketPrice(basket: CommercialItem[]) {
    let price = 0;
    basket.forEach((item) => {
      price += Number(item.price);
    });
    return price;
  }
  /**
   * Removes item with given id according to given quantity from basket
   * Returns new basket if error occures returns numbers accordingly
   * @param userId id of user that owns basket
   * @param itemId item to be deleted from basket
   * @param quantity quantity of item to be deleted
   * @returns -1 if item with given id not found
   * @returns 1 if user with given id not found
   * @returns basket array if successful
   */
  async removeBasketItem(userId: string, itemId: string, quantity: number) {
    const item = await this.itemRepo.findOne({
      where: {
        id: itemId,
      },
    });

    if (!item) return -1;

    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) return 1;

    for (let count = 0; count < quantity; count++) {
      const index = user.basketItems.indexOf(item);
      if (index === -1) break;
      user.basketItems.splice(index, 1);
    }
    await this.userRepo.save(user);

    return await this.getBasketByUserId(userId);
  }
}
