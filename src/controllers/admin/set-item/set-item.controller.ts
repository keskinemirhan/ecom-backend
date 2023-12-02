import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AdminAuthGuard } from "src/business/guards/admin-auth.guard";
import { AuthGuard } from "src/business/guards/auth.guard";
import { RequestAddItemDto } from "./dto/request-add-item.dto";
import { ItemService } from "src/business/services/item.service";
import { CategoryService } from "src/business/services/category.service";
import { customError, errorApiInfo } from "src/controllers/dto/errors";
import { RequestUpdateItemDto } from "./dto/request-update-item.dto";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ResponseAddItemDto } from "./dto/response-add-item.dto";
import { ResponseUpdateItemDto } from "./dto/response-update-item.dto";
import { ResponseRemoveItemDto } from "./dto/response-remove-item.dto";

@ApiTags("Admin Item Setters")
@UseGuards(AdminAuthGuard)
@Controller("setitem")
export class SetItemController {
  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService
  ) {}

  @ApiOkResponse({
    description: "Adds item with given properties",
    type: ResponseAddItemDto,
  })
  @ApiBadRequestResponse(errorApiInfo(["CATEGORY_NOT_FOUND"]))
  @Post()
  async addItem(@Body() requestAddItem: RequestAddItemDto) {
    const category = await this.categoryService.getOneCategory(
      requestAddItem.categoryId
    );

    const { categoryId, ...itemModel } = requestAddItem;

    const created = await this.itemService.createItem({
      ...itemModel,
      category,
    });

    return created;
  }

  @ApiOkResponse({
    description: "Updates item with given properties",
    type: ResponseUpdateItemDto,
  })
  @ApiBadRequestResponse(errorApiInfo(["ITEM_NOT_FOUND", "CATEGORY_NOT_FOUND"]))
  @Patch(":id")
  async updateItem(
    @Param() params: any,
    @Body() requestUpdateItem: RequestUpdateItemDto
  ) {
    const item = await this.itemService.getItem(params.id);

    const { categoryId, ...itemModel } = requestUpdateItem;

    if (requestUpdateItem.categoryId) {
      const category = await this.categoryService.getOneCategory(
        requestUpdateItem.categoryId
      );

      item.category = category;
    }

    Object.assign(item, itemModel);

    const updated = await this.itemService.updateItem(item);

    return updated;
  }

  @ApiOkResponse({
    description: "Removes item with given properties",
    type: ResponseRemoveItemDto,
  })
  @ApiBadRequestResponse(errorApiInfo(["ITEM_NOT_FOUND"]))
  @Delete(":id")
  async removeItem(@Param() params: any) {
    const removed = await this.itemService.removeItem(params.id);
    return removed;
  }
}
