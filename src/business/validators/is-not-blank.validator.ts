import { minDate, registerDecorator, ValidationOptions } from "class-validator";
/**
 * Validates if string and trims string
 * compares length of trimmed string with given length
 * @param minLength - minimum length of the trimmed string
 * @param maxLength - maximum length of the trimmed string
 */
export function IsNotBlank(
  minLength: number,
  maxLength: number,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isNotBlank",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: Object.assign(
        {
          message: `${propertyName} must be a string and must be longer than or equal to  ${minLength} and must be shorter than or equal to ${maxLength}`,
        },
        validationOptions
      ),

      validator: {
        validate(value: any) {
          return (
            typeof value === "string" &&
            value.trim().length >= minLength &&
            value.trim().length <= maxLength
          );
        },
      },
    });
  };
}
