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
import { RequestStartTdsDto } from "./dto/request-starttds.dto";
import { BasketService } from "src/business/services/basket.service";
import { OrderService } from "src/business/services/order.service";
import { AuthGuard } from "src/business/guards/auth.guard";
import { customError, errorApiInfo } from "src/controllers/dto/errors";
import { CurrentUser } from "src/business/decorators/current-user.decorator";
import { AddressService } from "src/business/services/address.service";
import { AccountService } from "src/business/services/account.service";
import { Request, Response } from "express";
import { User } from "src/business/entities/user.entity";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ResponseStarTdsDto } from "./dto/response-starttds.dto";
import { ResponsePaymentEmitterDto } from "./dto/response-paymentEmitter.dto";
import { RequestPaymentEmitterDto } from "./dto/request-paymentEmitter.dto";

@ApiTags("Payment")
@Controller("payment")
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private basketService: BasketService,
    private orderService: OrderService,
    private addressService: AddressService,
    private accountService: AccountService
  ) {}

  @ApiOkResponse({
    description: "Checkout endpoint, takes payment info and starts 3D payment",
    type: ResponseStarTdsDto,
  })
  @ApiBadRequestResponse(
    errorApiInfo(["USER_NOT_FOUND", "ADDRESS_NOT_FOUND", "EMPTY_BASKET"])
  )
  @UseGuards(AuthGuard)
  @Post()
  async startThreeDs(
    @Body() startTds: RequestStartTdsDto,
    @CurrentUser() currentUser: User,
    @Res() res: Response,
    @Req() req: Request
  ) {
    const user = await this.accountService.getUserById(currentUser["id"]);
    const basket = await this.basketService.getBasketByUserId(user.id);
    const address = await this.addressService.getAddress({
      where: { user: { id: user.id } },
    });

    if (basket.length === 0)
      throw new BadRequestException(customError("EMPTY_BASKET"));
    const totalPrice = await this.basketService.calculateBasketPrice(user.id);

    const order = await this.orderService.createOrder({
      totalPrice: String(totalPrice),
      isPaid: false,
      isDelivered: false,
      isCanceled: false,
      isRequested: false,
      isFailed: false,
      basketItems: basket,
      shippingAddress: address,
      billingAddress: address,
      user,
      paymentId: "waiting payment provider to respond",
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
        ip: req.socket.remoteAddress,
      },
      async (err, result) => {
        if (err !== null || result.status !== "success") {
          await this.orderService.updateOrder(order.conversationId, {
            isFailed: true,
            isRequested: true,
            requestedAt: new Date(),
            failedAt: new Date(),
          });
          res.send({
            ...err,
            ...result,
            conversationId: undefined,
          });
        } else {
          await this.orderService.updateOrder(order.conversationId, {
            isRequested: true,
            requestedAt: new Date(),
          });
          res.send({
            ...result,
            conversationId: undefined,
          });
        }
      }
    );
  }
  // continue error responses
  @ApiOkResponse({
    description: "Emits Iyzico response",
    type: ResponsePaymentEmitterDto,
  })
  @ApiBadRequestResponse(
    errorApiInfo([
      "MD0",
      "MD2",
      "MD3",
      "MD4",
      "MD5",
      "MD6",
      "MD7",
      "MD8",
      "MD9",
      "ORDER_NOT_FOUND",
      "USER_NOT_FOUND",
    ])
  )
  @Post("emitter")
  async emit(@Res() res: Response, @Body() body: RequestPaymentEmitterDto) {
    if (body.status !== "success" || body.mdStatus !== "1") {
      switch (body.mdStatus) {
        case "0":
          throw new BadRequestException(customError("MD0"));
        case "2":
          throw new BadRequestException(customError("MD2"));
        case "3":
          throw new BadRequestException(customError("MD3"));
        case "4":
          throw new BadRequestException(customError("MD4"));
        case "5":
          throw new BadRequestException(customError("MD5"));
        case "6":
          throw new BadRequestException(customError("MD6"));
        case "7":
          throw new BadRequestException(customError("MD7"));
        case "8":
          throw new BadRequestException(customError("MD8"));
        default:
          throw new BadRequestException(customError("MD9"));
      }
    }

    const order = await this.orderService.getOrder({
      where: {
        conversationId: body.conversationId,
        isPaid: false,
        isDelivered: false,
        isCanceled: false,
        isRequested: true,
        isFailed: false,
      },
    });

    const updatedOrder = await this.orderService.updateOrder(
      order.conversationId,
      {
        paymentId: body.paymentId,
      }
    );

    await this.paymentService.completeThreeDs(
      body.conversationId,
      body.paymentId,
      body.conversationData,
      async (err: any, result: any) => {
        if (err !== null || result.status !== "success") {
          await this.orderService.updateOrder(body.conversationId, {
            isFailed: true,
            failedAt: new Date(),
          });
          res.send({
            status: result.status || "failure",
            errorCode: result.errorCode || "unknown",
            errorMessage: result.errorMessage || "unknown",
            errorGroup: result.errorGroup || "unknown",
            conversationId: result.conversationId || "unknown",
          });
        } else {
          await this.orderService.updateOrder(body.conversationId, {
            isPaid: true,
            paidAt: new Date(),
          });
          const currentOrder = await this.orderService.getOrder({
            where: {
              conversationId: body.conversationId,
            },
            relations: {
              user: true,
            },
          });
          const removedBasket = await this.basketService.getBasketByUserId(
            currentOrder.user.id
          );
          const totalPrice = await this.basketService.calculateBasketPrice(
            currentOrder.user.id
          );
          const removeResult = await this.basketService.removeAllBasketItem(
            currentOrder.user.id
          );

          res.send({
            status: result.status,
            conversationId: result.conversationId,
            items: removedBasket,
            price: totalPrice,
          });
        }
      }
    );
  }
}
