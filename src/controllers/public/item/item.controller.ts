import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { ApiBadGatewayResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ItemService } from "src/business/services/item.service";
import { customError, errorApiInfo } from "src/controllers/dto/errors";
import { ResponseAllItemsDto } from "./dto/response-all-items.dto";
import { ResponseItemDto } from "./dto/response-item.dto";

@ApiTags("Item Public Getters")
@Controller("item")
export class ItemController {
  constructor(private itemService: ItemService) {}
  @ApiOkResponse({
    type: ResponseItemDto,
    description: "Returns item with given id",
  })
  @ApiBadGatewayResponse(errorApiInfo(["I001"]))
  @Get("id/:id")
  async getItem(@Param() params: any) {
    const item = await this.itemService.getItem(params.id);
    if (item === -1) throw new BadRequestException(customError("I001"));
    return item;
  }

  @ApiOkResponse({
    type: ResponseAllItemsDto,
    description: "Returns items with stock quantity higher than 0 ",
  })
  @Get("stock")
  async getAllItemsStock() {
    const items = await this.itemService.getAllItems(true);
    return {
      items,
    };
  }

  @ApiOkResponse({
    type: ResponseAllItemsDto,
    description: "Returns all items ",
  })
  @Get()
  async getAllItems() {
    const items = await this.itemService.getAllItems(false);
    return {
      items,
    };
  }
}
