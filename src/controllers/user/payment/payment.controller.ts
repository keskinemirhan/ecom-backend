import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { PaymentService } from "src/business/services/payment.service";
import { StartTdsDto } from "./dto/starttds.dto";
import { BasketService } from "src/business/services/basket.service";
import { OrderService } from "src/business/services/order.service";
import { AuthGuard } from "src/business/guards/auth.guard";
import { customError } from "src/controllers/dto/errors";
import { CurrentUser } from "src/business/decorators/current-user.decorator";
import { AddressService } from "src/business/services/address.service";
import { AccountService } from "src/business/services/account.service";
import { Request, Response } from "express";
import { User } from "src/business/entities/user.entity";

@UseGuards(AuthGuard)
@Controller("payment")
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private basketService: BasketService,
    private orderService: OrderService,
    private addressService: AddressService,
    private accountService: AccountService
  ) {}

  @Post()
  async startThreeDs(
    @Body() startTds: StartTdsDto,
    @CurrentUser() payload: User,
    @Res() res: Response,
    @Req() req: Request
  ) {
    const user = await this.accountService.getUserById(payload["id"]);
    if (user === -1) throw new BadRequestException(customError("AC001"));
    const basket = await this.basketService.getBasketByUserId(payload["id"]);
    if (basket === -1) throw new BadRequestException(customError("AC001"));
    const address = await this.addressService.getAddress(
      startTds.shippingAddressId
    );
    if (address === -1) throw new BadRequestException(customError("AD001"));

    if (basket.length === 0) throw new BadRequestException(customError("P001"));
    const totalPrice = await this.basketService.calculateBasketPrice(
      payload["id"]
    );

    const order = await this.orderService.createOrder({
      totalPrice: String(totalPrice),
      isPaid: false,
      isDelivered: false,
      isCanceled: false,
      basketItems: basket,
      shippingAddress: address,
      billingAddress: address,
      user,
    });

    await this.paymentService.startTds(
      {
        conversationId: order.conversationId,
        price: String(totalPrice),
        cardNumber: startTds.cardNumber,
        cardHolderName: startTds.cardHolderName,
        expireYear: startTds.expireYear,
        expireMonth: startTds.expireMonth,
        cvc: startTds.cvc,
        identityNumber: startTds.identityNumber,
        shippingAddress: address,
        billingAddress: address,
        items: basket,
        user,
        ip: req.ip,
      },
      (err, result) => {
        res.send({
          err,
          result,
        });
      }
    );
  }
}
