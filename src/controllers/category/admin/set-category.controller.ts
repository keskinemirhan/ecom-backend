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
import { CategoryService } from "src/business/services/category.service";
import { ResponseAddCategoryDto } from "./dto/response-add-category.dto";
import { RequestAddCategoryDto } from "./dto/request-add-category.dto";
import { RequestUpdateCategoryDto } from "./dto/request-update-category.dto";
import { customError, errorApiInfo } from "src/controllers/dto/errors";
import { ResponseUpdateCategoryDto } from "./dto/response-update-category.dto";
import { ResponseRemoveCategoryDto } from "./dto/response-remove-category.dto";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Admin Category Setters")
@UseGuards(AdminAuthGuard)
@Controller("setcategory")
export class SetCategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOkResponse({
    description: "Creates item and returns created item",
    type: ResponseAddCategoryDto,
  })
  @Post()
  async createCategory(
    @Body() requestAddCategory: RequestAddCategoryDto
  ): Promise<ResponseAddCategoryDto> {
    const created = await this.categoryService.createCategory(
      requestAddCategory
    );
    return {
      created,
    };
  }

  @ApiOkResponse({
    description: "Updates item and returns updated item",
    type: ResponseUpdateCategoryDto,
  })
  @ApiBadRequestResponse(errorApiInfo(["CATEGORY_NOT_FOUND"]))
  @Patch(":id")
  async updateCategory(
    @Body() requestUpdateCategory: RequestUpdateCategoryDto,
    @Param() params: any
  ): Promise<ResponseUpdateCategoryDto> {
    const categoryModel = { ...requestUpdateCategory, id: params.id };
    const updated = await this.categoryService.updateCategory(categoryModel);

    return {
      updated,
    };
  }

  @ApiOkResponse({
    description: "Removes item and returns removed item",
    type: ResponseRemoveCategoryDto,
  })
  @ApiBadRequestResponse(errorApiInfo(["CATEGORY_NOT_FOUND"]))
  @Delete(":id")
  async removeCategory(
    @Param() params: any
  ): Promise<ResponseRemoveCategoryDto> {
    const id = params.id;

    const removed = await this.categoryService.removeCategory(id);

    return {
      removed,
    };
  }
}
