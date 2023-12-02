import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { CategoryService } from "src/business/services/category.service";
import { customError, errorApiInfo } from "src/controllers/dto/errors";
import { ResponseCategoryDto } from "./dto/response-category.dto";
import { ResponseAllCategoriesDto } from "./dto/response-all-categories.dto";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Category Public Getters")
@Controller("category")
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOkResponse({
    type: ResponseCategoryDto,
    description: "Returns category by id",
  })
  @ApiBadRequestResponse(errorApiInfo(["CATEGORY_NOT_FOUND"]))
  @Get(":id")
  async getCategory(@Param() params: any): Promise<ResponseCategoryDto> {
    const category = await this.categoryService.getOneCategory(params.id);
    return {
      id: category.id,
      name: category.name,
    };
  }

  @ApiOkResponse({
    type: ResponseAllCategoriesDto,
    description: "Returns all categories",
  })
  @Get()
  async getAllCategories(): Promise<ResponseAllCategoriesDto> {
    const categories = await this.categoryService.getAllCategories();
    return {
      categories,
    };
  }
}
