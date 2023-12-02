import { ServiceException } from "./service.exception";

export class CategoryException extends ServiceException {
  message = "Category error";
}

export class CategoryNotFoundException extends CategoryException {
  message = "Category not found";
  readonly code = "C001";
}
