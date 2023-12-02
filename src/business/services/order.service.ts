import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "../entities/order.entity";
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from "typeorm";
import { AccountService } from "./account.service";
import { OrderNotFoundException } from "../exceptions/order";
import { UserNotFoundException } from "../exceptions/account";
import { PaginationOptions } from "../models/pagination-options";

interface OrderStatus {
  isPaid?: boolean;

  isDelivered?: boolean;

  isCanceled?: boolean;

  isRequested?: boolean;

  isFailed?: boolean;
}

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    private accountService: AccountService
  ) {}

  /**
   * Change particular status of order
   * @param conversationId conversation id of the order
   * @param status particular status to be toggled
   * @returns modified order
   * @throws {OrderNotFoundExceptions}
   */
  async statusChange(conversationId: string, status: OrderStatus) {
    const order = await this.getOrder({ where: { conversationId } });
    for (const [key, value] of Object.entries(status)) {
      order[key] = value;
      order[key.substring(2).toLowerCase() + "At"] = new Date();
    }
    return await this.orderRepo.save(order);
  }

  /**
   * Creates order with given model
   * @param orderModel model
   * @returns created model
   */
  async createOrder(orderModel: DeepPartial<Order>) {
    const order = this.orderRepo.create(orderModel);
    return await this.orderRepo.save(order);
  }

  /**
   * Updates order with given id and model
   * @param id id of orderd
   * @param orderModel model
   * @returns updated order
   * @throws {OrderNotFoundException} if order not found
   */
  async updateOrder(id: string, orderModel: DeepPartial<Order>) {
    const order = await this.orderRepo.findOne({
      where: { conversationId: id },
      relations: {
        billingAddress: true,
        shippingAddress: true,
        basketItems: true,
        user: true,
      },
    });
    if (!order) throw new OrderNotFoundException();
    Object.assign(order, orderModel);
    return await this.orderRepo.save(order);
  }

  /**
   * Removes order with given id
   * @param id id of order
   * @returns removed item
   * @throws {OrderNotFoundException}
   */
  async removeOrder(conversationId: string) {
    const order = await this.getOrder({ where: { conversationId } });
    if (!order) throw new OrderNotFoundException();
    return await this.orderRepo.remove(order);
  }

  /**
   * Returns order with given id
   * @param findOptions id of order
   * @returns returns order with given id
   * @throws {OrderNotFoundException} if order not found
   */
  async getOrder(options: FindOneOptions<Order>) {
    const order = await this.orderRepo.findOne(options);
    if (!order) throw new OrderNotFoundException();
    return order;
  }

  /**
   * Returns user with given user id
   * @param userId id of user
   * @returns order of user
   * @throws {UserNotFoundException}
   */
  async getOrdersByUser(userId: string) {
    const user = await this.accountService.getUserById(userId);
    const orders = (await this.getAllOrder({ where: { user } })) as Order[];
    return orders;
  }

  /**
   * Returns orders with given options
   * @param options query options
   * @returns order array according to options
   */
  async getAllOrder(
    options: FindManyOptions<Order>,
    pagination?: PaginationOptions
  ) {
    if (!pagination) {
      const orders = await this.orderRepo.find(options);
      return orders;
    } else {
      const skip = (pagination.page - 1) * pagination.take;
      const orders = await this.orderRepo.findAndCount({
        ...options,
        take: pagination.take,
        skip,
      });
      return orders;
    }
  }
}
