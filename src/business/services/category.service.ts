import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../entities/category.entity";
import { DeepPartial, FindOptionsRelations, Repository } from "typeorm";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>
  ) {}

  /**
   * Returns all categories
   * @returns all categories
   */
  async getAllCategories() {
    const categories = await this.categoryRepo.find();
    return categories;
  }

  /**
   * Returns category with given id
   * @param id id of category
   * @returns category
   * @returns -1 if category with given id not found
   */
  async getOneCategory(id: string, relations?: FindOptionsRelations<Category>) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations,
    });
    if (!category) return -1;
    return category;
  }

  /**
   * Creates category with given category model
   * @param categoryModel category model
   * @returns created category
   */
  async createCategory(categoryModel: DeepPartial<Category>) {
    return await this.categoryRepo.save(categoryModel);
  }

  /**
   * Updates category with given category model
   * @param categoryModel category model
   * @returns -1 if item with given id in category model not found
   * @returns updated category
   */
  async updateCategory(categoryModel: DeepPartial<Category>) {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryModel.id },
    });
    if (!category) return -1;
    Object.assign(category, categoryModel);

    return await this.categoryRepo.save(category);
  }

  /**
   * Removes category with given id
   * @param id id of category to be removed
   * @returns removed cateogory
   * @returns -1 if category with given id not found
   */
  async removeCategory(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) return -1;

    const removed = await this.categoryRepo.remove(category);

    return removed;
  }
}
