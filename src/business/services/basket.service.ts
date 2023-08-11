import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CommercialItem } from "../entities/commercial-item.entity";
import { ConfigService } from "@nestjs/config";
import { BasketItem } from "../entities/basket-item.entity";

@Injectable()
export class BasketService {
  basketLimit: number;
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(CommercialItem)
    private itemRepo: Repository<CommercialItem>,
    private configService: ConfigService,
    @InjectRepository(BasketItem) private basketItemRepo: Repository<BasketItem>
  ) {
    this.basketLimit = Number(
      this.configService.get<string>("BASKET_LIMIT", "500")
    );
  }

  /**
   * Updates basket item with given count
   * @param userId id of user that owns basket
   * @param itemId item id of basket item object's item
   * @param count count of item
   * @returns updated basket of user if successful
   * @returns -1 if user with given id not found
   * @returns 1 if item with given id not found
   * @returns 2 if basket count limit exceeded
   */
  async updateBasketItem(userId: string, itemId: string, count: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { basketItems: true },
    });
    if (!user) return -1;

    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) return 1;

    if (count > item.quantity) return 3;

    const basket = user.basketItems;

    const basketItem = basket.find((bItem) => bItem.item.id === itemId);

    if (basketItem) {
      const lastTotal =
        (await this.calculateBasketCount(userId)) - basketItem.count + count;

      if (lastTotal > this.basketLimit) return 2;

      basketItem.count = count;

      await this.basketItemRepo.save(basketItem);

      const updatedUser = await this.userRepo.findOne({
        where: { id: userId },
        relations: { basketItems: true },
      });

      return updatedUser.basketItems;
    }
    if (!basketItem) {
      const lastTotal = (await this.calculateBasketCount(userId)) + count;

      if (lastTotal > this.basketLimit) return 2;

      const newBasketItem = this.basketItemRepo.create();
      newBasketItem.item = item;
      newBasketItem.count = count;

      const savedBasket = await this.basketItemRepo.save(newBasketItem);
      user.basketItems.push(savedBasket);

      await this.userRepo.save(user);

      const updatedUser = await this.userRepo.findOne({
        where: { id: userId },
        relations: { basketItems: true },
      });
      return updatedUser.basketItems;
    }
  }

  /**
   * Removes basket item with given item id
   * @param userId user id of user of basket
   * @param itemId item id of basket item to removed
   * @returns updated basket of user
   * @returns -1 if user with given id not found
   * @returns 1 if item with given id not found
   */
  async removeBasketItem(userId: string, itemId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { basketItems: true },
    });

    if (!user) return -1;

    const basketItem = user.basketItems.find(
      (bItem) => bItem.item.id === itemId
    );

    if (!basketItem) return 1;

    await this.basketItemRepo.remove(basketItem);

    const updatedUser = await this.userRepo.findOne({
      where: { id: userId },
      relations: { basketItems: true },
    });

    return updatedUser.basketItems;
  }

  /**
   * Calculates basket price of user with given id
   * @param userId id of user
   * @returns total price of basket
   */
  async calculateBasketPrice(userId: string) {
    let price = 0;
    const foundUser = await this.userRepo.findOne({
      where: { id: userId },
      relations: { basketItems: true },
    });

    foundUser.basketItems.forEach((bItem) => {
      price += bItem.count * bItem.item.price;
    });

    return price;
  }

  /**
   * Calculates total item count of basket of user given id
   * @param userId user id
   * @returns total item count
   */
  async calculateBasketCount(userId: string) {
    let totalCount = 0;
    const foundUser = await this.userRepo.findOne({
      where: { id: userId },
      relations: { basketItems: true },
    });

    foundUser.basketItems.forEach((bItem) => {
      totalCount += bItem.count;
    });

    return totalCount;
  }

  /**
   * Returns basket according to given user id
   * @param userId user of basket
   * @returns basket of user
   * @returns -1 if user not found
   */
  async getBasketByUserId(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: {
        basketItems: true,
      },
    });

    if (!user) return -1;

    return user.basketItems;
  }

  /**
   * Removes all basket item of user with given id
   * @param userId id of user of basket
   * @returns basket of user
   * @returns -1 if user not found
   */
  async removeAllBasketItem(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { basketItems: true },
    });

    if (!user) return -1;

    for (const bItem of user.basketItems) {
      await this.basketItemRepo.remove(bItem);
    }

    const updatedUser = await this.userRepo.findOne({
      where: { id: userId },
      relations: { basketItems: true },
    });

    return updatedUser.basketItems;
  }
}
