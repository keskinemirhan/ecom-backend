import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { ApiBadGatewayResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ItemService } from "src/business/services/item.service";
import { customError, errorApiInfo } from "src/controllers/dto/errors";
import { ResponseAllItemsDto } from "./dto/response-all-items.dto";
import { ResponseItemDto } from "./dto/response-item.dto";
import { UtilityService } from "src/business/services/utility.service";

@ApiTags("Item Public Getters")
@Controller("item")
export class ItemController {
  constructor(
    private itemService: ItemService,
    private utilityService: UtilityService
  ) {}
  @ApiOkResponse({
    type: ResponseItemDto,
    description: "Returns item with given id",
  })
  @ApiBadGatewayResponse(errorApiInfo(["ITEM_NOT_FOUND"]))
  @Get("id/:id")
  async getItem(@Param() params: any) {
    const item = await this.itemService.getItem(params.id);
    return item;
  }

  @ApiOkResponse({
    type: ResponseAllItemsDto,
    description: "Returns items with stock quantity higher than 0 ",
  })
  @Get("stock/:page/:size")
  async getAllItemsStock(@Param() params: any) {
    const items = await this.itemService.getAllItems(
      true,
      Number(params.page),
      Number(params.size)
    );
    return this.utilityService.paginateResponse(
      items.items,
      items.page,
      items.take
    );
  }

  @ApiOkResponse({
    type: ResponseAllItemsDto,
    description: "Returns all items ",
  })
  @Get("all/:page/:size")
  async getAllItems(@Param() params: any) {
    const items = await this.itemService.getAllItems(
      false,
      Number(params.page),
      Number(params.size)
    );
    return this.utilityService.paginateResponse(
      items.items,
      items.page,
      items.take
    );
  }
}
