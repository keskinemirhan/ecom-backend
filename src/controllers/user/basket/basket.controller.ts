import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "src/business/decorators/current-user.decorator";
import { AuthGuard } from "src/business/guards/auth.guard";
import { BasketService } from "src/business/services/basket.service";
import { customError, errorApiInfo } from "src/controllers/dto/errors";
import { RequestUpdateBasketItemDto } from "./dto/request-update-basket-item";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ResponseBasketDto } from "./dto/response-basket.dto";
import { User } from "src/business/entities/user.entity";

// TODO : swagger
@ApiTags("User Basket Endpoints")
@UseGuards(AuthGuard)
@Controller("basket")
export class BasketController {
  constructor(private basketService: BasketService) {}

  @ApiOkResponse({
    description:
      "Updates basket item with given properties returns basket with extra information",
    type: ResponseBasketDto,
  })
  @ApiBadRequestResponse(
    errorApiInfo([
      "USER_NOT_FOUND",
      "ITEM_NOT_FOUND",
      "BASKET_LIMIT_EXCEEDED",
      "INSUFFICIENT_STOCK",
    ])
  )
  @Post()
  async updateBasket(
    @Body() requestUpdateBasketItem: RequestUpdateBasketItemDto,
    @CurrentUser() payload: User
  ) {
    const userId = payload.id;
    const itemId = requestUpdateBasketItem.itemId;
    const count = requestUpdateBasketItem.count;

    const basket = await this.basketService.updateBasketItem(
      userId,
      itemId,
      count
    );

    const totalCount = await this.basketService.calculateBasketCount(userId);
    const totalPrice = await this.basketService.calculateBasketPrice(userId);
    return {
      basket,
      totalCount,
      totalPrice,
    };
  }

  @ApiOkResponse({
    description: "Returns basket with extra information",
    type: ResponseBasketDto,
  })
  @ApiBadRequestResponse(errorApiInfo(["USER_NOT_FOUND"]))
  @Get()
  async getBasket(@CurrentUser() payload: User) {
    const userId = payload.id;

    const basket = await this.basketService.getBasketByUserId(userId);

    const totalCount = await this.basketService.calculateBasketCount(
      userId as string
    );
    const totalPrice = await this.basketService.calculateBasketPrice(
      userId as string
    );
    return {
      basket,
      totalCount,
      totalPrice,
    };
  }

  @ApiOkResponse({
    description:
      "Removes item with given id returns basket with extra properties",
    type: ResponseBasketDto,
  })
  @ApiBadRequestResponse(
    errorApiInfo(["USER_NOT_FOUND", "BASKET_ITEM_NOT_FOUND"])
  )
  @Delete(":id")
  async removeItem(@Param() params: any, @CurrentUser() payload: User) {
    const itemId = params.id;
    const userId = payload.id;

    const basket = await this.basketService.removeBasketItem(userId, itemId);

    const totalCount = await this.basketService.calculateBasketCount(userId);
    const totalPrice = await this.basketService.calculateBasketPrice(userId);
    return {
      basket,
      totalCount,
      totalPrice,
    };
  }

  @ApiOkResponse({
    description: "Removes entire basket items ",
    type: ResponseBasketDto,
  })
  @ApiBadRequestResponse(errorApiInfo(["USER_NOT_FOUND"]))
  @Delete()
  async removeAllBasket(@CurrentUser() payload: User) {
    const userId = payload.id;
    const basket = await this.basketService.removeAllBasketItem(userId);

    const totalCount = await this.basketService.calculateBasketCount(userId);
    const totalPrice = await this.basketService.calculateBasketPrice(userId);

    return {
      basket,
      totalCount,
      totalPrice,
    };
  }
}
