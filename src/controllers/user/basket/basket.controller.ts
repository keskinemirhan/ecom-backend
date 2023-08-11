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
import { JwtPayload } from "src/business/decorators/jwt-payload.decorator";
import { AuthGuard } from "src/business/guards/auth.guard";
import { BasketService } from "src/business/services/basket.service";
import { customError, errorApiInfo } from "src/controllers/dto/errors";
import { RequestUpdateBasketItemDto } from "./dto/request-update-basket-item";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ResponseBasketDto } from "./dto/response-basket.dto";

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
  @ApiBadRequestResponse(errorApiInfo(["AC001", "B001", "B002", "B003"]))
  @Post()
  async updateBasket(
    @Body() requestUpdateBasketItem: RequestUpdateBasketItemDto,
    @JwtPayload() payload: any
  ) {
    const userId = payload.id;
    const itemId = requestUpdateBasketItem.itemId;
    const count = requestUpdateBasketItem.count;

    const basket = await this.basketService.updateBasketItem(
      userId,
      itemId,
      count
    );

    if (basket === -1) throw new BadRequestException(customError("AC001"));

    if (basket === 1) throw new BadRequestException(customError("B001"));

    if (basket === 2) throw new BadRequestException(customError("B002"));

    if (basket === 3) throw new BadRequestException(customError("B003"));

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
  @ApiBadRequestResponse(errorApiInfo(["AC001"]))
  @Get()
  async getBasket(@JwtPayload() payload: any) {
    const userId = payload.id;

    const basket = await this.basketService.getBasketByUserId(userId);

    if (basket === -1) throw new BadRequestException(customError("AC001"));

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
  @ApiBadRequestResponse(errorApiInfo(["AC001", "B001"]))
  @Delete(":id")
  async removeItem(@Param() params: any, @JwtPayload() payload: any) {
    const itemId = params.id;
    const userId = payload.id;

    const basket = await this.basketService.removeBasketItem(userId, itemId);

    if (basket === -1) throw new BadRequestException(customError("AC001"));

    if (basket === 1) throw new BadRequestException(customError("B001"));

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
  @ApiBadRequestResponse(errorApiInfo(["AC001"]))
  @Delete()
  async removeAllBasket(@JwtPayload() payload: any) {
    const userId = payload.id;
    const basket = await this.basketService.removeAllBasketItem(userId);

    if (basket === -1) throw new BadRequestException(customError("AC001"));

    const totalCount = await this.basketService.calculateBasketCount(userId);
    const totalPrice = await this.basketService.calculateBasketPrice(userId);

    return {
      basket,
      totalCount,
      totalPrice,
    };
  }
}
