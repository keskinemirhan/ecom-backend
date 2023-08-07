import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { JwtPayload } from "src/business/decorators/jwt-payload.decorator";
import { AuthGuard } from "src/business/guards/auth.guard";
import { BasketService } from "src/business/services/basket.service";
import { customError } from "src/controllers/dto/errors";
import { RequestBasketItemDto } from "./dto/request-basket-item.dto";
@UseGuards(AuthGuard)
@Controller("basket")
export class BasketController {
  constructor(private basketService: BasketService) {}

  @Get()
  async getBasket(@JwtPayload() payload: any) {
    const basket = await this.basketService.getBasketByUserId(payload["id"]);

    if (basket === -1) throw new BadRequestException(customError("AC001"));

    const total = this.basketService.calculateBasketPrice(basket);

    return {
      basket,
      total,
    };
  }

  @Post()
  async addBasketItem(
    @Body() requestAddBasket: RequestBasketItemDto,
    @JwtPayload() payload: any
  ) {
    const userId = payload["id"];
    const itemId = requestAddBasket.itemId;
    const quantity = requestAddBasket.quantity;
    const basket = await this.basketService.addBasketItem(
      userId,
      itemId,
      quantity
    );

    if (basket === -1) throw new BadRequestException(customError("B001"));

    if (basket === 1) throw new BadRequestException(customError("AC001"));

    if (basket === 2) throw new BadRequestException(customError("B002"));

    const total = this.basketService.calculateBasketPrice(basket);

    return {
      basket,
      total,
    };
  }

  @Delete()
  async removeBasketItem(
    @Body() requestRemoveBasket: RequestBasketItemDto,
    @JwtPayload() payload: any
  ) {
    const userId = payload["id"];
    const itemId = requestRemoveBasket.itemId;
    const quantity = requestRemoveBasket.quantity;

    const basket = await this.basketService.removeBasketItem(
      userId,
      itemId,
      quantity
    );

    if (basket === -1) throw new BadRequestException(customError("B001"));

    if (basket === 1) throw new BadRequestException(customError("AC001"));

    const total = this.basketService.calculateBasketPrice(basket);

    return {
      basket,
      total,
    };
  }
}
