import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../entities/category.entity";
import { DeepPartial, FindOptionsRelations, Repository } from "typeorm";
import { CategoryNotFoundException } from "../exceptions/category";

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
   * @throws {CategoryNotFound}
   */
  async getOneCategory(id: string, relations?: FindOptionsRelations<Category>) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations,
    });
    if (!category) throw new CategoryNotFoundException();
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
   * @returns updated category
   * @throws {CategoryNotFoundException}
   */
  async updateCategory(categoryModel: DeepPartial<Category>) {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryModel.id },
    });
    if (!category) throw new CategoryNotFoundException();
    Object.assign(category, categoryModel);

    return await this.categoryRepo.save(category);
  }

  /**
   * Removes category with given id
   * @param id id of category to be removed
   * @returns removed cateogory
   * @throws {CategoryNotFoundException}
   */
  async removeCategory(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new CategoryNotFoundException();

    const removed = await this.categoryRepo.remove(category);

    return removed;
  }
}
