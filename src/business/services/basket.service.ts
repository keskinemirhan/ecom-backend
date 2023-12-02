import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CommercialItem } from "../entities/commercial-item.entity";
import { ConfigService } from "@nestjs/config";
import { BasketItem } from "../entities/basket-item.entity";
import { AccountService } from "./account.service";
import { UserNotFoundException } from "../exceptions/account";
import { ItemService } from "./item.service";
import { ItemNotFoundException } from "../exceptions/item";
import {
  BasketItemNotFoundException,
  BasketLimitExceededException,
  NotEnoughStockException,
} from "../exceptions/basket";

@Injectable()
export class BasketService {
  basketLimit: number;
  constructor(
    private accountService: AccountService,
    private itemService: ItemService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(CommercialItem)
    private itemRepo: Repository<CommercialItem>,
    private configService: ConfigService,
    @InjectRepository(BasketItem)
    private basketItemRepo: Repository<BasketItem>
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
   * @throws {UserNotFoundException}
   * @throws {ItemNotFoundException}
   * @throws {BasketLimitExceededException}
   * @throws {NotEnoughStockException}
   */
  async updateBasketItem(userId: string, itemId: string, count: number) {
    const user = await this.accountService.getUserById(userId, {
      basketItems: true,
    });

    const item = await this.itemService.getItem(itemId);

    if (count > item.quantity) throw new NotEnoughStockException();

    const basket = user.basketItems;

    const basketItem = basket.find((bItem) => bItem.item.id === itemId);

    if (basketItem) {
      const lastTotal =
        (await this.calculateBasketCount(userId)) - basketItem.count + count;
      if (lastTotal > this.basketLimit)
        throw new BasketLimitExceededException();

      basketItem.count = count;

      await this.basketItemRepo.save(basketItem);

      const updatedUser = await this.accountService.getUserById(userId, {
        basketItems: true,
      });

      return updatedUser.basketItems;
    }
    if (!basketItem) {
      const lastTotal = (await this.calculateBasketCount(userId)) + count;

      if (lastTotal > this.basketLimit)
        throw new BasketLimitExceededException();

      const newBasketItem = this.basketItemRepo.create();
      newBasketItem.item = item;
      newBasketItem.count = count;

      const savedBasket = await this.basketItemRepo.save(newBasketItem);
      user.basketItems.push(savedBasket);

      await this.accountService.updateUserById(user.id, user);

      const updatedUser = await this.accountService.getUserById(userId, {
        basketItems: true,
      });
      return updatedUser.basketItems;
    }
  }

  /**
   * Removes basket item with given item id
   * @param userId user id of user of basket
   * @param itemId item id of basket item to removed
   * @returns updated basket of user
   * @throws {UserNotFoundException}
   * @throws {BasketItemNotFoundException}
   */
  async removeBasketItem(userId: string, itemId: string) {
    const user = await this.accountService.getUserById(userId, {
      basketItems: true,
    });

    const basketItem = user.basketItems.find(
      (bItem) => bItem.item.id === itemId
    );

    if (!basketItem) throw new BasketItemNotFoundException();

    await this.basketItemRepo.remove(basketItem);

    const updatedUser = await this.accountService.getUserById(userId, {
      basketItems: true,
    });

    return updatedUser.basketItems;
  }

  /**
   * Calculates basket price of user with given id
   * @param userId id of user
   * @returns total price of basket
   * @throws {UserNotFoundException}
   */
  async calculateBasketPrice(userId: string) {
    let price = 0;
    const foundUser = await this.accountService.getUserById(userId, {
      basketItems: true,
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
   * @throws {UserNotFoundException}
   */
  async calculateBasketCount(userId: string) {
    let totalCount = 0;
    const foundUser = await this.accountService.getUserById(userId, {
      basketItems: true,
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
   * @throws {UserNotFoundException}
   */
  async getBasketByUserId(userId: string) {
    const user = await this.accountService.getUserById(userId, {
      basketItems: {
        item: {
          category: true,
        },
      },
    });

    return user.basketItems;
  }

  /**
   * Removes all basket item of user with given id
   * @param userId id of user of basket
   * @returns basket of user
   * @throws {UserNotFoundException}
   */
  async removeAllBasketItem(userId: string) {
    const user = await this.accountService.getUserById(userId, {
      basketItems: true,
    });

    for (const bItem of user.basketItems) {
      await this.basketItemRepo.remove(bItem);
    }

    const updatedUser = await this.accountService.getUserById(userId, {
      basketItems: true,
    });

    return updatedUser.basketItems;
  }
}
