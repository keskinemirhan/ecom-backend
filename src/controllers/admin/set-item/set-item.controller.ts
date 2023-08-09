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
  @ApiBadRequestResponse(errorApiInfo(["C001"]))
  @Post()
  async addItem(@Body() requestAddItem: RequestAddItemDto) {
    const category = await this.categoryService.getOneCategory(
      requestAddItem.categoryId
    );

    if (category === -1) throw new BadRequestException(customError("C001"));

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
  @ApiBadRequestResponse(errorApiInfo(["C001", "I001"]))
  @Patch(":id")
  async updateItem(
    @Param() params: any,
    @Body() requestUpdateItem: RequestUpdateItemDto
  ) {
    const item = await this.itemService.getItem(params.id);

    const { categoryId, ...itemModel } = requestUpdateItem;

    if (item === -1) throw new BadRequestException(customError("I001"));

    if (requestUpdateItem.categoryId) {
      const category = await this.categoryService.getOneCategory(
        requestUpdateItem.categoryId
      );

      if (category === -1) throw new BadRequestException(customError("C001"));

      item.category = category;
    }

    Object.assign(item, itemModel);

    const updated = await this.itemService.updateItem(item);

    if (updated === -1) throw new BadRequestException(customError("I001"));

    return updated;
  }

  @ApiOkResponse({
    description: "Removes item with given properties",
    type: ResponseRemoveItemDto,
  })
  @ApiBadRequestResponse(errorApiInfo(["I001"]))
  @Delete(":id")
  async removeItem(@Param() params: any) {
    const removed = await this.itemService.removeItem(params.id);
    if (removed === -1) throw new BadRequestException(customError("I001"));
    return removed;
  }
}
