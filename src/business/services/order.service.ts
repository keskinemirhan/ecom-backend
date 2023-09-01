import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "../entities/order.entity";
import { DeepPartial, Repository } from "typeorm";
import { AccountService } from "./account.service";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    private accountService: AccountService
  ) {}

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
   * @returns -1 if order with given id not found
   * @returns updated order
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
    if (!order) return -1;
    Object.assign(order, orderModel);
    return await this.orderRepo.save(order);
  }

  /**
   * Removes order with given id
   * @param id id of order
   * @returns -1 if order with given id not found
   * @returns removed item
   */
  async removeOrder(id: string) {
    const order = await this.orderRepo.findOne({
      where: { conversationId: id },
    });
    if (!order) return -1;

    return await this.orderRepo.remove(order);
  }

  /**
   * Returns order with given id
   * @param id id of order
   * @returns -1 if order with given id not found
   * @returns returns order with given id
   */
  async getOrder(id: string) {
    const order = await this.orderRepo.findOne({
      where: { conversationId: id },
    });
    if (!order) return -1;
    return order;
  }

  /**
   * Returns user with given user id
   * @param userId id of user
   * @returns -1 if user with given id not found
   * @returns order of user
   */
  async getOrdersByUser(userId: string) {
    const user = await this.accountService.getUserById(userId);
    if (user === -1) return -1;
    const orders = await this.orderRepo.find({ where: { user } });
    return orders;
  }
}
